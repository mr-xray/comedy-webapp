import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { Role } from '../roles';
import { JwtResultDto } from '../types';

@Injectable({
  providedIn: 'root',
})
export class JwtProviderService {
  private static readonly authUrl: string = 'jakob-galaxy.at/auth/login';
  private static readonly refreshUrl: string = 'jakob-galaxy.at/auth/refresh';
  private static readonly authHttpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private uuid: string | undefined;
  private refreshToken: string | undefined;
  public authProcess: Subject<boolean> = new Subject();
  private _role: Role | undefined;
  constructor(private http: HttpClient) {}

  public auth(credentials?: { username: string; password: string }) {
    let credent = uuid();
    let postBody = credentials ?? { username: credent, password: credent };
    this.forgeAuthRequest(JwtProviderService.authUrl, postBody).subscribe(
      (jwt) => this.setSession
    );

    setTimeout(() => {
      let role = 'USER';
      if (
        credentials?.username === 'admin' &&
        credentials.password === 'admin'
      ) {
        role = 'ADMIN';
      }
      this.setSession({
        username: postBody.username,
        jwt: 'testing-token-lol',
        role: role,
        refresh: 'refreshtokenhahah',
        expiresIn: 2000000,
      });
    }, 2000);
  }

  public renewToken() {
    let obs = this.forgeAuthRequest(JwtProviderService.refreshUrl, {
      refresh: this.refreshToken,
    });
    obs.subscribe((jwt) => this.setSession);
    return obs;
  }

  private forgeAuthRequest(url: string, authBody: any) {
    return this.http.post(
      JwtProviderService.authUrl,
      authBody,
      JwtProviderService.authHttpHeader
    );
  }

  private setSession(authResult: JwtResultDto) {
    console.log('setting');
    this.refreshToken = authResult.refresh;
    sessionStorage.setItem('jwt', authResult.jwt);
    sessionStorage.setItem('username', authResult.username);
    this._role = authResult.role as Role;
    sessionStorage.setItem('role', authResult.role);
    console.log(sessionStorage.getItem('role'));
    //sessionStorage.setItem('role', authResult.role);
    //console.log(moment().valueOf(), authResult.expiresIn);
    sessionStorage.setItem(
      'expires_at',
      JSON.stringify(
        moment().add(authResult.expiresIn, 'millisecond').valueOf()
      )
    );
    console.log('new authProccess processed');
    this.authProcess.next(!!sessionStorage.getItem('jwt'));
    //sessionStorage.setItem('refreshToken', authResult.refresh);
  }

  public getEarlyExpiryDate(): Date | undefined {
    let expiry = sessionStorage.getItem('expires_at');
    return expiry ? new Date(parseFloat(expiry) - 5000) : undefined;
  }

  public get role(): string | undefined {
    return this._role;
  }
}

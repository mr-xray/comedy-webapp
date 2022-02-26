import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { v4 as uuid } from 'uuid';
import { Role } from '../roles';
import { JwtResultDto } from '../types';

@Injectable({
  providedIn: 'root',
})
export class JwtProviderService {
  private static readonly authUrl: string = environment.apiUrl + '/auth/login';
  private static readonly refreshUrl: string =
    environment.apiUrl + '/auth/refresh';
  private static readonly authHttpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private uuid: string | undefined;
  private refreshToken: string | undefined;
  public authProcess: Subject<boolean> = new Subject();
  private _role: Role | undefined;
  constructor(private http: HttpClient) {}

  public auth(credentials?: { username: string; password: string }) {
    console.log('[JwtProviderService] Sending auth-request');
    let credent = uuid();
    let postBody = credentials ?? { username: credent, password: credent };
    this.forgeAuthRequest(JwtProviderService.authUrl, postBody).subscribe(
      (jwt) => this.setSession(jwt as JwtResultDto)
    );

    /*setTimeout(() => {
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
    }, 2000);*/
  }

  public renewToken() {
    console.log(
      '[JwtProviderService] Forging token renewal request: ',
      this.refreshToken
    );
    this.refreshToken =
      this.refreshToken ?? sessionStorage.getItem('refresh') ?? undefined;
    let obs = this.forgeAuthRequest(JwtProviderService.refreshUrl, {
      refresh: this.refreshToken,
    });
    obs.subscribe((jwt) => this.setSession(jwt as JwtResultDto));
    return obs;
  }

  private forgeAuthRequest(url: string, authBody: any) {
    return this.http.post(url, authBody, JwtProviderService.authHttpHeader);
  }

  private setSession(authResult: JwtResultDto) {
    console.log(
      '[JwtProviderService] Setting session credentials: ',
      authResult
    );
    this.refreshToken = authResult.refreshToken;
    sessionStorage.setItem('refresh', this.refreshToken);
    sessionStorage.setItem('jwt', authResult.accessToken);
    sessionStorage.setItem('username', authResult.username);
    this._role = authResult.role as Role;
    sessionStorage.setItem('role', authResult.role);
    console.log(
      '[JwtProviderService] Assessed role: ',
      sessionStorage.getItem('role')
    );
    //sessionStorage.setItem('role', authResult.role);
    //console.log(moment().valueOf(), authResult.expiresIn);
    let expiry = parseInt((authResult.expireIn as string).replace('ms', ''));
    sessionStorage.setItem(
      'expires_at',
      JSON.stringify(moment().add(expiry, 'millisecond').valueOf())
    );
    console.log('[JwtProviderService] Notifying all subscribers');
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

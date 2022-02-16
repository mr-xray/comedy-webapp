import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { JwtResultDto } from '../types';

@Injectable({
  providedIn: 'root',
})
export class JwtProviderService {
  private static readonly authUrl: string = 'jakob-galaxy.at/login';
  private static readonly authHttpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private uuid: string | undefined;
  private refreshToken: string | undefined;
  constructor(private http: HttpClient) {}

  public auth(credentials?: { username: string; password: string }) {
    let postBody = credentials ?? { username: uuid(), password: '' };
    this.forgeAuthRequest(postBody).subscribe((jwt) => this.setSession);
  }

  public renewToken() {
    let obs = this.forgeAuthRequest({ refresh: this.refreshToken });
    obs.subscribe((jwt) => this.setSession);
    return obs;
  }

  private forgeAuthRequest(authBody: any) {
    return this.http.post(
      JwtProviderService.authUrl,
      authBody,
      JwtProviderService.authHttpHeader
    );
  }

  private setSession(authResult: JwtResultDto) {
    this.refreshToken = authResult.refresh;
    sessionStorage.setItem('jwt', authResult.jwt);
    sessionStorage.setItem('username', authResult.username);
    sessionStorage.setItem(
      'expires_at',
      JSON.stringify(
        moment().add(authResult.expiresIn, 'millisecond').valueOf()
      )
    );
    //sessionStorage.setItem('refreshToken', authResult.refresh);
  }
}

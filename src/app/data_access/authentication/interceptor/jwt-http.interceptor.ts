import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { JwtProviderService } from '../service/jwt-provider.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { JwtResultDto } from '../types';

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;
  private requestBuffer: HttpRequest<any>[] = [];
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  public constructor(private readonly jwtProvider: JwtProviderService) {}
  /*intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwt = sessionStorage.getItem('jwt');
    console.log('[HttpInterceptor] Intercepted new ', req);
    //console.log('[HttpInterceptor] Appending CORS * ');
    const cors = req.clone({
      headers: req.headers.set('Access-Control-Allow-Origin', '*'),
    });
    let cloned = this.appendToken(cors, jwt);
    return next.handle(cloned).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('[HttpInterceptor] Unauthorized received');
          return this.renewToken(req, next);
        }
        return throwError(error);
      })
    );
  }

  private appendToken(request: HttpRequest<any>, token: string | null) {
    if (token) {
      //console.log('[HttpInterceptor] Appending JWT');
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      });
      return cloned;
    }
    return request;
  }

  private renewToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[HttpInterceptor] Renewing token');
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      console.log('[HttpInterceptor] Set refreshing state for future requests');
      console.log('[HttpInterceptor] Issuing token renewal');
      
      this.jwtProvider.renewToken().subscribe((newToken) => {
        let newJwt = (newToken as JwtResultDto).accessToken;
        console.log('[HttpInterceptor] New token arrived');
        if (newJwt) {
          console.log('[HttpInterceptor] New token valid');
          console.log('[HttpInterceptor] Set state to non-refreshing');
          console.log('[HttpInterceptor] Relaying initial request');
          this.isRefreshing = false;
          next.handle(this.appendToken(request, newJwt));
          console.log('[HttpInterceptor] Working off buffer');
          while (this.requestBuffer.length !== 0) {
            let bufferItem = this.requestBuffer.shift();
            if (bufferItem) {
              next.handle(this.appendToken(bufferItem, newJwt));
            } else {
              break;
            }
          }
          console.log('[HttpInterceptor] Buffer workoff complete');
        } else {
          console.log(
            '[HttpInterceptor] New token invalid! (Should not happen!) '
          );
          console.log('[HttpInterceptor] Buffering initial request ');
          console.log('[HttpInterceptor] Setting state to not refreshing ');
          this.requestBuffer.push(request);
          this.isRefreshing = false;
        }
      });
    } else {
      console.log('[HttpInterceptor] Unauthorized, buffering');
      this.requestBuffer.push(request);
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.appendToken(request, token)))
    );
  }*/
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = sessionStorage.getItem('jwt');
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(error);
      })
    );
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = sessionStorage.getItem('refresh');
      if (token)
        return this.jwtProvider.renewToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.accessToken);

            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    /* for Node.js Express back-end */
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }
}

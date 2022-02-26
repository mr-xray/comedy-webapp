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

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;
  private isGettingFirst: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  public constructor(private readonly jwtProvider: JwtProviderService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwt = sessionStorage.getItem('jwt');
    console.log('[HttpInterceptor] intercepted new ', req);
    console.log('[HttpInterceptor] Appending CORS * ');
    const cors = req.clone({
      headers: req.headers.set('Access-Control-Allow-Origin', '*'),
    });
    let cloned = this.appendToken(cors, jwt);
    return next.handle(cloned).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.renewToken(req, next);
        }
        return throwError(error);
      })
    );
  }

  private appendToken(request: HttpRequest<any>, token: string | null) {
    if (token) {
      console.log('[HttpInterceptor] Appending JWT');
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
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.jwtProvider.renewToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.appendToken(request, token.jwt));
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
      switchMap((token) => next.handle(this.appendToken(request, token)))
    );
  }
}

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtProviderService } from '../service/jwt-provider.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public constructor(
    private router: Router,
    private jwtService: JwtProviderService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authenticated = sessionStorage.getItem('role');
    if (authenticated) {
      if (route.data.roles && route.data.roles.indexOf(authenticated) === -1) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    return true;
  }
}

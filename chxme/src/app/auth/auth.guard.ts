/** make sure that the page are no acces throgh the navigation browser */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  // get the info from the service or  inject the info from the service
  constructor(private authService: AuthService, private route: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isAuth = this.authService.getIsAuthtenticated();
    // if the authenticate are no valid the page will be send to the loggin page
    if (!isAuth) {
      this.route.navigate(['/login']); // the page will be redirected to the login page in case that it is no authticated
    }
    return isAuth;
  }
}

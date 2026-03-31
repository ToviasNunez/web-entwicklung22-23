/** intercep to authentification request and the header  */

import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable() // inject service into a service
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken(); // get the token form the auth-service

    // clone before manipulate a token
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken),
    });

    return next.handle(authRequest);
  }
}

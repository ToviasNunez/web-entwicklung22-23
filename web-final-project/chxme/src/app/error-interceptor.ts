import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { catchError, throwError } from 'rxjs';
import { ErrorComponent } from './error/error.component';
/**
 * intercep the error from the http request 
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      // handle error

      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknow error accurred';

        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage } }); // create a dialog and show the error get the data property from the error
        return throwError(() => error);
      })
    );
  }
}

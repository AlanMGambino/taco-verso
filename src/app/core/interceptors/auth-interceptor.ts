import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  Auth
} from '../services/auth';


export const authInterceptor:
  HttpInterceptorFn = (
    req,
    next
  ) => {

  const auth =
    inject(Auth);


  return next(req).pipe(

    catchError(
      (error: HttpErrorResponse) => {

        if (
          error.status === 401 &&
          auth.getToken()
        ) {

          auth.logout();

        }


        return throwError(
          () => error
        );

      }
    )

  );

};
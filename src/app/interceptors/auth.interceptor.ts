import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { API } from '../config/api';

/**
 * Adds the token to every request sent to our API, if the user is authenticated.
 * No need to add the header by hand in the services anymore.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();

  if (!token || !req.url.startsWith(API.base)) {
    return next(req);
  }

  // The request is immutable: we clone it with the new header
  const authReq = req.clone({ setHeaders: { Authorization: token } });
  return next(authReq);
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/** Only authenticated users can access the route, others are sent to /login */
export const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isAuthenticated()) {
    return true;
  }
  inject(ToastService).show('Connectez-vous pour accéder à cette page.', 'warning');
  // Remember where the user wanted to go, to come back after login
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

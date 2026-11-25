import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { CvList } from './cv/cv-list/cv-list';
import { CvDetail } from './cv/cv-detail/cv-detail';
import { Login } from './auth/login/login';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

// Slice of routes for the Cv feature
export const CV_ROUTES: Routes = [
  {
    path: 'cv',
    children: [
      { path: '', component: CvList },
      // The detail page (which contains Delete) needs authentication
      { path: ':id', component: CvDetail, canActivate: [authGuard] },
    ],
  },
];

export const routes: Routes = [
  { path: '', component: Home },
  ...CV_ROUTES,
  // Already logged in -> no access to login
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: '**', component: NotFound },
];

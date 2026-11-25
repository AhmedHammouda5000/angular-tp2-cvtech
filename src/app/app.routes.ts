import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { CvList } from './cv/cv-list/cv-list';
import { CvDetail } from './cv/cv-detail/cv-detail';

// Slice of routes for the Cv feature
export const CV_ROUTES: Routes = [
  {
    path: 'cv',
    children: [
      { path: '', component: CvList },
      { path: ':id', component: CvDetail },
    ],
  },
];

export const routes: Routes = [
  { path: '', component: Home },
  ...CV_ROUTES,
  { path: '**', component: NotFound },
];

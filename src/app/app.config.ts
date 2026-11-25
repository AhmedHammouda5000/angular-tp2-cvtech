import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding: route params (:id) arrive as component inputs
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    // Bootstrap classes added automatically on every [formField]
    provideSignalFormsConfig({
      classes: {
        // red border only if invalid AND the user touched or modified the field
        'is-invalid': ({ state }) => state().invalid() && (state().touched() || state().dirty()),
        'is-valid': ({ state }) => state().valid() && (state().touched() || state().dirty()),
      },
    }),
  ],
};

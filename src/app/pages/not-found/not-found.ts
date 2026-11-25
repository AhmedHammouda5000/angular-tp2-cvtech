import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="alert alert-danger">
      <h2>404</h2>
      <p>Cette page n'existe pas.</p>
      <a routerLink="/" class="alert-link">Retour à l'accueil</a>
    </div>
  `,
})
export class NotFound {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="p-5 bg-light rounded-3">
      <h1>Bienvenue sur CvTech</h1>
      <p class="lead">La mini plateforme de recrutement.</p>
      <a class="btn btn-primary" routerLink="/cv">Voir les CVs</a>
    </div>
  `,
})
export class Home {}

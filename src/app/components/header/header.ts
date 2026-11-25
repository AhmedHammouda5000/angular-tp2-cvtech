import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  // All the app's links: add a new one here and it appears in the navbar
  protected readonly links = [
    { label: 'Accueil', path: '/', exact: true },
    { label: 'CVs', path: '/cv', exact: false },
  ];
}

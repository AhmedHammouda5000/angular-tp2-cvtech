import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Toasts } from './components/toasts/toasts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Toasts],
  template: `
    <app-header />
    <main class="container">
      <router-outlet />
    </main>
    <app-toasts />
  `,
})
export class App {}

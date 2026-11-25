import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  protected readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // All the app's links: add a new one here and it appears in the navbar
  protected readonly links = computed(() => [
    { label: 'Accueil', path: '/', exact: true },
    { label: 'CVs', path: '/cv', exact: false },
    // Login only when NOT authenticated
    ...(this.authService.isAuthenticated() ? [] : [{ label: 'Login', path: '/login', exact: true }]),
  ]);

  logout(): void {
    this.authService.logout();
    this.toast.success('Vous êtes déconnecté.');
    this.router.navigate(['login']);
  }
}

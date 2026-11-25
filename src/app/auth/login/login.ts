import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  email,
  FieldTree,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
} from '@angular/forms/signals';
import { ToastService } from '../../services/toast.service';
import { AuthService, Credentials } from '../../services/auth.service';
import { blacklistEmail } from '../../validators/blacklist-email.validator';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot],
  templateUrl: './login.html',
})
export class Login {
  private readonly toast = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ?returnUrl=... query param (set by authGuard), bound thanks to withComponentInputBinding()
  readonly returnUrl = input<string>();

  // 1. The signal holds the VALUE of the form
  private readonly credentials = signal<Credentials>({ email: '', password: '' });

  // 2. The FieldTree holds the STATE (touched, dirty, valid, errors...)
  protected readonly loginForm = form(
    this.credentials,
    (f) => {
      required(f.email, { message: "L'email est obligatoire" });
      email(f.email, { message: "Le format de l'email est invalide" });
      blacklistEmail(f.email); // custom validator
      required(f.password, { message: 'Le mot de passe est obligatoire' });
      minLength(f.password, 4, {
        message: (password) =>
          `Au moins 4 caractères (actuellement ${password.value().length})`,
      });
    },
    {
      // Called by [formRoot] on submit, only if the form is valid
      submission: {
        action: async () => {
          try {
            await firstValueFrom(this.authService.login(this.credentials()));
            this.toast.success(`Bienvenue ${this.credentials().email} !`);
            // Go back to the page the guard blocked, or to the CV list
            this.router.navigateByUrl(this.returnUrl() ?? '/cv');
          } catch (err) {
            const status = (err as HttpErrorResponse).status;
            this.toast.error(
              status === 401 ? 'Email ou mot de passe incorrect.' : 'Connexion impossible au serveur.',
            );
          }
          return undefined;
        },
      },
    },
  );

  /** A field shows its errors only once the user visited (touched) or modified (dirty) it */
  protected showErrors(field: FieldTree<string>): boolean {
    const state = field();
    return state.invalid() && (state.touched() || state.dirty());
  }

  /** At least one field was visited or modified */
  protected readonly formTouched = computed(
    () => this.loginForm().touched() || this.loginForm().dirty(),
  );
}

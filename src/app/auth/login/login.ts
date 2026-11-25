import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { ToastService } from '../../services/toast.service';

interface Credentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot],
  templateUrl: './login.html',
})
export class Login {
  private readonly toast = inject(ToastService);

  // 1. The signal holds the VALUE of the form
  private readonly credentials = signal<Credentials>({ email: '', password: '' });

  // 2. The FieldTree holds the STATE (touched, dirty, valid, errors...)
  protected readonly loginForm = form(
    this.credentials,
    (f) => {
      required(f.email, { message: "L'email est obligatoire" });
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
          this.toast.success(`Formulaire valide : ${this.credentials().email}`);
          return undefined;
        },
      },
    },
  );
}

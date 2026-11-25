import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API } from '../config/api';

export interface Credentials {
  email: string;
  password: string;
}

/** What POST /api/Users/login returns (LoopBack) */
export interface LoginResponse {
  id: string; // the access token
  ttl: number;
  created: string;
  userId: number;
}

const TOKEN_KEY = 'token';
const EMAIL_KEY = 'email';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);

  // State initialised from localStorage so the user stays logged in after a refresh
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly emailSignal = signal<string | null>(localStorage.getItem(EMAIL_KEY));

  readonly token = this.tokenSignal.asReadonly();
  readonly email = this.emailSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  login(credentials: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API.login, credentials).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.id);
        localStorage.setItem(EMAIL_KEY, credentials.email);
        this.tokenSignal.set(response.id);
        this.emailSignal.set(credentials.email);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    this.tokenSignal.set(null);
    this.emailSignal.set(null);
  }
}

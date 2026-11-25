import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { appConfig } from './app.config';
import { API } from './config/api';
import { Cv } from './model/cv';

/**
 * End-to-end-like tests for every TP2 exercise.
 * The real app config is used, only the HTTP backend is faked.
 */

const API_CVS: Cv[] = [
  { id: 101, name: 'Bailly', firstname: 'Stephan', age: 20, cin: 1, job: 'Informaticien', path: '' },
  { id: 102, name: 'Chouakria', firstname: 'Farid', age: 21, cin: 2, job: 'Dev', path: '' },
];

let fixture: ComponentFixture<App>;
let router: Router;
let http: HttpTestingController;
let el: HTMLElement;

function setup(token?: string) {
  TestBed.resetTestingModule();
  localStorage.clear();
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', 'user@mail.com');
  }
  TestBed.configureTestingModule({
    providers: [...appConfig.providers, provideHttpClientTesting()],
  });
  fixture = TestBed.createComponent(App);
  router = TestBed.inject(Router);
  http = TestBed.inject(HttpTestingController);
  el = fixture.nativeElement;
}

async function go(url: string) {
  await router.navigateByUrl(url);
  TestBed.tick();
}

/** Let a click-triggered navigation finish without waiting for open HTTP requests */
async function nav() {
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 0));
    TestBed.tick();
  }
}

async function settle() {
  TestBed.tick();
  await fixture.whenStable();
  TestBed.tick();
}

const text = () => el.textContent ?? '';
const $ = <T extends Element = HTMLElement>(sel: string) => el.querySelector<T>(sel);
const $$ = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));

function type(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('blur'));
  TestBed.tick();
}

afterEach(() => {
  http.verify();
  localStorage.clear();
});

describe('Slide 2 - Header and navigation', () => {
  it('shows all links and displays the matching component', async () => {
    setup();
    await go('/');
    await settle();
    const links = $$('nav .nav-link').map((a) => a.textContent?.trim());
    expect(links).toEqual(['Accueil', 'CVs', 'Login']);
    expect(text()).toContain('Bienvenue sur CvTech');

    $<HTMLAnchorElement>('nav a[href="/cv"]')!.click();
    await nav();
    expect(router.url).toBe('/cv');
    http.expectOne(API.cvs).flush(API_CVS);
    await settle();
    expect(text()).toContain('Liste des CVs');
    expect($('nav a[href="/cv"]')!.classList).toContain('active');
  });

  it('unknown route shows the 404 page', async () => {
    setup();
    await go('/nothing-here');
    await settle();
    expect(text()).toContain('404');
  });
});

describe('Slide 3 - Detail page and delete', () => {
  it('the Détails button goes to the detail page, Delete removes and goes back', async () => {
    setup('tok-123');
    await go('/cv');
    http.expectOne(API.cvs).flush(API_CVS);
    await settle();

    const buttons = $$('app-cv-item button');
    expect(buttons.length).toBe(2);
    buttons[0].click();
    await nav();
    expect(router.url).toBe('/cv/101');

    http.expectOne(API.cvs + 101).flush(API_CVS[0]);
    await settle();
    expect(text()).toContain('Stephan Bailly');
    expect(text()).toContain('Informaticien');

    $$('button').find((b) => b.textContent?.trim() === 'Delete')!.click();
    const del = http.expectOne(API.cvs + 101);
    expect(del.request.method).toBe('DELETE');
    del.flush({ count: 1 });
    await nav();
    expect(router.url).toBe('/cv');
    expect(text()).toContain('a été supprimé');
    http.expectOne(API.cvs).flush([API_CVS[1]]);
    await settle();
    expect($$('app-cv-item').length).toBe(1);
  });
});

describe('Slide 4 - API with fallback', () => {
  it('displays the CVs coming from the API', async () => {
    setup();
    await go('/cv');
    expect(text()).toContain('Chargement');
    http.expectOne(API.cvs).flush(API_CVS);
    await settle();
    expect(text()).toContain('Stephan Bailly');
    expect(text()).not.toContain('Problème');
  });

  it('API error on the list -> fake CVs + error toast', async () => {
    setup();
    await go('/cv');
    http.expectOne(API.cvs).flush('boom', { status: 500, statusText: 'Server Error' });
    await settle();
    expect(text()).toContain('Aymen Sellaouti'); // a fake CV
    expect($('.toast.text-bg-danger')?.textContent).toContain('Problème');
  });

  it('API error on the detail -> fake CV + error toast', async () => {
    setup('tok-123');
    await go('/cv/2');
    http.expectOne(API.cvs + 2).flush('boom', { status: 500, statusText: 'Server Error' });
    await settle();
    expect(text()).toContain('Hassen Ben Salah'); // fake CV with id 2
    expect($('.toast.text-bg-danger')?.textContent).toContain('Problème');
  });
});

describe('Slides 5 to 8 - Login form', () => {
  let email: HTMLInputElement;
  let password: HTMLInputElement;
  let submit: HTMLButtonElement;

  beforeEach(async () => {
    setup();
    await go('/login');
    await settle();
    email = $<HTMLInputElement>('#email')!;
    password = $<HTMLInputElement>('#password')!;
    submit = $<HTMLButtonElement>('button[type="submit"]')!;
  });

  it('slide 5: untouched empty fields have no red border, button disabled', () => {
    expect(email.classList).not.toContain('is-invalid');
    expect(password.classList).not.toContain('is-invalid');
    expect(submit.disabled).toBe(true);
  });

  it('slide 5: touched empty field gets a red border', () => {
    email.dispatchEvent(new Event('blur'));
    TestBed.tick();
    expect(email.classList).toContain('is-invalid');
    expect(password.classList).not.toContain('is-invalid');
  });

  it('slide 5: password needs at least 4 characters', () => {
    type(email, 'me@mail.com');
    type(password, 'abc');
    expect(password.classList).toContain('is-invalid');
    expect(submit.disabled).toBe(true);
    type(password, 'abcd');
    expect(password.classList).not.toContain('is-invalid');
    expect(submit.disabled).toBe(false);
  });

  it('slide 7: error message under the email + error summary', () => {
    expect(text()).not.toContain("L'email est obligatoire");
    type(email, 'not-an-email');
    expect($('#email + .invalid-feedback')?.textContent).toContain("format de l'email");
    expect($('.alert-danger')?.textContent).toContain('erreur');
  });

  it('slide 8: a blacklisted email is rejected', () => {
    type(email, 'spam@spam.com');
    type(password, 'abcd');
    expect(text()).toContain('blacklisté');
    expect(submit.disabled).toBe(true);
  });

  it('slide 12: login stores the token and redirects to the CV list', async () => {
    type(email, 'me@mail.com');
    type(password, 'secret');
    submit.click();
    await Promise.resolve();
    const req = http.expectOne(API.login);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'me@mail.com', password: 'secret' });
    req.flush({ id: 'tok-abc', ttl: 1209600, created: '', userId: 1 });
    await nav();
    expect(localStorage.getItem('token')).toBe('tok-abc');
    expect(router.url).toBe('/cv');
    http.expectOne(API.cvs).flush(API_CVS);
    await settle();
    expect(text()).toContain('Logout');
    expect($$('nav .nav-link').map((a) => a.textContent?.trim())).not.toContain('Login');
  });

  it('slide 12: wrong credentials -> error toast, no token', async () => {
    type(email, 'me@mail.com');
    type(password, 'wrong');
    submit.click();
    await Promise.resolve();
    http.expectOne(API.login).flush({}, { status: 401, statusText: 'Unauthorized' });
    await settle();
    expect(localStorage.getItem('token')).toBeNull();
    expect(text()).toContain('Email ou mot de passe incorrect');
  });
});

describe('Slide 13 - Guards', () => {
  it('not logged in: the detail page redirects to login', async () => {
    setup();
    await go('/cv/101');
    await settle();
    expect(router.url).toBe('/login?returnUrl=%2Fcv%2F101');
    expect(text()).toContain('Connexion');
  });

  it('already logged in: cannot access the login page', async () => {
    setup('tok-123');
    await go('/login');
    expect(router.url).toBe('/cv');
    http.expectOne(API.cvs).flush(API_CVS);
    await settle();
  });
});

describe('Slide 14 - Interceptor', () => {
  it('adds the token when logged in', async () => {
    setup('tok-xyz');
    await go('/cv');
    const req = http.expectOne(API.cvs);
    expect(req.request.headers.get('Authorization')).toBe('tok-xyz');
    req.flush(API_CVS);
    await settle();
  });

  it('adds nothing when not logged in', async () => {
    setup();
    await go('/cv');
    const req = http.expectOne(API.cvs);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush(API_CVS);
    await settle();
  });
});

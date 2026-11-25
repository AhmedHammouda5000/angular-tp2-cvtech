import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cv } from '../model/cv';
import { API } from '../config/api';

// @Service() (Angular 22) = @Injectable({ providedIn: 'root' })
@Service()
export class CvService {
  private readonly http = inject(HttpClient);

  // Fake data: shown when the API is unreachable
  private readonly fakeCvList = signal<Cv[]>([
    { id: 1, name: 'Sellaouti', firstname: 'Aymen', age: 40, cin: 12345678, job: 'Teacher', path: '' },
    { id: 2, name: 'Ben Salah', firstname: 'Hassen', age: 25, cin: 87654321, job: 'Developer', path: '' },
    { id: 3, name: 'Maamouri', firstname: 'Aziz', age: 22, cin: 11223344, job: 'Student', path: '   ' },
  ]);

  // ----- API -----
  getCvs(): Observable<Cv[]> {
    return this.http.get<Cv[]>(API.cvs);
  }

  getCvById(id: number): Observable<Cv> {
    return this.http.get<Cv>(API.cvs + id);
  }

  /** Needs authentication: the token is added by authInterceptor */
  deleteCv(id: number): Observable<unknown> {
    return this.http.delete(API.cvs + id);
  }

  // ----- Fake CVs (fallback) -----
  getFakeCvs(): Cv[] {
    return this.fakeCvList();
  }

  getFakeCvById(id: number): Cv | null {
    return this.fakeCvList().find((cv) => cv.id === id) ?? null;
  }

  deleteFakeCv(id: number): void {
    this.fakeCvList.update((cvs) => cvs.filter((c) => c.id !== id));
  }
}

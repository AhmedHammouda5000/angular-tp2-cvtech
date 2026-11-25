import { Service, signal } from '@angular/core';
import { Cv } from '../model/cv';

// @Service() (Angular 22) = @Injectable({ providedIn: 'root' })
@Service()
export class CvService {
  // Fake data (will be replaced by the API in slide 4)
  private readonly cvs = signal<Cv[]>([
    { id: 1, name: 'Sellaouti', firstname: 'Aymen', age: 40, cin: 12345678, job: 'Teacher', path: '' },
    { id: 2, name: 'Ben Salah', firstname: 'Hassen', age: 25, cin: 87654321, job: 'Developer', path: '' },
    { id: 3, name: 'Maamouri', firstname: 'Aziz', age: 22, cin: 11223344, job: 'Student', path: '   ' },
  ]);

  /** Read-only list: only this service can modify it */
  readonly allCvs = this.cvs.asReadonly();

  findById(id: number): Cv | undefined {
    return this.cvs().find((cv) => cv.id === id);
  }

  deleteCv(cv: Cv): void {
    this.cvs.update((cvs) => cvs.filter((c) => c.id !== cv.id));
  }
}

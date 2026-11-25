import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CvService } from '../../services/cv.service';
import { ToastService } from '../../services/toast.service';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';
import { Cv } from '../../model/cv';

@Component({
  selector: 'app-cv-detail',
  imports: [RouterLink, DefaultImagePipe],
  templateUrl: './cv-detail.html',
})
export class CvDetail {
  private readonly cvService = inject(CvService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // The ":id" route param, received as an input thanks to withComponentInputBinding()
  readonly id = input.required<string>();

  // Reloads automatically every time id() changes
  protected readonly cv = rxResource<Cv | null, number>({
    params: () => +this.id(),
    stream: ({ params: id }) =>
      this.cvService.getCvById(id).pipe(
        catchError(() => {
          this.toast.error('Problème de connexion à l\'API : affichage du CV de test.');
          return of(this.cvService.getFakeCvById(id));
        }),
      ),
    defaultValue: null,
  });

  deleteCv(cv: Cv): void {
    this.cvService.deleteCv(cv.id).subscribe({
      next: () => {
        this.toast.success(`Le CV de ${cv.firstname} ${cv.name} a été supprimé.`);
        this.router.navigate(['cv']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 0) {
          // API unreachable: we are working on the fake CVs
          this.cvService.deleteFakeCv(cv.id);
          this.toast.success(`CV de test ${cv.firstname} ${cv.name} supprimé.`);
          this.router.navigate(['cv']);
        } else {
          this.toast.error(`La suppression a échoué (${err.status}).`);
        }
      },
    });
  }
}

import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { CvService } from '../../services/cv.service';
import { ToastService } from '../../services/toast.service';
import { CvItem } from '../cv-item/cv-item';

@Component({
  selector: 'app-cv-list',
  imports: [CvItem],
  templateUrl: './cv-list.html',
})
export class CvList {
  private readonly cvService = inject(CvService);
  private readonly toast = inject(ToastService);

  // rxResource: exposes value(), isLoading(), error() as signals
  protected readonly cvs = rxResource({
    stream: () =>
      this.cvService.getCvs().pipe(
        // API error -> show the fake CVs + an error toast
        catchError(() => {
          this.toast.error('Problème de connexion à l\'API : affichage des CVs de test.');
          return of(this.cvService.getFakeCvs());
        }),
      ),
    defaultValue: [],
  });
}

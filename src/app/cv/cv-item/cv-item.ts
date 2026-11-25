import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Cv } from '../../model/cv';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';

@Component({
  selector: 'app-cv-item',
  imports: [DefaultImagePipe],
  templateUrl: './cv-item.html',
  host: { class: 'list-group-item d-flex align-items-center gap-3' },
})
export class CvItem {
  readonly cv = input.required<Cv>();
  private readonly router = inject(Router);

  goToDetail(): void {
    this.router.navigate(['cv', this.cv().id]);
  }
}

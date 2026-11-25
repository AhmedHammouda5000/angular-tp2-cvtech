import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CvService } from '../../services/cv.service';
import { DefaultImagePipe } from '../../pipes/default-image.pipe';

@Component({
  selector: 'app-cv-detail',
  imports: [RouterLink, DefaultImagePipe],
  templateUrl: './cv-detail.html',
})
export class CvDetail {
  private readonly cvService = inject(CvService);
  private readonly router = inject(Router);

  // The ":id" route param, received as an input thanks to withComponentInputBinding()
  readonly id = input.required<string>();

  protected readonly cv = computed(() => this.cvService.findById(+this.id()));

  deleteCv(): void {
    const cv = this.cv();
    if (!cv) return;
    this.cvService.deleteCv(cv);
    this.router.navigate(['cv']);
  }
}

import { Component, inject } from '@angular/core';
import { CvService } from '../../services/cv.service';
import { CvItem } from '../cv-item/cv-item';

@Component({
  selector: 'app-cv-list',
  imports: [CvItem],
  templateUrl: './cv-list.html',
})
export class CvList {
  protected readonly cvs = inject(CvService).allCvs;
}

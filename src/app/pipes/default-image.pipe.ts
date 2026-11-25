import { Pipe, PipeTransform } from '@angular/core';

/** Returns a default image when the path is empty or only spaces */
@Pipe({ name: 'defaultImage' })
export class DefaultImagePipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    return path?.trim() ? path : 'images/default.svg';
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'header' })
export class CapitalizeHeaderPipe implements PipeTransform {
  transform(header: string) {
    header = header.replace(/_/g, ' ');
    return header[0].toUpperCase() + header.slice(1).toLowerCase();
  }
}

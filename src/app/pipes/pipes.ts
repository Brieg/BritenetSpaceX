import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'header' })
export class capitalizeHeaderPipe implements PipeTransform {
  transform(header: string) {
    header = header.replace(/_/g, ' ');
    return header[0].toUpperCase() + header.slice(1).toLowerCase();
  }
}

@Pipe({ name: 'secTillLiftOf' })
export class beforeTakeOffPipe implements PipeTransform {
  transform(time: number) {
    return '~ ' + time * -1 + ' s. till liftoff';
  }
}

@Pipe({ name: 'secInAir' })
export class onAirPipe implements PipeTransform {
  transform(time: number) {
    return '~ ' + time + ' on air';
  }
}

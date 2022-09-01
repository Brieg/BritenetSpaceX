import { Component, Input } from '@angular/core';
import { Loadable } from '../../../store/loadable/loadable';

@Component({
  selector: 'loading-container',
  template: `
    <mat-spinner [diameter]="50" *ngIf="loadable?.loading"></mat-spinner>
    <div *ngIf="loadable?.loading">ŁADUJE XD</div>
    <div *ngIf="loadable?.error">{{ loadable.error.message || 'Something went wrong ;(' }}</div>
    <ng-container *ngIf="loadable?.success">
      <ng-content></ng-content>
    </ng-container>
  `,
})
export class LoadingContainerComponent {
  @Input() loadable: Loadable;
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
// DEPRECATED - see loading-container
export class SpinnerService {
  visibility: BehaviorSubject<boolean>;

  constructor() {
    this.visibility = new BehaviorSubject(false);
  }

  show() {
    this.visibility.next(true);
  }

  hide() {
    this.visibility.next(false);
  }
}

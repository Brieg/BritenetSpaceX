import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { doubleLoadShips } from '../../store/reducers/ship.reducers';
import { Observable } from 'rxjs';
import { LoadShip } from '../../store/actions/ship.actions';

@Injectable({
  providedIn: 'root',
})
export class ShipService {
  constructor(private store: Store<{ ship: doubleLoadShips }>) {}

  public getShips(): Observable<doubleLoadShips> {
    let ships$: Observable<doubleLoadShips> = this.store.select((state) => state.ship);
    this.store.dispatch(new LoadShip());
    return ships$;
  }
}

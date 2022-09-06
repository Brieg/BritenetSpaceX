import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadableShips } from '../../store/reducers/ships.reducers';
import { LoadShips } from '../../store/actions/ships.actions';

@Injectable({
  providedIn: 'root',
})
export class ShipService {
  constructor(private store: Store<{ ship: loadableShips }>) {}

  public getShips(): Observable<loadableShips> {
    let ships$: Observable<loadableShips> = this.store.select((state) => state.ship);
    this.store.dispatch(new LoadShips());
    return ships$;
  }
}

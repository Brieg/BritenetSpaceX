import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { loadableShips } from '../../../store/reducers/ships.reducers';
import { LoadShips } from '../../../store/actions/ships.actions';

@Component({
  selector: 'app-ships-list',
  templateUrl: './ships-list.component.html',
})
export class ShipsListComponent implements OnInit {
  constructor(private store: Store<{ ships: loadableShips }>) {}

  public ships$: Observable<loadableShips>;

  ngOnInit(): void {
    this.ships$ = this.store.select((state) => state.ships);
    this.store.dispatch(new LoadShips());
  }
}

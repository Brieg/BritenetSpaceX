import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoadShipsError, LoadShipsSuccess, ShipActionsTypes } from '../actions/ships.actions';
import { HttpDataService } from '../../services/data/http-data.service';

@Injectable()
export class ShipEffects {
  constructor(private actions$: Actions, public dataService: HttpDataService) {}

  public readonly loadShip: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShipActionsTypes.Load),
      switchMap((_) => {
        return this.dataService.loadShips().pipe(
          map((response: any) => new LoadShipsSuccess({ entities: response })),
          catchError((error) => of(new LoadShipsError(error)))
        );
      })
    );
  });
}

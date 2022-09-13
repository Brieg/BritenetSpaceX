import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { HttpDataService } from '../../services/data/http-data.service';
import { IShip } from '../../interfaces/ships';
import { LoadShipError, LoadShipSuccess, ShipActionsTypes } from '../actions/ship.actions';
import { LoadShipsError, LoadShipsSuccess, ShipsActionsTypes } from '../actions/ships.actions';

@Injectable()
export class ShipEffects {
  constructor(private actions$: Actions, public dataService: HttpDataService) {}

  public readonly loadShips: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShipsActionsTypes.Load),
      switchMap((_) => {
        return this.dataService.loadShips().pipe(
          map((response: any) => new LoadShipsSuccess({ entities: response })),
          catchError((error) => of(new LoadShipsError(error)))
        );
      })
    );
  });

  public readonly loadShip: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShipActionsTypes.Load),
      switchMap((action) =>
        // @ts-ignore
        this.dataService.loadShip(action.payload.parameters).pipe(
          map((response: IShip) => new LoadShipSuccess({ entities: response })),
          catchError((error) => of(new LoadShipError(error)))
        )
      )
    );
  });
}

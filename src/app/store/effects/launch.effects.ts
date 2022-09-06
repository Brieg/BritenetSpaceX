import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LaunchesActionsTypes, LoadLaunchesError, LoadLaunchesSuccess } from '../actions/launches.actions';
import { HttpDataService } from '../../services/data/http-data.service';
import { ILaunches } from '../../interfaces/launches';
import { LoadLaunchSuccess, LaunchOneActionsTypes } from '../actions/launch.actions';

@Injectable()
export class LaunchEffects {
  constructor(private actions$: Actions, public dataService: HttpDataService) {}

  public readonly loadLaunches: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(LaunchesActionsTypes.Load),
      switchMap((_) => {
        return this.dataService.loadLaunches().pipe(
          map((response: ILaunches[]) => new LoadLaunchesSuccess({ entities: response })),
          catchError((error) => of(new LoadLaunchesError(error)))
        );
      })
    );
  });

  public readonly loadOneLaunch: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(LaunchOneActionsTypes.Load),
      switchMap((action) =>
        // @ts-ignore
        this.dataService.loadLaunch(action.payload.parameters).pipe(
          map((response: ILaunches) => new LoadLaunchSuccess({ entities: response })),
          catchError((error) => of(new LoadLaunchesError(error)))
        )
      )
    );
  });
}

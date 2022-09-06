import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LaunchActionsTypes, LoadLaunchError, LoadLaunchSuccess } from '../actions/launch.actions';
import { HttpDataService } from '../../services/data/http-data.service';
import { ILaunches } from '../../interfaces/launches';
import { LoadOneLaunchSuccess, LaunchOneActionsTypes } from '../actions/oneLaunch.actions';

@Injectable()
export class LaunchEffects {
  constructor(private actions$: Actions, public dataService: HttpDataService) {}

  public readonly loadLaunch: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(LaunchActionsTypes.Load),
      switchMap((_) => {
        return this.dataService.loadLaunches().pipe(
          map((response: ILaunches[]) => new LoadLaunchSuccess({ entities: response })),
          catchError((error) => of(new LoadLaunchError(error)))
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
          map((response: ILaunches) => new LoadOneLaunchSuccess({ entities: response })),
          catchError((error) => of(new LoadLaunchError(error)))
        )
      )
    );
  });
}

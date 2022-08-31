import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of, pipe } from 'rxjs';

import { ILaunches } from '../../interfaces/launches';
import { LoadLaunchError, LoadLaunchSuccess, LaunchActionsTypes } from '../actions/launch.actions';

@Injectable()
export class LaunchEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  public readonly loadLaunch: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(LaunchActionsTypes.Load),
      switchMap((action) => {
        return this.http.get<ILaunches[]>('https://api.spacexdata.com/v3/launches').pipe(
          map((response: any) => new LoadLaunchSuccess({ entities: response })),
          catchError((error) => of(new LoadLaunchError(error)))
        );
      })
    );
  });
}

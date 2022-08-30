import * as LaunchActions from '../actions/launch.actions';
import { ILaunches } from '../../interfaces/launches';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, Observable, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from '../../services/data/data.service';

@Injectable()
export class LaunchEffects {
  constructor(private readonly actions$: Actions, private dataService: DataService) {}

  public readonly loadLaunches$: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(LaunchActions.LoadLaunch),
      exhaustMap(() =>
        this.dataService.loadLaunches().pipe(
          map((data: ILaunches[]) => LaunchActions.LoadLaunchSuccess({ data })),
          catchError((error: string | null) => of(LaunchActions.LoadLaunchFailure({ error })))
        )
      )
    );
  });
}

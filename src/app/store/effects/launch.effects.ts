import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoadLaunchError, LoadLaunchSuccess, LaunchActionsTypes } from '../actions/launch.actions';
import { HttpDataService } from '../../services/data/http-data.service';

@Injectable()
export class LaunchEffects {
  constructor(private actions$: Actions, public dataService: HttpDataService) {}

  public readonly loadLaunch: Observable<any> = createEffect(() => {
    return this.actions$.pipe(
      ofType(LaunchActionsTypes.Load),
      switchMap((_) => {
        return this.dataService.loadLaunches().pipe(
          map((response: any) => new LoadLaunchSuccess({ entities: response })),
          catchError((error) => of(new LoadLaunchError(error)))
        );
      })
    );
  });
}

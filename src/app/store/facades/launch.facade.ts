import { LaunchState } from '../states/launch.state';
import * as launchesSelectors from '../selectors/launch.selectors';
import * as launchesActions from '../actions/launch.actions';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ILaunches } from '../../interfaces/launches';

@Injectable()
export class LaunchFacade {
  public readonly loaded$: Observable<boolean> = this.store.pipe(select(launchesSelectors.getLaunchesLoaded));
  public readonly allLaunches$: Observable<ILaunches[]> = this.store.pipe(select(launchesSelectors.getAllLaunches));

  constructor(private readonly store: Store<LaunchState>) {}
  public init(): void {
    this.store.dispatch(launchesActions.Init());
  }
  public loadLaunches(): void {
    this.store.dispatch(launchesActions.LoadLaunch());
  }
}

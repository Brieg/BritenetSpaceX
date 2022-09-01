import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { doubleLoadLaunches } from '../../store/reducers/launch.reducers';
import { Observable } from 'rxjs';
import { LoadLaunch } from '../../store/actions/launch.actions';

@Injectable({
  providedIn: 'root',
})
export class LaunchService {
  constructor(private store: Store<{ launch: doubleLoadLaunches }>) {}

  public getLaunches(): Observable<doubleLoadLaunches> {
    let launches$: Observable<doubleLoadLaunches> = this.store.select((state) => state.launch);
    this.store.dispatch(new LoadLaunch());
    return launches$;
  }
}

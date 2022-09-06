import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { doubleLoadLaunches } from '../../../store/reducers/launch.reducers';
import { LoadLaunch } from '../../../store/actions/launch.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.component.html',
})
export class LaunchesListComponent implements OnInit {
  constructor(private store: Store<{ launches: doubleLoadLaunches }>) {}

  public launches$: Observable<doubleLoadLaunches>;

  ngOnInit(): void {
    this.launches$ = this.store.select((state) => state.launches);
    this.store.dispatch(new LoadLaunch());
  }
}

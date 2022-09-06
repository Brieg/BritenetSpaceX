import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadableLaunches } from '../../../store/reducers/launches.reducers';
import { LoadLaunches } from '../../../store/actions/launches.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.component.html',
})
export class LaunchesListComponent implements OnInit {
  constructor(private store: Store<{ launches: LoadableLaunches }>) {}

  public launches$: Observable<LoadableLaunches>;

  ngOnInit(): void {
    this.launches$ = this.store.select((state) => state.launches);
    this.store.dispatch(new LoadLaunches());
  }
}

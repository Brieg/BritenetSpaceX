import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoadLaunch } from '../../../store/actions/launch.actions';
import { doubleLoadLaunches } from '../../../store/reducers/launch.reducers';

@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.component.html',
})
export class LaunchesListComponent implements OnInit {
  public launches$: Observable<doubleLoadLaunches>;

  constructor(private store: Store<{ launch: doubleLoadLaunches }>) {}

  public getLaunches() {
    this.launches$ = this.store.select((state) => state.launch);
    const action = new LoadLaunch();
    console.log(action);
    this.store.dispatch(action);
  }

  ngOnInit(): void {
    this.getLaunches();
  }
}

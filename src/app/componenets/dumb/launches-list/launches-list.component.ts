import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { doubleLoadLaunches } from '../../../store/reducers/launch.reducers';
import { LaunchService } from '../../../services/launch/launch.service';

@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.component.html',
})
export class LaunchesListComponent implements OnInit {
  constructor(private launchService: LaunchService) {}

  public launches$: Observable<doubleLoadLaunches>;

  ngOnInit(): void {
    this.launches$ = this.launchService.getLaunches();
  }
}

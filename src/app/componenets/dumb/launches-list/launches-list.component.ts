import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILaunches } from '../../../interfaces/launches';
import { DataService } from '../../../services/data/data.service';
import { LaunchFacade } from '../../../store/facades/launch.facade';
import { BehaviorSubject, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchesListComponent implements OnInit {
  public launches: ILaunches[] = [];
  // public launches: BehaviorSubject<ILaunches[]> = new BehaviorSubject<ILaunches[]>(null!);

  constructor(private launchFacade: LaunchFacade) {}

  public getLaunches() {
    this.launchFacade.loadLaunches();

    this.launchFacade.loaded$
      .pipe(
        filter((isLoaded: boolean) => isLoaded === true),
        switchMap(() => this.launchFacade.allLaunches$)
      )
      .subscribe((launch: ILaunches[]) => {
        //this.launches.next(launch);
        this.launches = launch;
        console.log(launch);
      });
  }

  ngOnInit(): void {
    this.getLaunches();
  }
}

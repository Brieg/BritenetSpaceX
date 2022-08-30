import { ChangeDetectionStrategy,  Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { ILaunches } from 'src/app/interfaces/launches';
import { DataService } from '../../../services/data/data.service';
import { IShip } from '../../../interfaces/ships';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchPageComponent implements OnInit {
  public launch: ILaunches;
  public AShips: IShip[] = []
  public ships$: any[] = [];

  public containTimeLine: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public containImages: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public containShips: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public spinnerService: SpinnerService, private route: ActivatedRoute, private dataService: DataService) {}

  public getLaunch(flight_number: number) {
    this.dataService.loadLaunch(flight_number).subscribe((launch) => {
      this.launch = launch;

      !!launch.links.flickr_images.length;

      this.containTimeLine.next(Object.keys(launch.timeline).length > 2);

      if (launch.ships?.length) {
        this.containShips.next(true);
        this.ships$ = launch.ships.map((element) => {
          return this.dataService.loadShip(element).pipe(map((ship) => ship));
        });

        forkJoin(this.ships$).subscribe((ships) => {
          this.AShips = ships; //data will be structured as [res[0], res[1], ...]
        });
      }
    });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get('flight_number'));

    this.getLaunch(launchNumberFromRoute);
  }
}

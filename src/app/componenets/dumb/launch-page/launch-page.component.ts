import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { IShip } from '../../../interfaces/ships';
import { LoadLaunch } from '../../../store/actions/launch.actions';
import { LoadableLaunch } from '../../../store/reducers/launch.reducers';

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
  public launch$: Observable<LoadableLaunch>;
  public AShips: IShip[] = [];
  public ships$: any[] = [];

  public containImages: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public containShips: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private route: ActivatedRoute,

    private store: Store<{ launch: LoadableLaunch }>
  ) {}

  public getLaunch(flight_number: number) {
    this.launch$ = this.store.select((state) => state.launch).pipe();
    this.store.dispatch(new LoadLaunch({ parameters: flight_number }));

    //!!launch.links.flickr_images.length;

    //this.containTimeLine.next(Object.keys(launch.timeline).length > 2);
    //
    // if (launch.ships?.length) {
    //   this.containShips.next(true);
    //   this.ships$ = launch.ships.map((element) => {
    //     return this.dataService.loadShip(element).pipe(map((ship) => ship));
    //   });
    //
    //   forkJoin(this.ships$).subscribe((ships) => {
    //     this.AShips = ships; //data will be structured as [res[0], res[1], ...]
    //   });
    // }
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const flight_numberFromRoute = Number(routeParams.get('flight_number'));
    this.getLaunch(flight_numberFromRoute);
  }
}

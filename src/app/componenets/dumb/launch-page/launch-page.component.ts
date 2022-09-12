import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { IShip } from '../../../interfaces/ships';
import { LoadLaunch } from '../../../store/actions/launch.actions';
import { loadableLaunch } from '../../../store/reducers/launch.reducers';
import { HttpDataService } from '../../../services/data/http-data.service';

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
  constructor(
    private route: ActivatedRoute,
    private store: Store<{ launch: loadableLaunch }>,
    private dataService: HttpDataService
  ) {}

  public launch$: Observable<loadableLaunch>;
  public ships$: Observable<IShip>[] = [];
  public shipsInLaunch: IShip[];

  public containImages: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public containShips: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public getLaunch(flight_number: number) {
    this.launch$ = this.store.select((state) => state.launch);
    this.store.dispatch(new LoadLaunch({ parameters: flight_number }));

    this.store.subscribe((data) => {
      if (data.launch.success === true) {
        this.ships$ = data.launch.entities.ships.map((element) => {
          return this.dataService.loadShip(element).pipe(map((ship) => ship));
        });

        forkJoin(this.ships$).subscribe((ships) => {
          this.shipsInLaunch = ships; //data will be structured as [res[0], res[1], ...]
        });
      }
    });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const flight_numberFromRoute = Number(routeParams.get('flight_number'));
    this.getLaunch(flight_numberFromRoute);
  }
}

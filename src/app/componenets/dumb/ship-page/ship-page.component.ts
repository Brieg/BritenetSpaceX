import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ILaunches } from '../../../interfaces/launches';
import { LoadShip } from '../../../store/actions/ship.actions';
import { loadableShip } from '../../../store/reducers/ship.reducers';
import { HttpDataService } from '../../../services/data/http-data.service';
import { IShip } from '../../../interfaces/ships';

@Component({
  selector: 'app-ship-page',
  templateUrl: './ship-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private store: Store<{ ship: loadableShip }>,
    private dataService: HttpDataService
  ) {}

  public ship$: Observable<loadableShip>;
  public launches$: Observable<ILaunches>[] = [];
  public launchesInShips: ILaunches[] = [];
  public containLaunches: BehaviorSubject<ILaunches[]> = new BehaviorSubject<ILaunches[]>([]);

  public containShipLocation: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //public containLaunches: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public getShip(ship_id: string) {
    this.ship$ = this.store.select((state) => state.ship).pipe();
    this.store.dispatch(new LoadShip({ parameters: ship_id }));

    this.store.subscribe((data) => {
      if (data.ship.success === true) {
        this.launches$ = data.ship.entities.missions.map((element) => {
          return this.dataService.loadLaunch(element.flight).pipe(map((flightId) => flightId));
        });

        forkJoin(this.launches$).subscribe((launches) => {
          this.launchesInShips = launches; //data will be structured as [res[0], res[1], ...]
          this.containLaunches.next(Object.assign([], launches));
        });
      }
    });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const shipId = routeParams.get('ship_id') as string;
    this.getShip(shipId);
  }
}

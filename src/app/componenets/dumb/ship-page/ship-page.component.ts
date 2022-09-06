import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ILaunches } from '../../../interfaces/launches';
import { LoadShip } from '../../../store/actions/ship.actions';
import { loadableShip } from '../../../store/reducers/ship.reducers';

@Component({
  selector: 'app-ship-page',
  templateUrl: './ship-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipPageComponent implements OnInit {
  public ship$: Observable<loadableShip>;

  public ALaunches: ILaunches[];
  public Launches$: any[];

  public containShipLocation: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public containLaunches: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private route: ActivatedRoute, private store: Store<{ ship: loadableShip }>) {}

  public getShip(ship_id: string) {
    this.ship$ = this.store.select((state) => state.ship).pipe();
    this.store.dispatch(new LoadShip({ parameters: ship_id }));

    // this.dataService.loadShip(ship_id).subscribe((ship) => {
    //   this.ship = ship;
    //
    //   this.containShipLocation.next(ship.position.longitude !== null);
    //
    //   if (ship.missions?.length) {
    //     this.containLaunches.next(true);
    //     this.Launches$ = ship.missions.map((element) => {
    //       return this.dataService.loadLaunch(element.flight).pipe(map((flightId) => flightId));
    //     });
    //
    //     forkJoin(this.Launches$).subscribe((flightId) => {
    //       this.ALaunches = flightId;
    //     });
    //   }
    // });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const shipId = routeParams.get('ship_id') as string;
    this.getShip(shipId);
  }
}

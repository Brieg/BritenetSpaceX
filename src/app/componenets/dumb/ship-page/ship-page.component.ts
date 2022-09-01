import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { IShip } from '../../../interfaces/ships';
import { HttpDataService } from '../../../services/data/http-data.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ILaunches } from '../../../interfaces/launches';

@Component({
  selector: 'app-ship-page',
  templateUrl: './ship-page.component.html',
})
export class ShipPageComponent implements OnInit {
  public ship: IShip;

  public ALaunches: ILaunches[];
  public Launches$: any[];

  public containShipLocation: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public containLaunches: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private dataService: HttpDataService
  ) {}

  public getShip(ship_id: string) {
    this.dataService.loadShip(ship_id).subscribe((ship) => {
      this.ship = ship;

      this.containShipLocation.next(ship.position.longitude !== null);

      if (ship.missions?.length) {
        this.containLaunches.next(true);
        this.Launches$ = ship.missions.map((element) => {
          return this.dataService.loadLaunch(element.flight).pipe(map((flightId) => flightId));
        });

        forkJoin(this.Launches$).subscribe((flightId) => {
          this.ALaunches = flightId;
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

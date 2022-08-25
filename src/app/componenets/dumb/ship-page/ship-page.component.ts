import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { IShip } from '../../../interfaces/ships';
import { DataService } from '../../../services/data/data.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ILaunches } from '../../../interfaces/launches';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ship-page',
  templateUrl: './ship-page.component.html',
})
export class ShipPageComponent implements OnInit {
  public ship: IShip;

  public test: boolean = true;

  public ALaunches: ILaunches[];
  public Launches$: any[];

  // Pagination
  public pageLength: number = 0;
  public pageSize: number = 3;
  public pageSizeOptions: number[] = [this.pageSize, this.pageSize + 3];
  public pageEvent: PageEvent | undefined;

  constructor(
    public spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private dataService: DataService
  ) {}

  public getShip(ship_id: string) {
    this.dataService.loadShip(ship_id).subscribe((ship) => {
      this.ship = ship;
      console.log(ship)

      this.Launches$ = ship.missions.map(element => {
        return this.dataService.loadLaunch(element.flight).pipe(map(flightId => flightId));
      });

      forkJoin(this.Launches$).subscribe( flightId => {
        this.Launches$ = flightId; //data will be structured as [res[0], res[1], ...]
        this.ALaunches = this.Launches$.slice((0 + 1 - 1) * this.pageSize).slice(0, this.pageSize);
        console.log(this.Launches$.length)
        this.pageLength = this.Launches$.length;
      });
    });
  }

  public OnPaginate(event: PageEvent): void {
    const offset = (event.pageIndex + 1 - 1) * event.pageSize;
    this.ALaunches = this.Launches$.slice(offset).slice(0, event.pageSize);
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const shipId = routeParams.get('ship_id') as string;
    this.getShip(shipId);
  }
}

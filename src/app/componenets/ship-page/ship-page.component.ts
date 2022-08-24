import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { IShip } from '../../interfaces/ships';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-ship-page',
  templateUrl: './ship-page.component.html',
  styleUrls: ['./ship-page.component.scss'],
})
export class ShipPageComponent implements OnInit {
  public ship: IShip;

  public test: boolean = true;

  constructor(public spinnerService: SpinnerService, private route: ActivatedRoute, private httpClient: HttpClient, private dataService: DataService) {}

  public getShip(ship_id:string) {
    this.dataService.loadShip(ship_id).subscribe(ship => {
      this.ship = ship;
    });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const shipId = routeParams.get('ship_id') as string;

    this.getShip(shipId);
  }
}

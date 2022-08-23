import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IShip } from '../../interfaces/ships';

@Component({
  selector: 'app-ship-page',
  templateUrl: './ship-page.component.html',
  styleUrls: ['./ship-page.component.scss'],
})
export class ShipPageComponent implements OnInit {
  public ship: IShip;

  public test: boolean = true;

  constructor(public spinnerService: SpinnerService, private route: ActivatedRoute, private httpClient: HttpClient) {}

  shipIsActive(status: boolean) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = routeParams.get('ship_id');

    this.httpClient.get<any>('https://api.spacexdata.com/v3/ships/' + launchNumberFromRoute).subscribe((ship) => {
      this.ship = ship;
      console.log(ship);
    });
  }
}

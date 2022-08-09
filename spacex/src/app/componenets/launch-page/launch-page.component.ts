import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ILaunches } from 'src/app/interfaces/launches';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.scss']
})
export class LaunchPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) { }

  public launch: ILaunches;

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get("flight_number"));

    this.httpClient.get<any>('https://api.spacexdata.com/v3/launches/'+launchNumberFromRoute)
      .subscribe(launch => {
          this.launch = launch;
      }, error => {
        console.error('Something went wrong.');
      });
  }

}

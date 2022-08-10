import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common'
import { HttpClient } from "@angular/common/http";

import { ILaunches } from 'src/app/interfaces/launches';
import {SpinnerService} from '../../services/spinner/spinner.service';


@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.scss']
})
export class LaunchPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer : DomSanitizer,
    private location: Location,
    public spinnerService: SpinnerService
  ) { }

  public launch: ILaunches;

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get("flight_number"));

    this.httpClient.get<any>('https://api.spacexdata.com/v3/launches/'+launchNumberFromRoute)
      .subscribe(launch => {
          this.launch = launch;
          console.log(launch)
      }, error => {
        console.error('Something went wrong.');
      });
  }

  renderYTvide(URL: any): SafeResourceUrl {
    this.sanitizer.bypassSecurityTrustResourceUrl
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+URL+'?autoplay=1&mute=1&origin=http://localhost:4200/ | safe');
  }

  goBack(): void {
    console.log("YEY")
    this.location.back()
  }

}

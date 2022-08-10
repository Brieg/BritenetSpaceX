import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common'
import { HttpClient } from "@angular/common/http";

import { NgImageSliderComponent } from 'ng-image-slider';

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

  @ViewChild('imageslider') slider: NgImageSliderComponent;
  public images: [{}] = [{}];

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get("flight_number"));

    this.httpClient.get<any>('https://api.spacexdata.com/v3/launches/'+launchNumberFromRoute)
      .subscribe(launch => {
          this.launch = launch;
          this.imagesToArray(launch.links.flickr_images);
          console.log(this.images)
          console.log(launch)
      }, error => {
        console.error('Something went wrong.');
      });
  }

  goBack(): void {
    this.location.back()
  }

  renderYTvide(URL: any): SafeResourceUrl {
    this.sanitizer.bypassSecurityTrustResourceUrl
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+URL+'?autoplay=1&mute=1&origin=http://localhost:4200/ | safe');
  }

  imagesToArray(images: []): void {
    images.forEach(image => {
     this.images.push({"image": image, "thumbImage": image});
    })
  }



}

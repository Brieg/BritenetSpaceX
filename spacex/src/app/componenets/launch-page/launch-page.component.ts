import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { ILaunches } from 'src/app/interfaces/launches';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.scss'],
})
export class LaunchPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private location: Location,
    public spinnerService: SpinnerService
  ) {}

  public launch: ILaunches;
  public images: Array<any> = [];
  public widthPX: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthPX = window.innerWidth;
    console.log(this.widthPX)
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get('flight_number'));

    this.httpClient.get<any>('https://api.spacexdata.com/v3/launches/' + launchNumberFromRoute).subscribe(
      (launch) => {
        this.launch = launch;
        console.log(launch);
        if(launch.links.flickr_images.length) {
          this.imagesToArray(launch.links.flickr_images);
        }
      },
      (error) => {
        console.error('Something went wrong.');
      }
    );

    this.widthPX = window.innerWidth;
    console.log(this.widthPX)
  }

  goBack(): void {
    this.location.back();
  }

  renderYT(URL: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/' + URL + '?autoplay=1&mute=1&rel=0&enablejsapi=1&wmode=transparent'
    );
  }

  imagesToArray(images: []): void {
    images.forEach((image) => {
      this.images.push({ name: image });
    });
  }
}

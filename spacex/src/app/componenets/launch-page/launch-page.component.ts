import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ILaunches } from 'src/app/interfaces/launches';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { interval, Observable } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ITimeline } from '../../interfaces/timeline';

export interface progressBar {
  min: number;
  max: number;
  val: number;
}

@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchPageComponent implements OnInit {
  constructor(
    public spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private location: Location,
    private _formBuilder: FormBuilder
  ) {}

  @Input() public groundProgressbarValue = 100;
  @Input() public airProgressbarValue = 100;
  @Input() public secTillLiftoff: number = 0;
  @Input() public secInAir: number = 0;

  public launch: ILaunches;
  public images: Array<any> = [];
  public widthPX: number = 0;

  public groundTimeline: ITimeline[] = new Array();
  public airTimeline: ITimeline[] = new Array();

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthPX = window.innerWidth;
  }

  public goBack(): void {
    this.location.back();
  }

  public renderYT(URL: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube-nocookie.com/embed/' + URL + '?autoplay=1&mute=1&rel=0&enablejsapi=1&wmode=transparent'
    );
  }

  public imagesToArray(images: []): void {
    images.forEach((image) => {
      this.images.push({ name: image });
    });
  }

  public startAirTimer(seconds: number) {
    const timerInterval = interval(1000);
    const subone = timerInterval.subscribe((sec) => {
      this.airProgressbarValue = 100 - (sec * 100) / seconds;
      this.secInAir = sec;
      if (this.secInAir === seconds) {
        subone.unsubscribe();
      }
    });
  }

  public startGroundTimer(begin: number, end: number) {
    const timer$ = interval(50);
    const sub = timer$.subscribe((sec) => {
      this.groundProgressbarValue = 100 - (sec * 100) / begin;
      this.secTillLiftoff = sec;


      console.log(begin - this.secTillLiftoff)

      //this.groundTimeline[0].isVisible = true;
      //this.groundTimeline[1].isVisible = true;

      this.groundTimeline.forEach((element, index) => {
        if((begin - this.secTillLiftoff) == element.seconds) {
          console.log((begin - this.secTillLiftoff))
          console.log(element)
          element.isVisible = true;
          this.groundTimeline[element.order + 1].isVisible = true;
          this.groundTimeline[element.order - 1].isVisible = true;
        }
      })

      if (this.secTillLiftoff === begin) {
        this.startAirTimer(end);
        sub.unsubscribe();
      }
    });
  }

  public buildTimeline(timeline: {}) {
    let timelineArray = Object.entries(timeline).map(([event, time]) => ({ event, time }));
    timelineArray.sort(function (a, b) {
      // @ts-ignore
      return a.time - b.time;
    });

    timelineArray.forEach((element, index) => {
      const header = element.event;
      (element.time as number) < 0
        ? this.groundTimeline.push(<ITimeline>{
            seconds: (element.time as number) * -1,
            header,
            isVisible: false,
            more: '~ ' + (element.time as number) * -1 + ' s. till liftoff',
            order: index,
          })
        : this.airTimeline.push(<ITimeline>{
            seconds: element.time,
            header,
            isVisible: false,
            order: index,
          });
    });

    console.log(this.groundTimeline);

  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get('flight_number'));

    this.widthPX = window.innerWidth;

    this.httpClient.get<any>('https://api.spacexdata.com/v3/launches/' + launchNumberFromRoute).subscribe(
      (launch) => {
        this.launch = launch;
        if (launch.links.flickr_images.length) {
          this.imagesToArray(launch.links.flickr_images);
        }
        launch.links.flickr_images.length ? this.imagesToArray(launch.links.flickr_images) : null;

        this.buildTimeline(launch.timeline);

        const min = Math.max.apply(
          Math,
          this.groundTimeline.map((a) => a.seconds)
        );
        const max = Math.max.apply(
          Math,
          this.airTimeline.map((a) => a.seconds)
        );
        console.log(min)
        this.startGroundTimer(min, max);
      },
      (error) => {
        console.error('Something went wrong.');
      }
    );
  }
}

import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ILaunches } from 'src/app/interfaces/launches';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { BehaviorSubject, interval } from 'rxjs';
import { ITimeline } from '../../interfaces/timeline';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchPageComponent implements OnInit {
  constructor(
    public spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {}

  @ViewChild('stepperGround') private stepperGround: MatStepper;
  @ViewChild('stepperAir') private stepperAir: MatStepper;

  public groundProgressbarValue: BehaviorSubject<number> = new BehaviorSubject(100);
  public airProgressbarValue: BehaviorSubject<number> = new BehaviorSubject(100);

  public secTillLiftoff: number = 0;
  public secInAir: number = 0;

  public launch: ILaunches;
  public images: Array<any> = [];
  public widthPX: number = 0;

  public containTimeLine: boolean = false;
  public groundTimeline: ITimeline[] = new Array();
  public airTimeline: ITimeline[] = new Array();

  // Offset as number 1
  private offset: number = 1;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthPX = window.innerWidth;
  }

  public goBack(): void {
    this.location.back();
  }

  public renderYT(URL: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + URL + '?autoplay=1&mute=1');
  }

  public imagesToArray(images: []): void {
    images.forEach((image) => {
      this.images.push({ name: image });
    });
  }

  public timelineStepperSetter(
    timeline: ITimeline[],
    startFrom: number,
    currentSeconds: number,
    stepper: MatStepper
  ): void {
    timeline.forEach((element, index) => {
      if (startFrom - currentSeconds == element.seconds) {
        element.isVisible = true;
        if (index === 0) {
          timeline[index + this.offset].isVisible = true;
        } else {
          timeline[index + this.offset].isVisible = true;
          setTimeout(() => {
            timeline[index - this.offset].isVisible = false;
            stepper.selectedIndex = this.offset;
          }, 100);
          timeline[index + this.offset + this.offset].isVisible = true;
        }
      }
    });
  }

  private startAirTimer(end: number): void {
    const timerInterval = interval(50);
    const subone = timerInterval.subscribe((sec) => {
      this.airProgressbarValue.next(100 - (sec * 100) / end);
      this.secInAir = sec;

      this.timelineStepperSetter(this.airTimeline, end, this.secInAir, this.stepperAir);

      if (this.secInAir === end) {
        subone.unsubscribe();
      }
    });
  }

  private startGroundTimer(begin: number, end: number): void {
    const timer$ = interval(50);
    const sub = timer$.subscribe((sec) => {
      this.groundProgressbarValue.next(100 - (sec * 100) / begin);
      this.secTillLiftoff = sec;

      this.timelineStepperSetter(this.groundTimeline, begin, this.secTillLiftoff, this.stepperGround);

      if (this.secTillLiftoff === begin) {
        // Object.keys(this.groundTimeline).reduce((accumulator, key) => {
        //   return {...accumulator, [key]: false};
        // }, {});
        this.startAirTimer(end);
        sub.unsubscribe();
      }
    });
  }

  public capitalizeHeader(event: string): string {
    let header = event.replace(/_/g, ' ');
    return header[0].toUpperCase() + header.slice(1).toLowerCase();
  }

  public buildTimeline(timeline: {}): void {
    let timelineArray = Object.entries(timeline).map(([event, time]) => ({ event, time }));
    // @ts-ignore
    timelineArray.sort((a, b) => a.time - b.time);

    this.groundTimeline = timelineArray
      .filter((element) => (element.time as number) < 0)
      .map((item) => ({
        seconds: (item.time as number) * -1,
        header: this.capitalizeHeader(item.event),
        isVisible: false,
        more: '~ ' + (item.time as number) * -1 + ' s. till liftoff',
      }));

    this.airTimeline = timelineArray
      .filter((element) => (element.time as number) > 0)
      .map((item) => ({
        seconds: item.time as number,
        header: this.capitalizeHeader(item.event),
        isVisible: false,
      }));
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

        if (Object.keys(launch.timeline).length > 2) {
          this.containTimeLine = true;
          this.buildTimeline(launch.timeline);
        }

        const min = Math.max.apply(
          Math,
          this.groundTimeline.map((a) => a.seconds)
        );
        const max = Math.max.apply(
          Math,
          this.airTimeline.map((a) => a.seconds)
        );
        this.startGroundTimer(min, max);
      },
      (error) => {
        console.error('Something went wrong.');
      }
    );
  }
}

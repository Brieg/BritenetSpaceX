import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ITimeline } from '../../interfaces/timeline';
import { ILaunches } from 'src/app/interfaces/launches';
import { DataService } from '../../services/data/data.service';

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
  @ViewChild('stepperGround') private stepperGround: MatStepper;
  @ViewChild('stepperAir') private stepperAir: MatStepper;

  public groundProgressbarValue: BehaviorSubject<number> = new BehaviorSubject(100);
  public airProgressbarValue: BehaviorSubject<number> = new BehaviorSubject(100);

  public secTillLiftoff: BehaviorSubject<number> = new BehaviorSubject(0);
  public secInAir: BehaviorSubject<number> = new BehaviorSubject(0);

  public launch: ILaunches;

  public containImages: boolean = false;
  public images: Array<any> = [];
  public widthPX: number = 0;

  public containTimeLine: boolean = false;
  public groundTimeline: ITimeline[] = new Array();
  public airTimeline: ITimeline[] = new Array();

  // Offset as number 1
  private offset: number = 1;
  private timeInterval: number = 100;

  constructor(
    public spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private location: Location,
    private dataService: DataService,
    private cdref: ChangeDetectorRef,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthPX = window.innerWidth;
  }

  public goBack(): void {
    this.location.back();
  }

  public renderYT(YTid: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/' + YTid + '?autoplay=1&mute=1'
    );
  }

  public imagesToArray(images: string[]): void {
    this.images = images.map((image) => ({
      name: image,
    }));
  }

  public timelineStepperSetter(
    timeline: ITimeline[],
    startFrom: number,
    currentSeconds: number,
    stepper: MatStepper,
    backwards?: boolean
  ): void {
    let seconds = backwards ? currentSeconds : startFrom - currentSeconds;
    timeline.forEach((element, index) => {
      if (seconds == element.seconds) {
        element.isVisible = true;
        index + this.offset > timeline.length ? (timeline[index + this.offset].isVisible = true) : null;
        setTimeout(() => {
          index - this.offset >= 0 ? (timeline[index - this.offset].isVisible = false) : null;
          stepper.selectedIndex = this.offset;
          this.cdref.detectChanges();
        }, 90);
        timeline[index + this.offset + this.offset] !== undefined
          ? (timeline[index + this.offset + this.offset].isVisible = true)
          : null;
      }
    });
  }

  private setVisible(element: ITimeline[], index: number): void {
    element[index].isVisible = true;
  }

  private startAirTimer(end: number): void {
    this.airTimeline[0].isVisible = true;
    this.airTimeline[1].isVisible = true;
    const sub$ = interval(this.timeInterval).subscribe((sec) => {
      this.airProgressbarValue.next(100 - (sec * 100) / end);
      this.secInAir.next(sec);

      this.timelineStepperSetter(this.airTimeline, end, this.secInAir.getValue(), this.stepperAir, true);

      if (this.secInAir.getValue() === end) {
        sub$.unsubscribe();
      }
    });
  }

  private startGroundTimer(begin: number, end: number): void {
    const sub$ = interval(this.timeInterval).subscribe((sec) => {
      this.groundProgressbarValue.next(100 - (sec * 100) / begin);
      this.secTillLiftoff.next(sec);

      this.timelineStepperSetter(this.groundTimeline, begin, this.secTillLiftoff.getValue(), this.stepperGround);

      if (this.secTillLiftoff.getValue() === begin) {
        sub$.unsubscribe();
        this.groundTimeline = this.groundTimeline.map((event) => ({
          ...event,
          isVisible: false,
        }));
        this.startAirTimer(end);
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

  public getLaunch(flight_number:number) {
    this.dataService.loadLaunch(flight_number).subscribe(launch => {
      this.launch = launch;

      if (launch.links.flickr_images.length) {
        this.containImages = true;
        this.imagesToArray(launch.links.flickr_images);
      }

      if (Object.keys(launch.timeline).length > 2) {
        this.containTimeLine = true;
        this.buildTimeline(launch.timeline);
      }

      const groundSeconds = Math.max.apply(
        Math,
        this.groundTimeline.map((a) => a.seconds)
      );
      const airSeconds = Math.max.apply(
        Math,
        this.airTimeline.map((a) => a.seconds)
      );

      this.startGroundTimer(groundSeconds, airSeconds);
    });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get('flight_number'));

    this.widthPX = window.innerWidth;

    this.getLaunch(launchNumberFromRoute);
  }
}

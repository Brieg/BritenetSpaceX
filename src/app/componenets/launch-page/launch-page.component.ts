import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  Pipe,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ITimeline } from '../../interfaces/timeline';
import { ILaunches } from 'src/app/interfaces/launches';
import { IImages } from '../../interfaces/images';
import { toNumbers } from '@angular/compiler-cli/src/version_helpers';

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
  public images: Array<IImages> = [];
  public widthPX: number = 0;

  public containTimeLine: boolean = false;
  public groundTimeline: ITimeline[] = [];
  public airTimeline: ITimeline[] = [];

  // Offset as number 1
  private offset: number = 1;
  private timeInterval: number = 100;

  constructor(
    public spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private location: Location,
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

  public imagesToArray(images: []): void {
    this.images = images.map((image) => ({
      name: image,
    }));
  }

  public timelineEventDetector(
    timeline: ITimeline[],
    startFrom: number,
    currentSeconds: number,
    stepper: MatStepper,
    backwards?: boolean
  ): void {
    let seconds = backwards ? currentSeconds : startFrom - currentSeconds;
    timeline.forEach((timeEvent, index) => {
      if (seconds == timeEvent.seconds) {
        timeEvent.isVisible = true;
        index + this.offset > timeline.length ? timeline[index + this.offset].isVisible = true : null;
          setTimeout(() => {
            index - this.offset >= 0 ? timeline[index - this.offset].isVisible = false : null;
            stepper.selectedIndex = this.offset;
            this.cdref.detectChanges();
          }, 90);
          timeline[index + this.offset + this.offset] !== undefined ? timeline[index + this.offset + this.offset].isVisible = true : null;
      }
    });
  }

  private startAirTimer(end: number): void {
    this.airTimeline[0].isVisible = true;
    this.airTimeline[1].isVisible = true;
    const sub$ = interval(this.timeInterval).subscribe((sec) => {
      this.airProgressbarValue.next(100 - (sec * 100) / end);
      this.secInAir.next(sec);

      this.timelineEventDetector(this.airTimeline, end, this.secInAir.getValue(), this.stepperAir, true);

      if (this.secInAir.getValue() === end) {
        sub$.unsubscribe();
      }
    });
  }

  private startGroundTimer(begin: number, end: number): void {
    const sub$ = interval(this.timeInterval).subscribe((sec) => {
      this.groundProgressbarValue.next(100 - (sec * 100) / begin);
      this.secTillLiftoff.next(sec);

      this.timelineEventDetector(this.groundTimeline, begin, this.secTillLiftoff.getValue(), this.stepperGround);

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

  public buildTimeline(timeline: {}): void {
    // @ts-ignore
    let timelineArray = Object.entries(timeline).map(([event, time]) => ({ event, time })).sort((a, b) => a.time - b.time);

    this.groundTimeline = timelineArray
      .filter((element) => (element.time as number) < 0)
      .map((item) => ({
        seconds: (item.time as number) * -1,
        header: item.event,
        isVisible: false,
      }));

    this.airTimeline = timelineArray
      .filter((element) => (element.time as number) > 0)
      .map((item) => ({
        seconds: item.time as number,
        header: item.event,
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
          this.containImages = true;
          launch.links.flickr_images.length ? this.imagesToArray(launch.links.flickr_images) : null;
        }

        if (Object.keys(launch.timeline).length > 2) {
          this.containTimeLine = true;
          this.buildTimeline(launch.timeline);
        }


        const groundSeconds = Math.max(...this.groundTimeline.map(e => e.seconds));
        const airSeconds = Math.max(...this.airTimeline.map(e => e.seconds));

        this.startGroundTimer(groundSeconds, airSeconds);
      },
      (error) => {
        console.error('Something went wrong.');
      }
    );
  }

}

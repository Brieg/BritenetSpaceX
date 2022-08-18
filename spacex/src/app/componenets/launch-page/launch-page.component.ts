import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ILaunches } from 'src/app/interfaces/launches';
import { SpinnerService } from '../../services/spinner/spinner.service';
import {BehaviorSubject, interval, Observable} from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ITimeline } from '../../interfaces/timeline';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

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
  //changeDetection: ChangeDetectionStrategy.OnPush
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

  @ViewChild('stepperGround') private stepperGround: MatStepper;
  @ViewChild('stepperAir') private stepperAir: MatStepper;

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

  private offset: number = 1;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthPX = window.innerWidth;
  }

  public goBack(): void {
    this.location.back();
  }

  public renderYT(URL: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      ''
      // 'https://www.youtube.com/embed' + URL + '?autoplay=1&mute=1'
    );
  }

  public imagesToArray(images: []): void {
    images.forEach((image) => {
      this.images.push({ name: image });
    });
  }

  public timelineStepperSetter(timeline: ITimeline[], startFrom: number, currentSeconds: number, stepper: MatStepper): void {
    timeline.forEach((element, index) => {
      if (startFrom - currentSeconds == element.seconds) {
        element.isVisible = true;
        if (index === 0) {
          timeline[index + this.offset].isVisible = true;
        } else {
          timeline[index + 1].isVisible = true;
          setTimeout(() => {
            timeline[index - this.offset].isVisible = false;
            stepper.selectedIndex = 1;
          },100);
          timeline[index + 2].isVisible = true;
        }
      }
    });
  }

  public startAirTimer(seconds: number): void {
    const timerInterval = interval(50);
    const subone = timerInterval.subscribe((sec) => {
      this.airProgressbarValue = 100 - (sec * 100) / seconds;
      this.secInAir = sec;

      this.timelineStepperSetter(this.airTimeline, seconds, this.secInAir, this.stepperAir)

      if (this.secInAir === seconds) {
        subone.unsubscribe();
      }
    });
  }

  public startGroundTimer(begin: number, end: number): void {
    const timer$ = interval(50);
    let wasCausedDoubleEvent = false;
    const sub = timer$.subscribe((sec) => {
      this.groundProgressbarValue = 100 - (sec * 100) / begin;
      this.secTillLiftoff = sec;

      this.timelineStepperSetter(this.groundTimeline, begin, this.secTillLiftoff, this.stepperGround)

      if (this.secTillLiftoff === begin) {
        // Object.keys(this.groundTimeline).reduce((accumulator, key) => {
        //   return {...accumulator, [key]: false};
        // }, {});
        this.startAirTimer(end);
        sub.unsubscribe();
      }
    });
  }

  public capitalizeHeader(event:string): string {
    let header = event.replace(/_/g, ' ');
    return header[0].toUpperCase() + header.slice(1).toLowerCase();
  }

  public buildTimeline(timeline: {}):void {
    let timelineArray = Object.entries(timeline).map(([event, time]) => ({ event, time }));
    // @ts-ignore
    timelineArray.sort((a,b) => a.time - b.time);

    this.groundTimeline = timelineArray.filter(element => element.time as number < 0).map(item => ({
      seconds: item.time as number * (-1),
      header: this.capitalizeHeader(item.event),
      isVisible: false,
      more: '~ ' + (item.time as number) * -1 + ' s. till liftoff',
    }));

    this.airTimeline = timelineArray.filter(element => element.time as number > 0).map(item => ({
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

        this.buildTimeline(launch.timeline);

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

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
  //@ViewChild('stepper') private myStepper: MatStepper;

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
    let wasCausedDoubleEvent = false;
    const sub = timer$.subscribe((sec) => {
      this.groundProgressbarValue = 100 - (sec * 100) / begin;
      this.secTillLiftoff = sec;

      this.groundTimeline.forEach((element, index) => {
        if (begin - this.secTillLiftoff == element.seconds) {
          element.isVisible = true;

          if (index === 0) {
            this.groundTimeline[index + this.offset].isVisible = true;
          }

          if (index === this.groundTimeline.length) {
            this.groundTimeline[index - this.offset].isVisible = false;
          }

          if (element.seconds === this.groundTimeline[index + 1].seconds) {
            this.groundTimeline[index + 1].isVisible = true;
            console.log(this.groundTimeline[index + 1])
            let doubleEventInterval = setInterval(() => {
              this.groundTimeline[index - this.offset].isVisible = false;
              this.stepperGround.selectedIndex = index - 1;
              clearInterval(doubleEventInterval);
            }, 20);
            this.groundTimeline[index + 2].isVisible = true;
            wasCausedDoubleEvent = true;

          }

          setTimeout(() => {
            console.log("SHOW :"+index);
            console.log(element);
            this.stepperGround.selectedIndex = this.offset;
          }, );

        }
      });

      if (this.secTillLiftoff === begin) {
        this.startAirTimer(end);
        sub.unsubscribe();
      }
    });
  }

  public buildTimeline(timeline: {}) {
    console.log(timeline)
    let timelineArray = Object.entries(timeline).map(([event, time]) => ({ event, time }));
    timelineArray.sort(function (a, b) {
      // @ts-ignore
      return a.time - b.time;
    });

    //swtich to map
    timelineArray.forEach((element, index) => {
      let header = element.event.replace(/_/g, ' ');
      header = header[0].toUpperCase() + header.slice(1).toLowerCase();

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

  // public onInit() {
  //   this._service.getCounter().subscribe(value=> {
  //     this.count = value; // will not update the view.
  //     this._change.markForCheck(); // tell Angular it's dirty
  //   });
  // }
}

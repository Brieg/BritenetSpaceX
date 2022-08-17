import {ChangeDetectionStrategy, Component, HostListener, Input, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ILaunches} from 'src/app/interfaces/launches';
import {SpinnerService} from '../../services/spinner/spinner.service';
import {interval, Observable} from "rxjs";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ITimeline} from "../../interfaces/timeline";

export interface progressBar {
  min: number;
  max: number;
  val: number;
};

@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class LaunchPageComponent implements OnInit {
  constructor(
    public spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private location: Location,
    private _formBuilder: FormBuilder,
  ) {}

  @Input() public progressbarValue = 100;
  @Input() public progressbarValueTwo = 100;
  @Input() public curSec: number = 0;
  @Input() public curSecTwo: number = 0;

  public launch: ILaunches;
  public images: Array<any> = [];
  public widthPX: number = 0;

  public timeline: ITimeline[];

  form: FormArray;
  formGroup: FormGroup;
  registerFormGroup2 = new FormGroup({
    blogHeading: new FormControl('', [Validators.required]),
    details: new FormControl('', [Validators.required]),
  });

  get f2() {
    return this.registerFormGroup2.controls;
  }

  currentStep:number = 0;

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

  public startTimerTwo(seconds: number) {
    const timerInterval = interval(1000);
    const subone = timerInterval.subscribe((sec) => {
      this.progressbarValueTwo = 100 - sec * 100 / seconds;
      this.curSecTwo = sec;
      console.log(this.curSecTwo)

      if (this.curSecTwo === seconds) {
        subone.unsubscribe();
      }
    });
  }

  public startTimer(seconds: number) {
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / seconds;
      this.curSec = sec;

      if (this.curSec === seconds) {
        console.log("Start!")
        this.startTimerTwo(1000);
        sub.unsubscribe();
      }
    });
  }

  public buildFrame() {
    this.formGroup = this._formBuilder.group({
      form : this._formBuilder.array([this.init()])
    })
    this.addItem();
  }

  init(){
    return this._formBuilder.group({
      cont :new FormControl('', [Validators.required]),
    })
  }

  addItem(){
    this.form = this.formGroup.get('form') as FormArray;
    this.form.push(this.init());
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get('flight_number'));

    this.widthPX = window.innerWidth;

    this.httpClient.get<any>('https://api.spacexdata.com/v3/launches/' + launchNumberFromRoute).subscribe(
      (launch) => {
        this.launch = launch;

        console.log(launch)
        if(launch.links.flickr_images.length) {
          this.imagesToArray(launch.links.flickr_images);
        }

        launch.links.flickr_images.length ? this.imagesToArray(launch.links.flickr_images) : null;

        this.buildFrame();
        console.log(this.formGroup)
        //this.startTimer(5);

      },
      (error) => {
        console.error('Something went wrong.');
      }
    );
  }
}

import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITimeline } from '../../../interfaces/timeline';
import { BehaviorSubject, interval } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  @Input() timeline: {};

  @ViewChild('stepperGround') private stepperGround: MatStepper;
  @ViewChild('stepperAir') private stepperAir: MatStepper;

  public groundTimeline: ITimeline[] = new Array();
  public airTimeline: ITimeline[] = new Array();

  public groundProgressbarValue: BehaviorSubject<number> = new BehaviorSubject(100);
  public airProgressbarValue: BehaviorSubject<number> = new BehaviorSubject(100);

  public secTillLiftoff: BehaviorSubject<number> = new BehaviorSubject(0);
  public secInAir: BehaviorSubject<number> = new BehaviorSubject(0);

  // Offset as number 1
  private offset: number = 1;
  private timeInterval: number = 100;

  constructor(private cdref: ChangeDetectorRef) {}

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

  public buildTimeline(timeline: {}): void {
    let timelineArray = Object.entries(timeline).map(([event, time]) => ({ event, time }));
    // @ts-ignore
    timelineArray.sort((a, b) => a.time - b.time);

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
    this.buildTimeline(this.timeline);

    const groundSeconds = Math.max(...this.groundTimeline.map(e => e.seconds));
    const airSeconds = Math.max(...this.airTimeline.map(e => e.seconds));

    this.startGroundTimer(groundSeconds, airSeconds);
  }
}

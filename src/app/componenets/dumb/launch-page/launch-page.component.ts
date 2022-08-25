import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, interval, mergeMap, Observable, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { ITimeline } from '../../../interfaces/timeline';
import { ILaunches } from 'src/app/interfaces/launches';
import { DataService } from '../../../services/data/data.service';
import { IShip } from '../../../interfaces/ships';
import { map } from 'rxjs/operators';

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

  public launch: ILaunches;
  public AShips: IShip[];
  public ships$: any[];

  public containTimeLine: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public containImages: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public containShips: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public images: Array<any> = [];

  constructor(
    public spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private dataService: DataService,

  ) {}

  public imagesToArray(images: string[]): void {
    this.images = images.map((image) => ({
      name: image,
    }));
  }

  public getLaunch(flight_number: number) {
    this.dataService.loadLaunch(flight_number).subscribe((launch) => {
      this.launch = launch;

      if (launch.links.flickr_images.length) {
        this.containImages.next(true)
        this.imagesToArray(launch.links.flickr_images);
      }

      if (Object.keys(launch.timeline).length > 2) {
        this.containTimeLine.next(true)
      //  this.buildTimeline(launch.timeline);
      }

      if(launch.ships?.length) {
        this.containShips.next(true);
        this.ships$ = launch.ships.map(element => {
          return this.dataService.loadShip(element).pipe(map(ship => ship));
        });

        forkJoin(this.ships$).subscribe(ships => {
          this.AShips = ships; //data will be structured as [res[0], res[1], ...]
        });
      }
    });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const launchNumberFromRoute = Number(routeParams.get('flight_number'));

    this.getLaunch(launchNumberFromRoute);
  }
}

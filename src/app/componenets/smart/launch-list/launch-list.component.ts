import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IShip } from '../../../interfaces/ships';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { ILaunches } from '../../../interfaces/launches';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-launch-list',
  templateUrl: './launch-list.component.html',
  styleUrls: ['./launch-list.component.scss'],
})
export class LaunchListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public dataSource = new MatTableDataSource<IShip[]>([]);

  @Input() showFilter: boolean = false;

  @Input()
  set data(value: ILaunches[]) {
    this._data.next(value);
  }

  get data(): ILaunches[] {
    return this._data.getValue();
  }

  // Pagination
  public pageLength: number = 0;
  public pageSize: number = 7;
  public pageSizeOptions: number[] = [this.pageSize, this.pageSize + 4];
  public pageEvent: PageEvent | undefined;
  public paginationData: ILaunches[] = [];

  public _data = new BehaviorSubject<ILaunches[]>([]);
  public successLunched: boolean[] = [];
  public filteredLaunches: ILaunches[] = [];

  private offset: number = 0;

  public cols$: Observable<number> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
    map((result) => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        return 1 ;
      } else if (result.breakpoints[Breakpoints.Small]) {
        return 2
      } else {
        return 4;
      }
    }),
    shareReplay()
  );

  constructor(public spinnerService: SpinnerService, private breakpointObserver: BreakpointObserver) {}

  public OnPaginate(event: PageEvent): void {
    const offset = (event.pageIndex + 1 - 1) * event.pageSize;
    this.paginationData = this.data.slice(offset).slice(0, event.pageSize);
  }

  public selectionChange(e: MatSelectionListChange): void {
    this.filteredLaunches = this.data.filter((x) => {
      return x.launch_year === e.options[0].value;
    });
    this.displayLaunches(this.filteredLaunches);
  }

  public displayLaunches(launches: ILaunches[]): void {
    this.pageLength = launches.length;
    this.paginationData = launches.slice((0 + 1 - 1) * this.pageSize).slice(0, this.pageSize);
  }

  public setFiltersCategory(launches: ILaunches[]): void {
    this.successLunched = [...new Set(launches.map((launches) => launches.launch_success))];
  }

  public openMarinetraffic(url: string): void {
    window.open(url);
  }

  ngOnInit(): void {
    this._data.subscribe((x) => {
      this.paginationData = this.data.slice((0 + 1 - 1) * this.pageSize).slice(0, this.pageSize);
      this.pageLength = this.data.length;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

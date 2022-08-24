import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSelectionListChange } from '@angular/material/list';
import { HttpClient } from '@angular/common/http';

import { SpinnerService } from '../../services/spinner/spinner.service';
import { ILaunches } from '../../interfaces/launches';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.component.html',
  styleUrls: ['./launches-list.component.scss'],
})
export class LaunchesListComponent implements OnInit {
  // Pagination
  public pageLength: number = 0;
  public pageSize: number = 3;
  public pageSizeOptions: number[] = [this.pageSize, this.pageSize + 4];
  public pageEvent: PageEvent | undefined;

  // Launches
  public launches: ILaunches[] = [];
  public paginationLaunches: ILaunches[] = [];

  public successLunched: boolean[] = [];
  public filteredLaunches: ILaunches[] = [];

  public cols$: Observable<number> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
    map((result) => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        return 2;
      } else if (result.breakpoints[Breakpoints.Small]) {
        return 3;
      } else {
        return 4;
      }
    }),
    shareReplay()
  );

  constructor(
    public spinnerService: SpinnerService,
    private httpClient: HttpClient,
    private breakpointObserver: BreakpointObserver,
    private dataService: DataService
  ) {}


  public getLaunches() {
    this.dataService.loadLaunches().subscribe(launches => {
        this.launches = launches;
        this.displayLaunches(this.launches);
        this.setFiltersCategory(this.launches);
      });
  }

  public OnPaginate(event: PageEvent): void {
    const offset = (event.pageIndex + 1 - 1) * event.pageSize;
    this.paginationLaunches = this.launches.slice(offset).slice(0, event.pageSize);
  }

  public displayLaunches(launches: ILaunches[]): void {
    this.pageLength = launches.length;
    this.paginationLaunches = launches.slice((0 + 1 - 1) * this.pageSize).slice(0, this.pageSize);
  }

  public setFiltersCategory(launches: ILaunches[]): void {
    this.successLunched = [...new Set(launches.map((launches) => launches.launch_success))];
  }

  public selectionChange(e: MatSelectionListChange): void {
    this.filteredLaunches = this.launches.filter((x) => {
      return x.launch_year === e.options[0].value;
    });
    this.displayLaunches(this.filteredLaunches);
  }

  ngOnInit(): void {
    this.getLaunches();
  }
}

import { Component, OnInit } from '@angular/core';
import { PageEvent} from "@angular/material/paginator";

import { LaunchesService } from "../../services/launches/launches.service";
import { ILaunches } from "../../interfaces/launches";

@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.component.html',
  styleUrls: ['./launches-list.component.scss'],
  providers: [ LaunchesService ]
})
export class LaunchesListComponent implements OnInit {

  // Pagination
  public pageLength: number = 0;
  public pageSize: number = 6;
  public pageSizeOptions: number[] = [this.pageSize, this.pageSize + 4];
  public pageEvent: PageEvent | undefined;

  // Launches
  public launches: ILaunches[] = [];
  public paginationLaunches: ILaunches[] = [];

  constructor(
    private launchesService: LaunchesService
  ) { }

  ngOnInit(): void {
    this.launchesService.getLaunches().subscribe(launches => {
      this.launches = launches
    })
  }

  // public displayProducts(launches: ILaunches[]): void {
  //   this.pageLength = launches.length;
  //   this.paginationLaunches = launches.slice(((0 + 1) - 1) * this.pageSize).slice(0, this.pageSize);
  // }
  //
  // OnPaginate(event: PageEvent): void {
  //   const offset = ((event.pageIndex + 1) - 1) * event.pageSize;
  //   this.paginationLaunches = this.launches.slice(offset).slice(0, event.pageSize);
  // }

}

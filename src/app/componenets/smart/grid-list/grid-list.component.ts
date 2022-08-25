import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IShip } from '../../../interfaces/ships';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss'],
})
export class GridListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public dataSource = new MatTableDataSource<IShip[]>([]);

  @Input()
  set data(value: IShip[]) {
    this._data.next(value);
  }

  get data(): IShip[] {
    return this._data.getValue();
  }

  // Pagination
  public pageLength: number = 0;
  public pageSize: number = 8;
  public pageSizeOptions: number[] = [this.pageSize, this.pageSize + 4];
  public pageEvent: PageEvent | undefined;
  public paginationData: IShip[] = [];
  public _data = new BehaviorSubject<IShip[]>([]);

  constructor(public spinnerService: SpinnerService) {}

  public OnPaginate(event: PageEvent): void {
    const offset = (event.pageIndex + 1 - 1) * event.pageSize;
    this.paginationData = this.data.slice(offset).slice(0, event.pageSize);
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

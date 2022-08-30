import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IShip } from '../../../interfaces/ships';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ship-list',
  templateUrl: './ship-list.component.html',
  styleUrls: ['./ship-list.component.scss'],
})
export class ShipListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public dataSource = new MatTableDataSource<IShip[]>([]);

  @Input()
  set ship(value: IShip[]) {
    this._ship.next(value);
  }

  get ship(): IShip[] {
    return this._ship.getValue();
  }

  // Pagination
  public pageLength: number = 0;
  public pageSize: number = 8;
  public pageSizeOptions: number[] = [this.pageSize, this.pageSize + 4];
  public paginationShips: IShip[] = [];
  public _ship = new BehaviorSubject<IShip[]>([]);

  constructor(public spinnerService: SpinnerService) {}

  public onPaginate(event: PageEvent): void {
    const offset = (event.pageIndex + 1 - 1) * event.pageSize;
    this.paginationShips = this.ship.slice(offset).slice(0, event.pageSize);
  }

  public openMarinetraffic(url: string): void {
    window.open(url);
  }

  ngOnInit(): void {
    this._ship.subscribe((x) => {
      this.paginationShips = this.ship.slice((0 + 1 - 1) * this.pageSize).slice(0, this.pageSize);
      this.pageLength = this.ship.length;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IShip } from '../../../interfaces/ships';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FavoritesService } from '../../../services/favorites/favorites.service';

@Component({
  selector: 'app-ship-list',
  templateUrl: './ship-list.component.html',
  styleUrls: ['./ship-list.component.scss'],
})
export class ShipListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public dataSource = new MatTableDataSource<IShip[]>([]);

  @Input() pageSize: number = 8;

  @Input()
  set ship(value: IShip[]) {
    this._ship.next(value);
  }

  get ship(): IShip[] {
    return this._ship.getValue();
  }

  // Pagination
  public pageLength: number = 0;
  public pageSizeOptions: number[] = [this.pageSize, this.pageSize + 4];
  public paginationShips: IShip[] = [];
  public _ship = new BehaviorSubject<IShip[]>([]);

  constructor(private favoriteList: FavoritesService) {}

  public onPaginate(event: PageEvent): void {
    const offset = (event.pageIndex + 1 - 1) * event.pageSize;
    this.paginationShips = this.ship.slice(offset).slice(0, event.pageSize);
  }

  public openMarinetraffic(url: string): void {
    window.open(url);
  }

  public addShipToFavoriteList(ship: IShip) {
    this.favoriteList.addShipsToList(ship);
  }

  ngOnInit(): void {
    this._ship.subscribe((x) => {
      this.paginationShips = this.ship.slice(this.pageSize).slice(0, this.pageSize);
      this.pageLength = this.ship.length;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

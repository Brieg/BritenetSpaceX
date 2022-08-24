import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { IShip } from '../../interfaces/ships';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectionListChange } from '@angular/material/list';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-ships-list',
  templateUrl: './ships-list.component.html',
  styleUrls: ['./ships-list.component.scss'],
})
export class ShipsListComponent implements OnInit {
  // Pagination
  public pageLength: number = 0;
  public pageSize: number = 8;
  public pageSizeOptions: number[] = [this.pageSize, this.pageSize + 5];
  public pageEvent: PageEvent | undefined;

  // Ships
  public ships: IShip[] = [];
  public paginationShips: IShip[] = [];

  public activateShips: boolean[] = [];
  public filteredShips: IShip[] = [];

  constructor(
    public spinnerService: SpinnerService,
    private httpClient: HttpClient,
    private dataService: DataService) {  }

  public OnPaginate(event: PageEvent): void {
    const offset = (event.pageIndex + 1 - 1) * event.pageSize;
    this.paginationShips = this.ships.slice(offset).slice(0, event.pageSize);
  }

  public displayShips(ships: IShip[]): void {
    this.pageLength = ships.length;
    this.paginationShips = ships.slice((0 + 1 - 1) * this.pageSize).slice(0, this.pageSize);
  }

  public selectionChange(e: MatSelectionListChange): void {
    this.filteredShips = this.ships.filter((x) => {
      return x.active === e.options[0].value;
    });
    this.displayShips(this.filteredShips);
  }

  public openMarinetraffic(url: string): void {
    window.open(url);
  }

  public getShips() {
    this.dataService.loadShips().subscribe(ships => {
      this.ships = ships;
      this.displayShips(this.ships);
    });
  }

  ngOnInit(): void {
    this.getShips();
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { IShip } from '../../interfaces/ships';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-ships-list',
  templateUrl: './ships-list.component.html',
  styleUrls: ['./ships-list.component.scss']
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
    private httpClient: HttpClient,
    public spinnerService: SpinnerService
  ) {
    this.httpClient.get<IShip[]>('https://api.spacexdata.com/v3/ships').subscribe(
      (ships) => {
        this.ships = ships;

        this.displayShips(this.ships);
        //this.setFiltersCategory(this.launches);
      },
      (error) => {
        console.error('Something went wrong.');
      }
    );
  }

  public OnPaginate(event: PageEvent): void {
    const offset = (event.pageIndex + 1 - 1) * event.pageSize;
    this.paginationShips = this.ships.slice(offset).slice(0, event.pageSize);
  }

  public displayShips(ships: IShip[]): void {
    this.pageLength = ships.length;
    this.paginationShips = ships.slice((0 + 1 - 1) * this.pageSize).slice(0, this.pageSize);
  }

  // setFiltersCategory(ships: IShip[]): void {
  //   this.activateShips = [...new Set(ships.map((launches) => ships.active))];
  // }

  public selectionChange(e: MatSelectionListChange): void {
    this.filteredShips = this.ships.filter((x) => {
      return x.active === e.options[0].value;
    });
    this.displayShips(this.filteredShips);
  }

  public openMarinetraffic(url:string): void {
    window.open(url)
  }

  ngOnInit(): void {
  }

}

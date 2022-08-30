import { Component, OnInit } from '@angular/core';

import { IShip } from '../../../interfaces/ships';
import { DataService } from '../../../services/data/data.service';

@Component({
  selector: 'app-ships-list',
  templateUrl: './ships-list.component.html',
  styleUrls: ['./ships-list.component.scss'],
})
export class ShipsListComponent implements OnInit {
  public ships: IShip[] = [];

  constructor(private dataService: DataService) {}

  public getShips() {
    this.dataService.loadShips().subscribe((ships) => {
      this.ships = ships;
    });
  }

  ngOnInit(): void {
    this.getShips();
  }
}

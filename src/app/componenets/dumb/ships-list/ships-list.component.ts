import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShipService } from '../../../services/ship/ship.service';
import { doubleLoadShips } from '../../../store/reducers/ship.reducers';

@Component({
  selector: 'app-ships-list',
  templateUrl: './ships-list.component.html',
})
export class ShipsListComponent implements OnInit {
  constructor(public shipService: ShipService) {}

  public ships$: Observable<doubleLoadShips>;

  ngOnInit(): void {
    this.ships$ = this.shipService.getShips();
  }
}

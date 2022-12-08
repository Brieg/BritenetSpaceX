import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';

import { ILaunches } from '../../interfaces/launches';
import { DialogData } from '../../interfaces/favorites-dialog';
import { IShip } from '../../interfaces/ships';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private dialogDuration: number = 1000; // in ms

  readonly launchesDBName = 'Launches';
  readonly shipsDBname = 'Ships';

  private itemsSubject = new BehaviorSubject<number>(0);
  public launches = new BehaviorSubject<DialogData[]>([]);
  public ships = new BehaviorSubject<DialogData[]>([]);

  public items$ = this.itemsSubject.asObservable();
  //  public launches: DialogData[] = [];

  constructor(private _snackBar: MatSnackBar, private dbService: NgxIndexedDBService) {}

  public getCount() {
    this.dbService.count(this.launchesDBName).subscribe((launchesCount) => {
      this.itemsSubject.next(launchesCount);
    });
    return this.itemsSubject;
  }

  public displaySnackBar(title: string) {
    this._snackBar.open(title, 'X', {
      duration: this.dialogDuration,
    });
  }

  public addLaunchesToList(type: ILaunches) {
    this.dbService
      .add(this.launchesDBName, {
        id: type.flight_number,
        name: type.mission_name,
        img: type.links.mission_patch_small,
      })
      .subscribe(
        (key) => {
          this.displaySnackBar(type.mission_name + ' has been added to your favorite list.');

          //TODO: Can't be like this! SHAME! SHAME! SHAME!
          this.getCount();
        },
        (error) => {
          this.displaySnackBar(type.mission_name + ' is already in your list.');
        }
      );
  }

  public addShipsToList(type: IShip) {
    this.dbService
      .add(this.shipsDBname, {
        id: type.ship_id,
        name: type.ship_name,
        img: type.image,
      })
      .subscribe(
        (key) => {
          this.displaySnackBar(type.ship_name + ' has been added to your favorite list.');

          //TODO: Can't be like this! SHAME! SHAME! SHAME!
          this.getCount();
        },
        (error) => {
          this.displaySnackBar(type.ship_name + ' is already in your list.');
        }
      );
  }

  public removeFromList(id: number) {
    this.displaySnackBar('The item has been deleted.');
  }

  public removeAllFromList() {
    this.dbService.clear(this.launchesDBName).subscribe((successDeleted) => {
      console.log('success? ', successDeleted);
      this.displaySnackBar('Your list has been cleared :(');
    });
  }

  public getLaunches() {
    this.dbService.getAll<DialogData>(this.launchesDBName).subscribe(
      (launch) => {
        this.launches.next(launch);
      },
      (error) => {
        console.log(error);
      }
    );
    return this.launches;
  }

  public getShips() {
    this.dbService.getAll<DialogData>(this.shipsDBname).subscribe(
      (ship) => {
        this.ships.next(ship);
      },
      (error) => {
        console.log(error);
      }
    );
    return this.ships;
  }
}

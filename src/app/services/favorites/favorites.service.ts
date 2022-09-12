import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of } from 'rxjs';
// import { IShip } from '../../interfaces/ships';
import { ILaunches } from '../../interfaces/launches';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private dialogDuration: number = 1000; // in ms

  readonly launchesDBName = 'Launches';
  readonly shipsDBname = 'Ships';

  private itemsSubject = new BehaviorSubject<number>(0);
  public items$ = this.itemsSubject.asObservable();

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
      .subscribe((key) => {
        this.displaySnackBar(type.mission_name + ' has been added to your favorite list.');

        //TODO: Can't be like this! SHAME! SHAME! SHAME!
        this.getCount();
      });
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

  public getItems() {
    this.dbService.getAll(this.launchesDBName).subscribe((launches) => {});
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../interfaces/favorites-dialog';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  public britenet = {
    alt: 'Britenet - Software outsourcing and IT Services',
    url: './../assets/britenet_logo.png',
  };

  public spacex = {
    alt: 'SpaceX designs, manufactures and launches advanced rockets and spacecraft.',
    url: './../assets/spacex_logo.png',
  };

  private mockData = [
    {
      name: 'Name',
      img: 'https://britenet.com.pl/img/logo.png',
    },
  ];

  public favoritesCount$: BehaviorSubject<number>;
  public launches: BehaviorSubject<DialogData[]>;

  constructor(private favoriteList: FavoritesService, public dialog: MatDialog) {
    this.favoritesCount$ = this.favoriteList.getCount();
    this.launches = this.favoriteList.getItems();
  }

  public openDialog(): void {
    this.dialog.open(DialogFromMenuExampleDialog, {
      width: '350px',
      data: this.launches,
    });
  }

  ngOnInit(): void {}
}

@Component({
  templateUrl: './favorites-dialog.component.html',
})
export class DialogFromMenuExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogFromMenuExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: BehaviorSubject<DialogData[]>,
    private favoriteList: FavoritesService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public clearAllData(): void {
    this.favoriteList.removeAllFromList();
  }
}

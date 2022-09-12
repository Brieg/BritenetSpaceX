import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FavoritesDialogComponent } from '../../smart/favorites-dialog/favorites-dialog.component';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  providers: [FavoritesDialogComponent],
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

  favoritesCount$: BehaviorSubject<number>;

  constructor(private favoriteList: FavoritesService, private favoritesDialogComponent: FavoritesDialogComponent) {
    this.favoritesCount$ = this.favoriteList.getCount();
  }

  openDialog(): void {
    this.favoritesDialogComponent.openDialog(this.mockData);
  }

  ngOnInit(): void {}
}

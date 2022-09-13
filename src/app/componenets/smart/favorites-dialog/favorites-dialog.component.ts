import { Component, Inject, OnInit } from '@angular/core';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FavoritesService } from '../../../services/favorites/favorites.service';

@Component({
  selector: 'app-favorites-dialog',
  templateUrl: './favorites-dialog.component.html',
  styleUrls: ['./favorites-dialog.component.scss'],
  providers: [DialogService],
})
export class FavoritesDialogComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any[],
    private favorites: FavoritesService
  ) {}

  ngOnInit(): void {}

  public openDialog(data: any[]) {
    this.dialogService.openDialog(FavoritesDialogComponent, data);
  }

  public closeDialog() {
    this.dialogService.closeDialog();
  }

  public clearAllData() {
    this.favorites.removeAllFromList();
    this.closeDialog();
  }
}

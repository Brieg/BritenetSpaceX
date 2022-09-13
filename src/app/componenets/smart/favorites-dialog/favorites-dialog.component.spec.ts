import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesDialogComponent } from './favorites-dialog.component';

describe('FavoritesDialogComponent', () => {
  let component: FavoritesDialogComponent;
  let fixture: ComponentFixture<FavoritesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

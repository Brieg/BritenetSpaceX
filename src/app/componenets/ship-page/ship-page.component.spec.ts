import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipPageComponent } from './ship-page.component';

describe('ShipPageComponent', () => {
  let component: ShipPageComponent;
  let fixture: ComponentFixture<ShipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

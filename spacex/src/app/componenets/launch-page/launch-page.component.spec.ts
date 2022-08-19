import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchPageComponent } from './launch-page.component';

describe('LaunchPageComponent', () => {
  let component: LaunchPageComponent;
  let fixture: ComponentFixture<LaunchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaunchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should render Embeded, muted and autoplay YT path', () => {
    const YTid = 'faHomJimjLc';
    expect(component.renderYT(YTid)).toEqual('https://www.youtube.com/embed/' + YTid + '?autoplay=1&mute=1')

  });
});

import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}
}

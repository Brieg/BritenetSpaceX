import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit {
  @Input() images: Array<any> = [];
  public widthPX: number = 0;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthPX = window.innerWidth;
  }

  ngOnInit(): void {
    this.widthPX = window.innerWidth;
  }
}

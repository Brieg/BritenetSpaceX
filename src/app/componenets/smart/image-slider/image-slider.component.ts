import { Component, HostListener, Input, OnInit } from '@angular/core';
import { IImages } from '../../../interfaces/images';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit {
  @Input() images: string[]  = []
  public carouselImage: IImages[] = []
  public widthPX: number = 0;

  public imagesToArray(images: string[]): void {
    this.carouselImage = images.map((image) => ({
      name: image,
    }));
  }

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthPX = window.innerWidth;
  }

  ngOnInit(): void {
    this.imagesToArray(this.images);
    this.widthPX = window.innerWidth;
  }
}

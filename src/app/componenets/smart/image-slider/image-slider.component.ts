import { Component, HostListener, Input, OnInit } from '@angular/core';
import { IImages } from '../../../interfaces/images';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit {
  @Input()
  set images(value: any) {
    this.image$.next(value);
  }

  get images(): any {
    return this.image$.getValue();
  }

  public image$: BehaviorSubject<any> = new BehaviorSubject<any>('');

  public carouselImage: IImages[] = [];
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
    this.image$.subscribe((images) => {
      if (images) {
        this.imagesToArray(images);
        this.widthPX = window.innerWidth;
      }
    });
  }
}

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Map } from 'leaflet';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ship-map',
  templateUrl: './ship-map.component.html',
  styleUrls: ['./ship-map.component.scss'],
})
export class ShipMapComponent implements AfterViewInit {
  @Input()
  set latitude(value: any) {
    this.latitude$.next(value);
  }

  get latitude(): any {
    return this.latitude$.getValue();
  }

  @Input()
  set longitude(value: any) {
    this.longitude$.next(value);
  }

  get longitude(): any {
    return this.longitude$.getValue();
  }

  public latitude$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public longitude$: BehaviorSubject<any> = new BehaviorSubject<any>('');

  private map: Map;

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
  }

  public addShipToMap(latitude: number, longitude: number) {
    const marker = Leaflet.marker([latitude, longitude]);
    marker.addTo(this.map);
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.latitude$.subscribe((latitude) => {
      if (latitude !== undefined) {
        this.longitude$.subscribe((longitude) => {
          if (longitude !== undefined) {
            this.initMap();
            this.addShipToMap(latitude, longitude);
          }
        });
      }
    });
  }
}

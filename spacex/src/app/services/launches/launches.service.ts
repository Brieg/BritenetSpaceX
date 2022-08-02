import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { ILaunches } from "../../interfaces/launches";

@Injectable({
  providedIn: 'root'
})
export class LaunchesService {

  launches: BehaviorSubject<ILaunches[]> = new BehaviorSubject<ILaunches[]>([]);

  constructor(private httpClient: HttpClient) { }

  getLaunches(): Observable<any> {
    return this.httpClient.get('https://api.spacexdata.com/v3/launches');
  }
}

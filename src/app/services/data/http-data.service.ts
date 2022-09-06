import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IShip } from '../../interfaces/ships';
import { ILaunches } from '../../interfaces/launches';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpDataService {
  constructor(private http: HttpClient) {}

  private log(message: string) {
    console.log(`Data: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  public loadShip<Data>(ship_id: string): Observable<IShip> {
    const url = 'https://api.spacexdata.com/v3/ships/' + ship_id;
    return this.http.get<IShip>(url).pipe(
      map((ships) => ships), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        this.log(`${outcome} Ship ID=${ship_id}`);
      }),
      catchError(this.handleError<IShip>(`Get Ship id=${ship_id}`))
    );
  }

  public loadShips(): Observable<IShip[]> {
    return this.http.get<IShip[]>('https://api.spacexdata.com/v3/ships').pipe(
      tap((_) => this.log('Fetched all Ships from API')),
      catchError(this.handleError<IShip[]>('loadShips', []))
    );
  }

  public loadLaunch<Data>(flight_number: number): Observable<ILaunches> {
    const url = 'https://api.spacexdata.com/v3/launches/' + flight_number;
    return this.http.get<ILaunches>(url).pipe(
      map((launch) => launch), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        this.log(`${outcome} Launch ID=${flight_number}`);
      }),
      catchError(this.handleError<ILaunches>(`Get Launch id=${flight_number}`))
    );
  }

  public loadLaunches(): Observable<ILaunches[]> {
    return this.http.get<ILaunches[]>('https://api.spacexdata.com/v3/launches').pipe(
      tap((_) => this.log('Fetched all Launches from API')),
      catchError(this.handleError<ILaunches[]>('loadLaunches', []))
    );
  }
}

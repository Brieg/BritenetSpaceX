import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILaunches } from '../../../interfaces/launches';
import { DataService } from '../../../services/data/data.service';

@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.component.html',
})
export class LaunchesListComponent implements OnInit {
  public launches: ILaunches[] = [];

  constructor(private httpClient: HttpClient, private dataService: DataService) {}

  public getLaunches() {
    this.dataService.loadLaunches().subscribe((launches) => {
      this.launches = launches;
    });
  }

  ngOnInit(): void {
    this.getLaunches();
  }
}

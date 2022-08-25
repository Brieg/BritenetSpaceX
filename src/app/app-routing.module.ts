import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LaunchesListComponent } from './componenets/dumb/launches-list/launches-list.component';
import { LaunchPageComponent } from './componenets/dumb/launch-page/launch-page.component';
import { ShipsListComponent } from './componenets/dumb/ships-list/ships-list.component';
import { ShipPageComponent } from './componenets/dumb/ship-page/ship-page.component';

const slogan: string = 'Britenet & SpaceX';

const routes: Routes = [
  {
    path: 'home',
    component: LaunchesListComponent,
    title: slogan + ' | Launches',
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'launch/:flight_number', component: LaunchPageComponent, title: slogan + ' | Launch page' },
  { path: 'ships', component: ShipsListComponent, title: slogan + ' | Ships' },
  { path: 'ship/:ship_id', component: ShipPageComponent, title: slogan + ' | Ship page' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

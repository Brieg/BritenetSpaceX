import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LaunchesListComponent } from './componenets/launches-list/launches-list.component';
import { LaunchPageComponent } from './componenets/launch-page/launch-page.component';
import { ShipsListComponent } from './componenets/ships-list/ships-list.component';

const slogan: string = "Britenet & SpaceX";

const routes: Routes = [
  {
    path: 'home',
    component: LaunchesListComponent,
    title: slogan +' | Launches',
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'launch/:flight_number', component: LaunchPageComponent,title: slogan +' | Launch page' },
  { path: 'ships', component: ShipsListComponent, title: slogan +' | Ships' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

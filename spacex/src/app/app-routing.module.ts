import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LaunchesListComponent } from './componenets/launches-list/launches-list.component';
import { LaunchPageComponent } from './componenets/launch-page/launch-page.component';


const routes: Routes = [
  {
    path: 'home',
    component: LaunchesListComponent,
    title: 'Britenet & SpaceX',
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'launch/:flight_number', component: LaunchPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchesListComponent } from './componenets/launches-list/launches-list.component';

const routes: Routes = [
  {
    path: 'home',
    component: LaunchesListComponent,
    title: 'Britenet & SpaceX',
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

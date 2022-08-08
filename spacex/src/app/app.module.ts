import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MainMenuComponent } from './componenets/main-menu/main-menu.component';
import { LaunchesListComponent } from './componenets/launches-list/launches-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {CustomHttpInterceptor} from "./services/launches/launches.service";

@NgModule({
  declarations: [AppComponent, MainMenuComponent, LaunchesListComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CustomHttpInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}

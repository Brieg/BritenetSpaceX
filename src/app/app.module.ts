import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { MaterialModule } from './modules/material/material.module';
import { MainMenuComponent } from './componenets/dumb/main-menu/main-menu.component';
import { LaunchesListComponent } from './componenets/dumb/launches-list/launches-list.component';
import { CustomHttpInterceptor } from './services/launches/launches.service';
import { LaunchPageComponent } from './componenets/dumb/launch-page/launch-page.component';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { VideoModule } from './modules/video/video.module';
import { ShipsListComponent } from './componenets/dumb/ships-list/ships-list.component';
import { ShipPageComponent } from './componenets/dumb/ship-page/ship-page.component';
import { GridListComponent } from './componenets/smart/grid-list/grid-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    LaunchesListComponent,
    LaunchPageComponent,
    ShipsListComponent,
    ShipPageComponent,
    GridListComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    Ng2CarouselamosModule,
    YouTubePlayerModule,
    VideoModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

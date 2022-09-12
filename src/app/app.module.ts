import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MaterialModule } from './modules/material/material.module';
import { MainMenuComponent } from './componenets/dumb/main-menu/main-menu.component';
import { LaunchesListComponent } from './componenets/dumb/launches-list/launches-list.component';
import { LaunchPageComponent } from './componenets/dumb/launch-page/launch-page.component';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { VideoModule } from './modules/video/video.module';
import { ShipsListComponent } from './componenets/dumb/ships-list/ships-list.component';
import { ShipPageComponent } from './componenets/dumb/ship-page/ship-page.component';
import { ShipListComponent } from './componenets/smart/grid-list/ship-list.component';
import { ImageSliderComponent } from './componenets/smart/image-slider/image-slider.component';
import { TimelineComponent } from './componenets/smart/timeline/timeline.component';
import { BackButtonComponent } from './componenets/smart/back-button/back-button.component';
import { LaunchListComponent } from './componenets/smart/launch-list/launch-list.component';
import { ShipMapComponent } from './componenets/smart/ship-map/ship-map.component';
import { PipesModule } from './modules/pipes/pipes.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LaunchEffects } from './store/effects/launch.effects';
import { LoadingContainerComponent } from './componenets/smart/loading-container/loading-container.component';
import { reducers } from './store/reducers/reducers';
import { ShipEffects } from './store/effects/ship.effects';
import { IndexedDBModule } from './modules/indexed-db/indexed-db.module';
import { FavoritesDialogComponent } from './componenets/smart/favorites-dialog/favorites-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    LaunchesListComponent,
    LaunchPageComponent,
    ShipsListComponent,
    ShipPageComponent,
    ShipListComponent,
    ImageSliderComponent,
    TimelineComponent,
    BackButtonComponent,
    LaunchListComponent,
    ShipMapComponent,
    LoadingContainerComponent,
    FavoritesDialogComponent,
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
    PipesModule,
    BrowserModule,
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([LaunchEffects, ShipEffects]),
    StoreDevtoolsModule.instrument(),
    IndexedDBModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

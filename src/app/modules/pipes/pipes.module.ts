import { NgModule } from '@angular/core';
import { beforeTakeOffPipe, capitalizeHeaderPipe, onAirPipe } from '../../pipes/pipes';

@NgModule({
  declarations: [capitalizeHeaderPipe, beforeTakeOffPipe, onAirPipe],
  exports: [capitalizeHeaderPipe, beforeTakeOffPipe, onAirPipe],
})
export class PipesModule {}

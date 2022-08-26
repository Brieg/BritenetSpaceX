import { NgModule } from '@angular/core';
import { CapitalizeHeaderPipe } from '../../pipes/pipes';

@NgModule({
  declarations: [
    CapitalizeHeaderPipe
  ],
  exports: [
    CapitalizeHeaderPipe
  ]
})
export class PipesModule {}

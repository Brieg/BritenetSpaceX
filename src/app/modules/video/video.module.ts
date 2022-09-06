import { NgModule } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { VideoComponent } from '../../componenets/smart/video/video.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [YouTubePlayerModule, CommonModule],
  declarations: [VideoComponent],
  exports: [VideoComponent],
})
export class VideoModule {}

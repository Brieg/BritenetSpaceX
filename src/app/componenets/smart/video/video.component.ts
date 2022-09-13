import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  template: ` <div #youTubePlayer class="youtube">
    <youtube-player
      [videoId]="videoId"
      [playerVars]="playerConfig"
      suggestedQuality="highres"
      [width]="videoWidth"
      [height]="videoHeight"
    >
    </youtube-player>
  </div>`,
  selector: 'app-youtube',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @ViewChild('youTubePlayer') youTubePlayer: ElementRef<HTMLDivElement>;

  @Input()
  set videoId(value: any) {
    this.youtube$.next(value);
  }

  get videoId(): any {
    return this.youtube$.getValue();
  }

  public youtube$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  protected videoHeight: number;
  protected videoWidth: number;

  private YToffset: number = 17;

  protected playerConfig = {
    controls: 1,
    mute: 1,
    autoplay: 1,
  };

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.youtube$.subscribe((youtubeID) => {
      if (youtubeID !== undefined) {
        this.videoWidth = window.innerWidth - this.YToffset;
        this.videoHeight = window.innerHeight;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.videoWidth = window.innerWidth - this.YToffset;
    this.videoHeight = window.innerHeight;
    this.changeDetectorRef.detectChanges();
  }
}

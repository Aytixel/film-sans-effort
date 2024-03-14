import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Movie } from '../movie';
import { Scroll } from '../scroll';

@Component({
  selector: 'app-card-carousel',
  templateUrl: './card-carousel.component.html',
  styleUrl: './card-carousel.component.css'
})
export class CardCarouselComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() movieList: Movie[] = [];
  @Output() onEndReached = new EventEmitter<void>();
  @ViewChild("cardCarousel") card_carousel!: ElementRef;

  ngAfterViewInit() {
    new Scroll(this.card_carousel.nativeElement, 1);
  }

  onScroll() {
    if (this.card_carousel.nativeElement.scrollLeft > (this.card_carousel.nativeElement.scrollWidth - this.card_carousel.nativeElement.clientWidth * 1.2)) {
      this.onEndReached.emit();
    }
  }
}
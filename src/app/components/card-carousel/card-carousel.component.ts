import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Movie } from '../movie';
import { Scroll } from '../scroll';
import { ScrollSnap } from '../scroll-snap';
import { throttle } from 'lodash';

@Component({
  selector: 'app-card-carousel',
  templateUrl: './card-carousel.component.html',
  styleUrl: './card-carousel.component.css'
})
export class CardCarouselComponent implements AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() movieList: Movie[] = [];
  @Output() onEndReached = new EventEmitter<void>();
  @ViewChild("cardCarousel") card_carousel!: ElementRef;
  @ViewChild("leftArrow") left_arrow!: ElementRef;
  @ViewChild("rightArrow") right_arrow!: ElementRef;

  constructor() {
    this.updateArrow = throttle(this.updateArrow, 20);
  }

  ngAfterViewInit() {
    new Scroll(this.card_carousel.nativeElement, 1);
    new ScrollSnap(this.card_carousel.nativeElement, 1, this.card_carousel.nativeElement, "app-card");

    this.updateArrow();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movieList']?.firstChange) {
      // scroll au début du carousel lors du premier chargement de manière instantanée
      requestAnimationFrame(() => this.card_carousel.nativeElement.scrollTo({ left: 0, behavior: "instant" }));
    } else if (changes['movieList']?.previousValue?.length > changes['movieList']?.currentValue?.length) {
      // scroll au début du carousel lors que la liste de film change
      this.card_carousel.nativeElement.scrollTo({ left: 0, behavior: "smooth" });
    }

    this.updateArrow();
  }

  onScroll() {
    // envoie un évènement quand la fin du carousel est visible
    if (this.card_carousel.nativeElement.scrollLeft > (this.card_carousel.nativeElement.scrollWidth - this.card_carousel.nativeElement.clientWidth * 1.2)) {
      this.onEndReached.emit();
    }

    this.updateArrow();
  }

  updateArrow() {
    // met à jour si les flèches doivent être afficher ou non
    this.right_arrow?.nativeElement.classList.toggle("show", this.card_carousel.nativeElement.scrollLeft <= (this.card_carousel.nativeElement.scrollWidth - this.card_carousel.nativeElement.clientWidth - 50));
    this.left_arrow?.nativeElement.classList.toggle("show", this.card_carousel.nativeElement.scrollLeft > 50);
  }

  onArrowClicked(reverse: boolean) {
    this.card_carousel.nativeElement.scrollBy({ left: (this.card_carousel.nativeElement.clientWidth + 16 * 1.5) * (reverse ? 1 : -1), behavior: "smooth" })
  }
}
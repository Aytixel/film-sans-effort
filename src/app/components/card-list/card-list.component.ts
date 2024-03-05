import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Movie } from '../movie';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() movieList: Movie[] = [];
  @Output() onEndReached = new EventEmitter<void>();
  @ViewChild("listEnd") list_end!: ElementRef;

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.onEndReached.emit();
        }
      });
    });

    observer.observe(this.list_end.nativeElement);
  }
}

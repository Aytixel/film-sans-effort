import { Component, EventEmitter, Output } from '@angular/core';
import { debounce } from 'lodash';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Output() onSearch = new EventEmitter<string>();

  constructor() {
    this.search = debounce(this.search, 300) as any
  }

  async search(event: any) {
    this.onSearch.emit(event.target.value);
  }
}

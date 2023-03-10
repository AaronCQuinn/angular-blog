import { Component, EventEmitter, Output } from '@angular/core';
import { BlogsService } from 'src/app/services/blogs.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() searchObjectUpdated = new EventEmitter<any>();

  searchObject: {
    selectedOption: string,
    searchQuery: string;
  };

  constructor(private blogService: BlogsService) {
    this.searchObject = { selectedOption: 'title', searchQuery: ''};
  }

  options = [
    { value: 'title', label: "Title"},
    { value: 'content', label: "Content"},
    { value: 'postedBy', label: 'User'}
  ]

  onSelect(option: string) {
    this.searchObject.selectedOption = option;
    this.emitSearchObjectUpdated();
  }

  onSearchChange(event: any) {
    this.searchObject.searchQuery = event.target.value;
    this.emitSearchObjectUpdated();
  }

  emitSearchObjectUpdated() {
    this.searchObjectUpdated.emit(this.searchObject);
    this.blogService.onSearchObjectUpdated(this.searchObject); // emit event from service
  }
  
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent {
  constructor() { }
  @Input() title: string
  @Input() count: number
  @Input() searchBar: boolean
  @Output() onSearch = new EventEmitter<string>()
  
  keyword: string = ''
  
  search() {
    this.onSearch.emit(this.keyword)
  }

}

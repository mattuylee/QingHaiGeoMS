import { Component, OnInit, Input } from '@angular/core';
import { TargetType } from 'src/app/entities/enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  constructor(
  ) { }

  //当前选择项
  @Input() selectedItem: string

  ngOnInit() {
    if (typeof TargetType[this.selectedItem] == 'string')
      this.selectedItem = TargetType[this.selectedItem]
  }
}

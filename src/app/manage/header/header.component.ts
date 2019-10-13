import { Component, OnInit, Input } from '@angular/core';
import { TargetType } from 'src/app/entities/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  //当前选择项
  @Input() selectedItem: string

  ngOnInit() {
    if (typeof TargetType[this.selectedItem] == 'string')
      this.selectedItem = TargetType[this.selectedItem]
  }

  go(url: string) {
    this.router.navigate([url])
  }
}

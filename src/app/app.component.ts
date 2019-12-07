import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = '青海遗迹旅游管理系统';

  constructor (
    private api: ApiService
  ) { }

  // userName: string
  readonly currentYear = new Date().getFullYear()
  ngOnInit() {
    this.api.init()
  }
}

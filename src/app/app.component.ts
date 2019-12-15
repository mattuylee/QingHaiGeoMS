import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (
    private router: Router,
    private api: ApiService
  ) { }

  readonly currentYear = new Date().getFullYear()
  shouldRightShow = true
  ngOnInit() {
    this.api.init()
    this.router.events.subscribe((ev: NavigationEnd) => {
      if (!(ev instanceof NavigationEnd)) { return }
      this.shouldRightShow = ev.urlAfterRedirects == '' || ev.urlAfterRedirects == '/'
    })
  }
}


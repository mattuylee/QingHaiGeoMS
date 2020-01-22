import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ManageService } from '../shared/manage.service';
import { ApiService } from '../api.service';
import { StatisticData } from '../entities/statistic';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.scss', './manage.component.scss']
})
export class ManageComponent implements OnInit {
  constructor(
    private router: Router,
    private api: ApiService,
    public manageService: ManageService
  ) { }
  data
  shouldRightShow = true
  current: string = 'home' //当前路由
  ngOnInit() {
    this.router.events.subscribe((ev: NavigationEnd) => {
      if (!(ev instanceof NavigationEnd)) { return }
      if (ev.urlAfterRedirects == '/manage') {
        this.shouldRightShow = true
        this.manageService.tableFolded = true
        this.manageService.navigationFolded = false
        this.current = 'home'
      }
      else { this.shouldRightShow = false }
      switch (ev.urlAfterRedirects) {
        case '/manage/relic':
          this.current = 'relic'
          break
        case '/manage/knowledge':
          this.current = 'knowledge'
          break
        case '/manage/moment':
          this.current = 'moment'
          break
        case '/manage/qa':
          this.current = 'qa'
          break
        case '/manage/user':
          this.current = 'user'
          break
        default:
          this.current = 'home'
          break
      }
    })
    this.api.getStatisticData().toPromise().then((data) => {
      this.data = data
    })
  }
  toggleFoldState() {
    this.manageService.navigationFolded = !this.manageService.navigationFolded
  }
}

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

  ngOnInit() {
    this.router.events.subscribe((ev: NavigationEnd) => {
      if (!(ev instanceof NavigationEnd)) { return }
      if (ev.urlAfterRedirects == '/manage') {
        this.shouldRightShow = true
        this.manageService.tableFolded = true 
        this.manageService.navigationFolded = false
      }
      else { this.shouldRightShow = false }
    })
    this.api.getStatisticData().toPromise().then((data) => {
      this.data = data
    })
  }
  toggleFoldState() {
    this.manageService.navigationFolded = !this.manageService.navigationFolded
  }
}

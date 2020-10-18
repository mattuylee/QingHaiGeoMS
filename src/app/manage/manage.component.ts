import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
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
  data  //统计数据
  mouseOverItem: string // 当前鼠标焦点项
  get shouldRightShow() { return this.manageService.shouldRightShow }
  get current() { return this.manageService.current }
  @ViewChild('navigationPannel')
  private navigationPannel: { nativeElement: HTMLDivElement }

  ngOnInit() {
    this.manageService.tableFolded = true
    this.manageService.navigationFolded = false
    this.api.getStatisticData().toPromise().then((data) => {
      this.data = data
    })
    setTimeout(() => {
      this.navigationPannel.nativeElement.addEventListener('mouseenter', ev => this.handleMouseEnter(ev), { capture: true });
      this.navigationPannel.nativeElement.addEventListener('mouseleave', ev => this.handleMouseLeave(ev), { capture: true });
    }, 0);
  }
  toggleFoldState() {
    this.manageService.navigationFolded = !this.manageService.navigationFolded
  }

  handleMouseEnter(ev: MouseEvent) {
    const item = (ev.target as HTMLElement).getAttribute('data-id')
    if (item) {
      this.mouseOverItem = item
    }
  }
  handleMouseLeave(ev: MouseEvent) {
    const item = (ev.target as HTMLElement).getAttribute('data-id')
    if (item) {
      this.mouseOverItem = ''
    }
  }
}

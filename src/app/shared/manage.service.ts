import { Injectable, Optional, SkipSelf, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Relic } from '../entities/Relic';

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  shouldRightShow = true
  current: string = 'home' //当前路由

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((ev: NavigationEnd) => {
      if (!(ev instanceof NavigationEnd)) { return }
      if (ev.urlAfterRedirects == '/manage') {
        this.shouldRightShow = true
        this.tableFolded = true
        this.navigationFolded = false
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
  }
  //上传按钮标题
  uploadType: 'relic' | 'knowledge'
  //导航按钮是否折叠
  navigationFolded: boolean
  //数据列表是否折叠
  tableFolded = true
  //遗迹项被选中
  onRelicItemFocus = new EventEmitter<Relic>()
  //估计内容列表最大显示条目
  public get itemCount() {
    const v = Math.floor((document.documentElement.clientHeight - 282) / 40)
    return v > 0 ? v : 0
  }
}

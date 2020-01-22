import { Injectable, Optional, SkipSelf, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Relic } from '../entities/Relic';

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  constructor() {
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

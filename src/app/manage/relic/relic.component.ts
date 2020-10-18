import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { RelicResult, BaseResult } from 'src/app/entities/Result';
import { Relic } from 'src/app/entities/Relic';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ManageService } from 'src/app/shared/manage.service';

@Component({
  selector: 'app-relic',
  templateUrl: './relic.component.html',
  styleUrls: ['../manage.scss', './relic.component.scss']
})
export class RelicComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private manageService: ManageService
  ) { }
  resultAmount = 0
  relics: Relic[] = []
  page: number  //当前页
  //搜索关键词
  keyword: string
  //错误文本
  errText: string
  //每页遗迹数量
  readonly itemCount = this.manageService.itemCount
  pageCount = 0
  focusIndex = -1 //当前选中

  async ngOnInit() {
    this.page = Number(this.route.snapshot.queryParamMap.get('page'))
    if (!this.page) { this.page = 1 }
    this.search('', this.page)
  }

  search(kw: string, page: number = 1) {
    this.keyword = kw ? kw : ''
    this.api.searchRelics(this.keyword, page, this.itemCount).toPromise().then(res => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      this.relics = res.results
      this.resultAmount = res.count
      this.pageCount = Math.ceil(this.resultAmount / this.itemCount)
    })
  }

  freeze(relic: Relic) {
    let obs: Observable<BaseResult>
    if (relic.isFreezed)
      obs = this.api.unfreezeRelic(relic.code)
    else
      obs = this.api.freezeRelic(relic.code)
    obs.subscribe((res) => {
      if (res.error)
        this.errText = res.error
      else
        relic.isFreezed = !relic.isFreezed
    })
  }
  deleteRelic(relic: Relic) {
    if (!confirm(`删除遗迹点${relic.name}？注意，此操作不可撤销。`)) { return }
    this.api.deleteRelic(relic.code).toPromise().then((res: BaseResult) => {
      if (res.error)
        this.errText = res.error
      else {
        this.relics = this.relics.filter((i) => i.code != relic.code)
        --this.resultAmount
      }
    })
  }

  //页面跳转
  jump(index: number) {
    this.search(this.keyword, index)
  }
  focus(index: number) {
    this.focusIndex = index
    this.manageService.onRelicItemFocus.emit(this.relics[index])
  }

  uploadData() {
    this.api.uploadRelics()
  }
}

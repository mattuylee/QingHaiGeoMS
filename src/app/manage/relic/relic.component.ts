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
  relicAmount = 0
  resultAmount = 0
  relics: Relic[] = []
  page: number  //当前页
  //搜索关键词
  keyword: string
  //错误文本
  errText: string
  //每页遗迹数量
  readonly itemCount = this.manageService.itemCount
  pageCount

  ngOnInit() {
    this.page = Number(this.route.snapshot.queryParamMap.get('page'))
    if (!this.page) { this.page = 1 }
    this.api.getStatisticData().toPromise().then(data => {
      this.relicAmount = (data && data.relic) ? data.relic.number : 0
      this.pageCount = Math.ceil(this.relicAmount / this.itemCount)
    })
    this.loadRelics(this.page)
  }

  loadRelics(page: number) {
    this.api.getRelics(page, this.itemCount > 0 ? this.itemCount : 1).subscribe((res: RelicResult) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      if (!res.relics || res.relics.length == 0) { return }
      this.relics = res.relics
      this.resultAmount = this.relicAmount
    })
  }
  search(kw: string, page: number = 1) {
    this.keyword = kw
    this.api.searchRelics(kw, page, this.itemCount).toPromise().then(res => {
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
  showDetail() {

  }
  deleteRelic(relic: Relic) {
    if (!confirm(`删除遗迹点${relic.name}？注意，此操作不可撤销。`)) { return }
    this.api.deleteRelic(relic.code).toPromise().then((res: BaseResult) => {
      if (res.error)
        this.errText = res.error
      else {
        this.relics = this.relics.filter((i) => i.code != relic.code)
        --this.relicAmount
        --this.resultAmount
      }
    })
  }

  //页面跳转
  jump(index: number) {
    if (this.keyword) {
      this.search(this.keyword, index)
    }
    else {
      this.loadRelics(index)
    }
  }
}

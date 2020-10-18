import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { BaseResult } from 'src/app/entities/Result';
import { Observable } from 'rxjs';
import { ManageService } from 'src/app/shared/manage.service';
import { CultureVillage } from 'src/app/entities/village';

@Component({
  selector: 'app-village',
  templateUrl: './village.component.html',
  styleUrls: ['../manage.scss', './village.component.scss']
})
export class CultureVillageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private manageService: ManageService
  ) { }
  resultAmount = 0
  villages: CultureVillage[] = []
  page: number  //当前页
  //搜索关键词
  keyword: string
  //错误文本
  errText: string
  //每页数量
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
    this.api.getCultureVillages(null, this.keyword, page, this.itemCount).toPromise().then(res => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      this.villages = res.results
      this.resultAmount = res.count
      this.pageCount = Math.ceil(this.resultAmount / this.itemCount)
    })
  }

  freeze(village: CultureVillage) {
    let obs: Observable<BaseResult>
    if (village.isFreezed)
      obs = this.api.unfreezeVillage(village.code)
    else
      obs = this.api.freezeVillage(village.code)
    obs.subscribe((res) => {
      if (res.error)
        this.errText = res.error
      else
        village.isFreezed = !village.isFreezed
    })
  }
  deleteVillage(village: CultureVillage) {
    if (!confirm(`删除文化村${village.name}？注意，此操作不可撤销。`)) { return }
    this.api.deleteVillage(village.code).toPromise().then((res: BaseResult) => {
      if (res.error)
        this.errText = res.error
      else {
        this.villages = this.villages.filter((i) => i.code != village.code)
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
    this.manageService.onVillageItemFocus.emit(this.villages[index])
  }

  uploadData() {
    this.api.uploadVillages()
  }
}

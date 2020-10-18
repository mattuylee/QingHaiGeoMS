import { Component, OnInit } from '@angular/core';
import { Moment } from 'src/app/entities/moment';
import { ApiService } from 'src/app/api.service';
import { ManageService } from 'src/app/shared/manage.service';
import { Question } from 'src/app/entities/question';
import { BaseResult } from 'src/app/entities/Result';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['../manage.scss', './moment.component.scss']
})
export class MomentComponent implements OnInit {
  constructor(
    private api: ApiService,
    private manageService: ManageService
  ) { }
  resultAmount = 0
  moments: Moment[]
  page: number
  pageCount: number
  keyword: string
  readonly itemCount = this.manageService.itemCount

  ngOnInit() {
    this.loadMoments(1)
  }
  loadMoments(page: number, keyword?: string) {
    this.keyword = keyword ? keyword : ''
    this.api.getMoments(this.keyword, page, this.itemCount).toPromise().then(res => {
      this.page = page
      this.moments = res.results
      this.resultAmount = res.count
      this.pageCount = Math.ceil(this.resultAmount / this.itemCount)
    })
  }
  deleteMoment(moment: Moment) {
    if (!confirm(`确定要删除该随手拍？注意，此操作不可撤销。`)) { return }
    this.api.deleteMoment(moment.code).toPromise().then((res: BaseResult) => {
      if (res.error) {
        alert("删除失败。" + res.error)
      }
      else {
        this.moments.splice(this.moments.indexOf(moment), 1)
        --this.resultAmount
      }
    })
  }
  jump(index: number) {
    this.loadMoments(index, this.keyword)
  }
}

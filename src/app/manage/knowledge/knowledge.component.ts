import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Knowledge } from 'src/app/entities/knowledge';
import { BaseResult, KnowledgeResult } from 'src/app/entities/Result';
import { Observable } from 'rxjs';
import { ManageService } from 'src/app/shared/manage.service';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['../manage.scss', './knowledge.component.scss']
})
export class KnowledgeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private manageService: ManageService
  ) { }

  resultAmount: number
  page: number
  keyword: string
  knowledges: Knowledge[] = []
  errText: string
//每页数量
  readonly itemCount = this.manageService.itemCount
  pageCount

  async ngOnInit() {
    this.page = Number(this.route.snapshot.queryParamMap.get('page'))
    if (!this.page) { this.page = 1 }
    this.search('', this.page)
  }

  search(kw: string, page: number = 1) {
    this.keyword = kw ? kw : ''
    this.api.searchKnowledges(this.keyword, page, this.itemCount).toPromise().then(res => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      this.knowledges = res.results
      this.resultAmount = res.count
      this.pageCount = Math.ceil(this.resultAmount / this.itemCount)
    })
  }

  freeze(knowledge: Knowledge) {
    let obs: Observable<BaseResult>
    if (knowledge.isFreezed)
      obs = this.api.unfreezeKnowledge(knowledge.code)
    else
      obs = this.api.freezeKnowledge(knowledge.code)
    obs.subscribe((res) => {
      if (res.error)
        this.errText = res.error
      else
        knowledge.isFreezed = !knowledge.isFreezed
    })
  }
  deleteKnowledge(index: number) {
    if (!confirm(`删除地质科普${this.knowledges[index].name}？注意，此操作不可撤销。`)) { return }
    let obs = this.api.deleteKnowledge(this.knowledges[index].code)
    obs.subscribe((res: BaseResult) => {
      if (res.error)
        this.errText = res.error
      else {
        this.knowledges.splice(index, 1)
        --this.resultAmount
      }
    })
  }
  
  //页面跳转
  jump(index: number) {
    this.search(this.keyword, index)
  }

  uploadData() {
    this.api.uploadKnowledges()
  }
}

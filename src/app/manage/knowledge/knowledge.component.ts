import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Knowledge } from 'src/app/entities/knowledge';
import { BaseResult, KnowledgeResult } from 'src/app/entities/Result';
import { Observable } from 'rxjs';
import { ManageService } from 'src/app/shared/manage.service';

declare let NativeObj

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

  knowledgeAmount: number
  page: number
  knowledges: Knowledge[] = []
  errText: string
  deletingKnowledge: Knowledge
//每页数量
  readonly itemCount = this.manageService.itemCount
  pageCount

  ngOnInit() {
    this.page = Number(this.route.snapshot.queryParamMap.get('page'))
    if (!this.page) { this.page = 1 }
    this.api.getStatisticData().toPromise().then(data => {
      this.knowledgeAmount = (data && data.knowledge) ? data.knowledge.number : 0
      this.pageCount = Math.ceil(this.knowledgeAmount / this.itemCount)
    })
    this.loadKnowledges(this.page)
  }

  loadKnowledges(page: number) {
    this.api.getKnowledges(page, this.itemCount > 0 ? this.itemCount : 1).subscribe((res: KnowledgeResult) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      if (!res.knowledges || res.knowledges.length == 0) return
      this.knowledges = res.knowledges
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
  deleteKnowledge(knowledge: Knowledge) {
    if (!confirm(`删除地质科普${knowledge.name}？注意，此操作不可撤销。`)) { return }
    let obs = this.api.deleteKnowledge(this.deletingKnowledge.code)
    obs.subscribe((res: BaseResult) => {
      if (res.error)
        this.errText = res.error
      else
        this.knowledges = this.knowledges.filter((i) => i.code != this.deletingKnowledge.code)
      this.deletingKnowledge = null
    })
  }
  
  //页面跳转
  jump(index: number) {
    this.loadKnowledges(index)
  }
}

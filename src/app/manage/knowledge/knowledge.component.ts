import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Knowledge } from 'src/app/entities/knowledge';
import { BaseResult, KnowledgeResult } from 'src/app/entities/Result';
import { Observable } from 'rxjs';

declare let NativeObj

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss']
})
export class KnowledgeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  page: number
  knowledges: Knowledge[] = []
  counter: number[]
  errText: string

ngOnInit() {
  this.page = Number(this.route.snapshot.paramMap.get('page'))
  this.counter = this.api.makeCounterArray(NativeObj.GetKnowledgeCount() / 10)
  if (!this.page)
    this.page = 1
  this.loadKnowledges(this.page)
}

loadKnowledges(page: number) {
  this.api.getKnowledges(page, 10).subscribe((res: KnowledgeResult) => {
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
delete(knowledge: Knowledge) {
  let obs = this.api.deleteKnowledge(knowledge.code)
  obs.subscribe((res: BaseResult) => {
    if (res.error)
      this.errText = res.error
    else
      this.knowledges = this.knowledges.filter((i) => i.code != knowledge.code)
  })
}
}

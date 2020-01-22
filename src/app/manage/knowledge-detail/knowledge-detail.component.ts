import { Component, OnInit } from '@angular/core';
import { Knowledge } from 'src/app/entities/knowledge';
import { BASE_URL, ApiService } from 'src/app/api.service';
import { KnowledgeResult, BaseResult } from 'src/app/entities/Result';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.scss']
})
export class KnowledgeDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  knowledge: Knowledge
  errText: string
  mediaUrl: string = BASE_URL + '/picture/'
  showSucceededAlert = false

  ngOnInit() {
    let knowledgeCode = this.route.snapshot.paramMap.get('code')
    if (!knowledgeCode) {
      this.knowledge = null
      return
    }
    this.api.getKnowledges(0, 0, knowledgeCode).subscribe((res: KnowledgeResult) => {
      if (res.error || !res.knowledges || !res.knowledges.length) {
        this.knowledge = null
        this.errText = res.error
        return
      }
      this.knowledge = res.knowledges[0]
      if (!this.knowledge.pictures) this.knowledge.pictures = []
      if (!this.knowledge.videos) this.knowledge.videos = []
    })
  }

  saveDescription() {
    let obs = this.api.updateKnowledgeIntro(this.knowledge.code,
      document.getElementById('knowledge-description').innerText)
    obs.subscribe((res: BaseResult) => {
      if (this.errText) {
        this.errText = res.error
        return
      }
      this.showSucceededAlert = true
      setTimeout(() => {
        this.showSucceededAlert = false
      }, 1500)
    })
  }
  saveTrait() {
    let obs = this.api.updateKnowledgeTrait(this.knowledge.code,
      document.getElementById('knowledge-description').innerText)
    obs.subscribe((res: BaseResult) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.showSucceededAlert = true
      setTimeout(() => {
        this.showSucceededAlert = false
      }, 1500)
    })
  }

  back() {
    history.back()
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { RelicResult, BaseResult } from 'src/app/entities/Result';
import { Relic } from 'src/app/entities/Relic';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

declare let NativeObj

@Component({
  selector: 'app-relic',
  templateUrl: './relic.component.html',
  styleUrls: ['./relic.component.scss']
})
export class RelicComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }
    page: number
    relics: Relic[] = []
    counter: number[]
    errText: string

  ngOnInit() {
    this.page = Number(this.route.snapshot.paramMap.get('page'))
    this.counter = this.api.makeCounterArray(NativeObj.GetRelicCount() / 10)
    if (!this.page)
      this.page = 1
    this.loadRelics(this.page)
  }

  loadRelics(page: number) {
    this.api.getRelics(page, 10).subscribe((res: RelicResult) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      if (!res.relics || res.relics.length == 0) return
      this.relics = res.relics
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
  delete(relic: Relic) {
    let obs = this.api.deleteRelic(relic.code)
    obs.subscribe((res: BaseResult) => {
      if (res.error)
        this.errText = res.error
      else
        this.relics = this.relics.filter((i) => i.code != relic.code)
    })
  }
}

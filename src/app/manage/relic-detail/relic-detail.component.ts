import { Component, OnInit } from '@angular/core';
import { Relic } from 'src/app/entities/Relic';
import { ActivatedRoute } from '@angular/router';
import { ApiService, BASE_URL } from 'src/app/api.service';
import { RelicResult, BaseResult, RelicTypesResult } from 'src/app/entities/Result';
import { RelicType } from 'src/app/entities/RelicType';

@Component({
  selector: 'relic-detail',
  templateUrl: './relic-detail.component.html',
  styleUrls: ['./relic-detail.component.scss']
})
export class RelicDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  relic: Relic = {} as Relic
  errText: string
  changedRelicType: RelicType
  mediaUrl: string = BASE_URL + '/picture/'
  showSucceededAlert = false
  relicTypes: RelicType[]
  //修改的数据
  boundData: any = {}

  ngOnInit() {
    let relicCode = this.route.snapshot.paramMap.get('code')
    if (!relicCode) {
      this.relic = null
      return
    }
    this.api.getRelicTypes().subscribe((res: RelicTypesResult) => {
      this.relicTypes = res.relicTypes
    })
    this.api.getRelics(0, 0, relicCode).subscribe((res: RelicResult) => {
      if (res.error || !res.relics || !res.relics.length) {
        this.relic = null
        this.errText = res.error
        return
      }
      this.relic = res.relics[0]
      this.boundData = JSON.parse(JSON.stringify(this.relic))
      if(!this.boundData.location) {
        this.boundData.location = {}
      }
      if (!this.relic.pictures) this.relic.pictures = []
      if (!this.relic.videos) this.relic.videos = []
      this.changedRelicType = this.relic.relicType
    })
  }

  updateRelic() {
    this.boundData.relicTypeCode = this.changedRelicType.code
    this.boundData.description = document.getElementById('relic-description').innerText
    this.api.updateRelic(this.boundData).subscribe((res: BaseResult) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.showSucceededAlert = true
      setTimeout(() => {
        this.showSucceededAlert = false
      }, 1500);
    })
  }

  changeRelicType(t: RelicType) {
    this.changedRelicType = t
  }
}
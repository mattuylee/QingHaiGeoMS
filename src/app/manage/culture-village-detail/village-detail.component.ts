import { Component, OnInit } from '@angular/core';
import { BASE_URL, ApiService } from 'src/app/api.service';
import { BaseResult, SearchResult } from 'src/app/entities/Result';
import { ActivatedRoute } from '@angular/router';
import { CultureVillage } from 'src/app/entities/village';

@Component({
  selector: 'app-village-detail',
  templateUrl: './village-detail.component.html',
  styleUrls: ['./village-detail.component.scss']
})
export class CultureVillageDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  village: CultureVillage
  errText: string
  mediaUrl: string = BASE_URL + '/picture/'
  showSucceededAlert = false

  ngOnInit() {
    let villageCode = this.route.snapshot.paramMap.get('code')
    if (!villageCode) {
      this.village = null
      return
    }
    this.api.getCultureVillages(villageCode).subscribe((res: SearchResult<CultureVillage>) => {
      if (res.error || !res.results || !res.results.length) {
        this.village = null
        this.errText = res.error
        return
      }
      this.village = res.results[0]
      if (!this.village.pictures) this.village.pictures = []
      if (!this.village.videos) this.village.videos = []
    })
  }

  saveDescription() {
    let obs = this.api.updateVillageIntro(this.village.code,
      document.getElementById('village-description').innerText)
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

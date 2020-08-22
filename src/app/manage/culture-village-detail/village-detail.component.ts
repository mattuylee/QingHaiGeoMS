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


  village: CultureVillage = {} as CultureVillage
  errText: string
  mediaUrl: string = BASE_URL + '/picture/'
  showSucceededAlert = false
  //修改的数据
  boundData: any

  ngOnInit() {
    let villageCode = this.route.snapshot.paramMap.get('code')
    if (!villageCode) {
      this.village = null
      return
    }
    this.api.getCultureVillages(villageCode).toPromise().then((res: SearchResult<CultureVillage>) => {
      if (res.error || !res.results || !res.results.length) {
        this.village = null
        this.errText = res.error
        return
      }
      this.village = res.results[0]
      this.boundData = JSON.parse(JSON.stringify(this.village))
      if (!this.boundData.location) {
        this.boundData.location = {} as any
      }
      for (let key in this.boundData.location) {
        if (!isNaN(parseFloat(this.boundData.location[key]))) {
          this.boundData.location[key] = +parseFloat(this.boundData.location[key]).toFixed(7);
        }
      }
      if (!this.village.pictures) this.village.pictures = []
      if (!this.village.videos) this.village.videos = []
    })
  }

  updateVillage() {
    this.boundData.description = (document.getElementById('village-description') as HTMLTextAreaElement).value
    this.api.updateVillage(this.boundData).subscribe((res: BaseResult) => {
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

  back() {
    history.back()
  }
}
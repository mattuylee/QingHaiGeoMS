import { Component, OnInit } from '@angular/core';
import { BASE_URL, ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { Moment } from 'src/app/entities/moment';
import { MomentResult } from 'src/app/entities/Result';

@Component({
  selector: 'app-moment-detail',
  templateUrl: './moment-detail.component.html',
  styleUrls: ['./moment-detail.component.scss']
})
export class MomentDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }
  moment: Moment
  readonly mediaUrl: string = BASE_URL + '/picture/'

  ngOnInit() {
    let code = this.route.snapshot.paramMap.get('code')
    if (!code) { return }
    this.api.getMoment(code).toPromise().then((res: MomentResult) => {
      this.moment = res.moments[0]
    })
  }

  back() {
    history.back()
  }
}

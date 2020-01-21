import { Component, OnInit } from '@angular/core';
import { Moment } from 'src/app/entities/moment';
import { ApiService } from 'src/app/api.service';
import { ManageService } from 'src/app/shared/manage.service';
import { Question } from 'src/app/entities/question';

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
  readonly itemCount = this.manageService.itemCount

  ngOnInit() {
    this.loadMoments(1)
  }
  loadMoments(page: number) {
    this.api.getMoments(page, this.itemCount).toPromise().then(res => {
      this.page = page
      this.moments = res.moments
      this.resultAmount = res.count
      this.pageCount = Math.ceil(this.resultAmount / this.itemCount)
    })
  }
}

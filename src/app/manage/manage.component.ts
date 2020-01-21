import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ManageService } from '../shared/manage.service';
import { ApiService } from '../api.service';
import { StatisticData } from '../entities/statistic';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.scss', './manage.component.scss']
})
export class ManageComponent implements OnInit {
  constructor(
    private api: ApiService,
    public manageService: ManageService
  ) { }
  data 

  ngOnInit() {
    this.api.getStatisticData().toPromise().then((data) => {
      this.data = data
    })
  }
  toggleFoldState() {
    this.manageService.tableFolded = !this.manageService.tableFolded
    this.manageService.navigationFolded = !this.manageService.tableFolded
  }

  uploadData() {
    /**@todo */
  }
}

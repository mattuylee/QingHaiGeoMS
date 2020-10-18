import { Component, OnInit } from '@angular/core';
import { ManageService } from 'src/app/shared/manage.service';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss']
})
export class TableWrapperComponent implements OnInit {
  constructor(
    public service: ManageService
  ) { }

  ngOnInit() {
  }

  toggleFoldState() {
    this.service.tableFolded = !this.service.tableFolded
    this.service.navigationFolded = !this.service.tableFolded
  }
}

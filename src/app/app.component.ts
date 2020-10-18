import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { ManageService } from './shared/manage.service';

declare const CefSharp

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (
    private api: ApiService,
    private manageService: ManageService
  ) { }

  adminId: string
  readonly currentYear = new Date().getFullYear()

  async ngOnInit() {
    if (window['CefSharp']) {
      await CefSharp.BindObjectAsync('NativeObj')
    }
    this.api.init()
    this.adminId = this.api.getCurrentAdmin()
  }
  toggleFoldState() {
    this.manageService.navigationFolded = !this.manageService.navigationFolded
  }
}


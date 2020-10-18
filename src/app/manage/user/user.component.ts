import { Component, OnInit } from '@angular/core';
import { UsersResult, BaseResult } from 'src/app/entities/Result';
import { ApiService } from 'src/app/api.service';
import { User } from 'src/app/entities/User';
import { Observable } from 'rxjs';
import { ManageService } from 'src/app/shared/manage.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../manage.scss', './user.component.scss']
})
export class UserComponent implements OnInit {
  constructor(
    private api: ApiService,
    private manageService: ManageService
  ) { }
  resultAmount = 0
  users: User[]
  currentAdminId: string
  page: number
  pageCount: number
  keyword: string
  errText: string
  readonly itemCount = this.manageService.itemCount

  //密码已重置的索引
  resetedFlagArr = []

  ngOnInit() {
    this.currentAdminId = this.api.getCurrentAdmin()
    this.loadUsers(1)
  }

  loadUsers(page: number, keyword?: string) {
    this.keyword = keyword ? keyword : ''
    this.api.getUsers(page, 10, this.keyword).subscribe((res) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      this.users = res.results
      this.resultAmount = res.count
      this.resetedFlagArr = []
      this.pageCount = Math.ceil(this.resultAmount / this.itemCount)
    })
  }

  setAdministration(user: User, setToAdmin: boolean) {
    if (user.isAdmin == setToAdmin) { return }
    this.api.setAdministration(user.id, setToAdmin).subscribe((res: BaseResult) => {
      if (res.error) {
        this.errText = res.error
        user.isAdmin = !setToAdmin
        return
      }
      user.isAdmin = setToAdmin
    })
  }
  changeUserRole(user: User, ev) {
    this.setAdministration(user, ev.target.value == String(true))
  }

  freeze(user: User) {
    if (user.id == this.currentAdminId) { return }
    let obs: Observable<BaseResult>
    if (user.isFreezed)
      obs = this.api.unfreezeUser(user.id)
    else
      obs = this.api.freezeUser(user.id)
    obs.subscribe((res) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      user.isFreezed = !user.isFreezed
    })
  }
  async resetPassword(i: number) {
    if (this.resetedFlagArr[i]) {
      this.resetedFlagArr[i] = null
      return
    }
    const res = await this.api.resetPassword(this.users[i].id).toPromise()
    if (res.error) {
      this.errText = res.error
    }
    else {
      this.resetedFlagArr[i] = true
    }
  }

  hideFailedTip() {
    this.errText = null
  }

  jump(index: number) {
    this.loadUsers(index, this.keyword)
  }
}

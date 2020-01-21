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
  currentAdmin: User
  page: number
  pageCount: number
  errText: string
  readonly itemCount = this.manageService.itemCount

  ngOnInit() {
    this.currentAdmin = this.api.getCurrentAdmin()
    this.loadUsers(1)
  }

  loadUsers(page: number, keyword?: string) {
    if (!keyword) { keyword = '' }
    this.api.getUsers(page, 10, keyword).subscribe((res) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      this.users = res.results
      this.resultAmount = res.count
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
    if (this.currentAdmin && user.id == this.currentAdmin.id) { return }
    let obs: Observable<BaseResult>
    if (user.isFreezed)
      obs = this.api.unfreezeUser(user.id)
    else
      obs = this.api.freezeUser(user.id)
    obs.subscribe((res)=>{
      if (res.error) {
        this.errText = res.error
        return
      }
      user.isFreezed = !user.isFreezed
    })
  }

  hideFailedTip() {
    this.errText = null
  }
}

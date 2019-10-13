import { Component, OnInit } from '@angular/core';
import { UsersResult, BaseResult } from 'src/app/entities/Result';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { User } from 'src/app/entities/User';
import { Observable } from 'rxjs';

declare let NativeObj;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
    ) { }
    
  users: User[]
  currentAdmin: User
  page: number
  counter: number[]
  errText: string

  ngOnInit() {
    this.currentAdmin = this.api.getCurrentAdmin()
    this.counter = this.api.makeCounterArray(NativeObj.GetUserCount() / 10)
    this.loadUsers(1)
  }

  loadUsers(page: number) {
    this.api.getUsers(page, 10).subscribe((res: UsersResult) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      this.page = page
      if (!res.users || res.users.length == 0) return
      this.users = res.users
      console.log(this.currentAdmin.id, this.users[6].id)
    })
  }

  setAdministration(user: User, setToAdmin: boolean) {
    if (user.isAdmin == setToAdmin)
      return
    this.api.setAdministration(user.id, setToAdmin).subscribe((res: BaseResult) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      user.isAdmin = setToAdmin
    })
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

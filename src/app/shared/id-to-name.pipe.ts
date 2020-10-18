import { Pipe, PipeTransform } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../entities/User';

@Pipe({
  name: 'idToName'
})
export class IdToNamePipe implements PipeTransform {
  constructor(
    private api: ApiService
  ) { }
  async transform(value: string, type: string): Promise<string> {
    if (value === null || value === undefined) { return '' }
    switch (type) {
      case 'user':
        const user: User = (await this.api.getUser(value).toPromise()).user
        if (!user) { return null }
        return user.realName ? user.realName : (user.nickName ? user.nickName : user.userName)
      default:
        return null
    }
  }

}

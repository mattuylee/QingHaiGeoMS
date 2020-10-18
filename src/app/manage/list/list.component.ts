import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['../manage.scss', './list.component.scss']
})
export class ListComponent implements OnInit {
  constructor() { }

  headers: string[] = []
  ngOnInit() {
    for (const key in new RelicHeader()) {
      this.headers.push(key)
    }
  }

  //搜索
  search() {
  }

}

class RelicHeader {
  "遗迹点编码": string = undefined
  "遗迹点名称": string = undefined
  "遗迹类型": string = undefined
  "经度": string = undefined
  "纬度": string = undefined
  "照片数": string = undefined
  "视频数": string = undefined
  "发布时间": string = undefined
  "发布人": string = undefined
}
class KnowledgeHeader {
  "类型编码": string
  "地质科普类型": string
  "照片数": string
  "视频数": string
  "发布时间": string
  "发布人": string
}
class MomentHeader {
  "标题": string
  "发布账号": string
  "发布时间": string
}
class UserHeader {
  "账号": string
  "密码": string
  "注册时间": string
  "角色": string
}
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  constructor(
  ) { }
  @Input() pageCount: number = 0  //总页数
  @Input() itemCount: number = 0  //总记录数
  @Input() current: number = 0  //当前页
  @Output() onJump = new EventEmitter<number>() //跳转事件
  
  ngOnInit() {
  }

  jump(index: number) {
    if (!(index > 0 && index <= this.pageCount)) { return }
    this.onJump.emit(index)
  }
}

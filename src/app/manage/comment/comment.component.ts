import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { TargetType } from 'src/app/entities/enums';
import { CommentResult } from 'src/app/entities/Result';
import { Comment } from 'src/app/entities/comment';
import { CommandName } from 'protractor';

declare let NativeObj

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  code: string
  title: string
  targetType: TargetType
  comments: Comment[]
  counter: number[]
  page: number
  errText: string

  ngOnInit() {
    this.targetType = TargetType[this.route.snapshot.queryParamMap.get('targetType')]
    this.title = this.route.snapshot.queryParamMap.get('title')
    this.code = this.route.snapshot.paramMap.get('code')
    this.loadComments()
  }

  loadComments() {
    this.api.getComments(this.code, 1, 999).subscribe((res: CommentResult) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      if (!res.comments || res.comments.length == 0) return
      this.comments = res.comments
    })
  }
  deleteComment(commentId: string) {
    this.api.deleteComment(commentId).subscribe((res) => { 
      if (res.error) {
        this.errText = res.error
        return
      }
      this.comments = this.comments.filter((i) => i.code != commentId)
    })
  }

  back() {
    history.back()
  }
}

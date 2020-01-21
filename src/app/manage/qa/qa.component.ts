import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ManageService } from 'src/app/shared/manage.service';
import { Question } from 'src/app/entities/question';
import { Answer } from 'src/app/entities/answer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['../manage.scss', './qa.component.scss']
})
export class QaComponent implements OnInit {
  constructor(
    private api: ApiService,
    private manageService: ManageService
  ) { }
  questions: Question[]
  page = 1
  pageCount = 0
  questionAmount = 0
  keyword: string
  answerMap: { expanded: boolean, answers: Answer[], obs?: Observable<any> }[] = []
  readonly itemCount = this.manageService.itemCount
  
  ngOnInit() {
    this.loadQuestions(1)
  }

  loadQuestions(page: number, keyword?: string) {
    this.keyword = keyword ? keyword : ''
    this.api.getQuestions(this.keyword, page, this.itemCount).toPromise().then(data => {
      this.questions = data.results
      this.page = page
      this.questionAmount = data.count
      this.pageCount = Math.ceil(this.questionAmount / this.itemCount)
      this.answerMap = []
      if (this.questions) {
        this.answerMap = this.questions.map(() => {
          return { expanded: false, answers: null }
        })
      }
    })
  }
  toggleAnswers(index: number) {
    this.answerMap[index].expanded = !this.answerMap[index].expanded
    if (this.answerMap[index].answers || this.answerMap[index].obs) { return }
    this.answerMap[index].obs = this.api.getAnswers(this.questions[index].code, 1, 99)
    this.answerMap[index].obs.toPromise().then(res => {
      this.answerMap[index].answers = res.answers
      this.answerMap[index].obs = null
    })
  }
  deleteQuestion(index: number) {
    this.api.deleteQuestion(this.questions[index].code).toPromise().then(res => {
      if (!res.error) {
        this.questions.splice(index, 1)
        this.answerMap.splice(index, 1)
        --this.questionAmount
      }
      else {
        alert("删除失败。" + res.error)
      }
    })
  }
  deleteAnswer(questionIndex: number, index: number) {
    const answers = this.answerMap[questionIndex].answers
    this.api.deleteAnswer(answers[index].code).toPromise().then(res => {
      if (!res.error) {
        answers.splice(index, 1)
      }
      else {
        alert("删除失败。" + res.error)
      }
    })
  }
  jump(index: number) {
    this.loadQuestions(index, this.keyword)
  }
}

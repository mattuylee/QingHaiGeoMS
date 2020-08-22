import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './entities/location';
import { BaseResult, SearchResult } from './entities/Result';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TargetType } from './entities/enums';
import { StatisticData } from './entities/statistic';
import { CultureVillage } from './entities/village';

let NativeObj

// export let BASE_URL = 'http://localhost:8081'
export let BASE_URL = 'http://47.108.76.144:8081'
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient
  ) { }

  private user
  private cache = {
    statisticData: null,  //统计数据缓存
    relics: null  //遗迹缓存
  }
  /**@deprecated */
  public readonly baseRoute: string = ''
  /**
   *
   * @param id 是否包含管理员ID
   * @param form Content-Type是否为表单
   * @param json Content-Type是否为json
   * @param contentType 设置Content-Type
   */
  private makeHeader(option: {
    id?: boolean,
    form?: boolean,
    json?: boolean,
    contentType?: string
  } = {}) {
    if (!this.user) {
      this.user = { id: undefined } as any
    }
    let header: any = {}
    if (option.id !== false)
      header = { ...header, ...{ "id": this.user.id } }
    if (option.form)
      header = { ...header, ...{ "Content-Type": 'application/x-www-form-urlencoded' } }
    if (option.json)
      header = { ...header, ...{ "Content-Type": 'application/json' } }
    if (option.contentType)
      header = { ...header, ...{ "Content-Type": option.contentType } }
    return new HttpHeaders(header)
  }

  public init() {
    let temp
    temp = window
    NativeObj = temp.NativeObj
    try {
      let id = NativeObj.Login()
      this.user = { id: id }
      let baseUrl = NativeObj.GetBaseUrl()
      if (baseUrl)
        BASE_URL = baseUrl
    }
    catch (e) { alert(e.message) }
    if (!this.user || !this.user.id)
      alert('登陆失败！')
    else
      console.log('user', this.user)
  }

  public getRelics(page: number = 1, size: number = 5, code: string = null) {
    let p = { page: page.toString(), size: size.toString() }
    if (code) { p['relicCode'] = code }
    return this.handleError(this.http.get(BASE_URL + '/relic', {
      headers: this.makeHeader({ id: false }), params: p
    }))
  }
  //搜索遗迹点
  public searchRelics(keyword: string, page: number, size: number) {
    return this.handleError(this.http.get(BASE_URL + '/ycxSearchRelic', {
      params: {
        keyword: keyword,
        page: String(page),
        size: String(size)
      }
    }))
  }
  public getRelicTypes() {
    const obs = this.http.get(BASE_URL + '/relicTypes')
    return this.handleError(obs)
  }
  public getKnowledges(page: number, size: number, code: string = null) {
    let p = { page: page.toString(), size: size.toString() }
    if (code)
      Object.defineProperty(p, 'code', { enumerable: true, value: code })
    return this.handleError(this.http.get(BASE_URL + '/knowledge', {
      headers: this.makeHeader({ id: false }), params: p
    }))
  }
  public searchKnowledges(keyword: string, page: number, size: number) {
    return this.handleError(this.http.get(BASE_URL + '/knowledge/ycxSearch', {
      params: {
        keyword: keyword,
        page: String(page),
        size: String(size)
      }
    }))
  }
  public getComments(targetCode: string, page: number, size: number) {
    return this.handleError(this.http.get(BASE_URL + '/comments', {
      headers: this.makeHeader(),
      params: {
        target: targetCode,
        size: String(size),
        page: String(page)
      }
    }))
  }
  public deleteComment(commentId: string) {
    return this.handleError(this.http.delete(BASE_URL + '/comment', {
      headers: this.makeHeader(),
      params: { target: commentId }
    }))
  }
  public freezeUser(userId: string) {
    let body = 'userId=' + encodeURIComponent(userId)
    return this.handleError(this.http.put(BASE_URL + '/admin/user/freeze', body, {
      headers: this.makeHeader({ id: true, form: true })
    }))
  }
  public unfreezeUser(userId: string) {
    let body = 'userId=' + encodeURIComponent(userId)
    return this.handleError(this.http.put(BASE_URL + '/admin/user/unfreeze', body, {
      headers: this.makeHeader({ id: true, form: true })
    }))
  }
  public getUsers(page: number, size: number, keyword = '') {
    this.makeHeader()
    return this.handleError(this.http.get(BASE_URL + '/user/ycxSearch', {
      headers: { adminID: this.user.id },
      params: { page: String(page), size: String(size), keyword: keyword }
    }))
  }
  public getUser(userId: string) {
    return this.handleError(this.http.get(BASE_URL + '/admin/user', {
      params: { userId: userId },
      headers: this.makeHeader({ id: true })
    }))
  }
  public getMoments(keyword: string, page, size) {
    return this.handleError(this.http.get(BASE_URL + '/moment/ycxSearch', {
      params: { keyword: keyword, page: page, size: size }
    }))
  }
  public getMoment(code: string) {
    return this.handleError(this.http.get(BASE_URL + '/moment', {
      params: { code: code }
    }))
  }
  public deleteMoment(code: string) {
    return this.handleError(this.http.delete(BASE_URL + '/moment/delete', {
      headers: this.makeHeader(),
      params: { code: code }
    }))
  }
  public getQuestions(keyword: string, page, size) {
    return this.handleError(this.http.get(BASE_URL + '/qa/ycxSearchQuestion', {
      params: { keyword: keyword ? keyword : '', page: page, size: size }
    }))
  }
  public deleteQuestion(questionCode: string) {
    return this.handleError(this.http.delete(BASE_URL + '/qa/question/delete', {
      headers: this.makeHeader(),
      params: { code: questionCode }
    }))
  }
  public getAnswers(questionCode: string, page, size) {
    return this.handleError(this.http.get(BASE_URL + '/qa/answer/list', {
      params: {
        target: questionCode,
        page: page,
        size: size
      }
    }))
  }
  public deleteAnswer(answerCode: string) {
    return this.handleError(this.http.delete(BASE_URL + '/qa/answer/delete', {
      headers: this.makeHeader(),
      params: { code: answerCode }
    }))
  }
  //获取当前管理员用户id
  public getCurrentAdmin() {
    return this.user.id
  }

  public setAdministration(userId: string, setToAdmin: boolean) {
    this.makeHeader()
    return this.handleError(this.http.get(BASE_URL + '/admin/setAdmin', {
      params: { whetherAdmin: String(setToAdmin) },
      headers: {
        superAdminID: this.user.id,
        userID: userId
      }
    }))
  }

  public freezeRelic(code: string) {
    return this.handleError(this.http.put(BASE_URL + '/admin/relic/freeze', null, {
      params: { code: code },
      headers: this.makeHeader({ id: true })
    }))
  }
  public unfreezeRelic(code: string) {
    return this.handleError(this.http.put(BASE_URL + '/admin/relic/unfreeze', null, {
      params: { code: code },
      headers: this.makeHeader({ id: true })
    }))
  }

  public updateRelicLocation(code: string, location: Location) {
    let url = BASE_URL + '/admin/relic/update/location?code=' + code;
    return this.handleError(this.http.put(url, location, { headers: this.makeHeader({ id: true, json: true }) }))
  }
  public updateRelic(update: any) {
    let obs = Observable.create((observer) => {
      let res = new BaseResult()
      res.error = NativeObj.UpdateRelic(JSON.stringify(update))
      observer.next(res)
      observer.complete()
    })
    return this.handleError(obs)
  }
  public updateVillage(update: any) {
    let obs = Observable.create((observer) => {
      let res = new BaseResult()
      res.error = NativeObj.UpdateVillage(JSON.stringify(update))
      observer.next(res)
      observer.complete()
    })
    return this.handleError(obs)
  }
  public reorderRelicPictures(code: string, order: number[]) {
    let url = BASE_URL + '/admin/relic/reorder/picture?code=' + code;
    return this.handleError(this.http.put(url, order, { headers: this.makeHeader({ json: true }) }))
  }
  public deleteRelicPicture(code: string, picId: string) {
    let url = BASE_URL + '/admin/relic/delete/picture?code=' + code + '&picId=' + picId;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader() }))
  }
  public reorderRelicVideoes(code: string, order: number[]) {
    let url = BASE_URL + '/admin/relic/reorder/video?code=' + code;
    return this.handleError(this.http.put(url, order, { headers: this.makeHeader({ json: true }) }))
  }
  public deleteRelicVideo(code: string, vId: string) {
    let url = BASE_URL + '/admin/relic/delete/video?code=' + code + '&videoId=' + vId;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader() }))
  }
  public playVideo(url: string) {
    NativeObj.PlayVideo(url)
  }
  public deleteRelic(code: string) {
    let url = BASE_URL + '/admin/relic/delete?code=' + code;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader() }))
  }
  public updateKnowledgeIntro(code: string, intro: string) {
    let url = BASE_URL + '/admin/knowledge/update/intro';
    let body = 'code=' + code + '&intro=' + encodeURIComponent(intro)
    return this.handleError(this.http.put(url, body, { headers: this.makeHeader({ form: true }) }))
  }

  public updateKnowledgeTrait(code: string, trait: string) {
    let obs = Observable.create((observer) => {
      let res = new BaseResult()
      res.error = NativeObj.UpdateKnowledgeTrait(code, trait)
      observer.next(res)
      observer.complete()
    })
    return this.handleError(obs)
  }

  public deleteKnowledgePicture(code: string, picId: string) {
    let url = BASE_URL + '/admin/knowledge/delete/picture?code=' + code + '&picId=' + picId;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader({ json: true }) }))
  }
  public reorderKnowledgePictures(code: string, order: number[]) {
    let url = BASE_URL + '/admin/knowledge/reorder/picture?code=' + code;
    return this.handleError(this.http.put(url, order, { headers: this.makeHeader({ json: true }) }))
  }
  public reorderKnowledgeVideoes(code: string, order: number[]) {
    let url = BASE_URL + '/admin/knowledge/reorder/video?code=' + code;
    return this.handleError(this.http.put(url, order, { headers: this.makeHeader({ json: true }) }))
  }
  public deleteKnowledgeVideo(code: string, videoId: string) {
    let url = BASE_URL + '/admin/knowledge/delete/video?code=' + code + '&videoId=' + videoId;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader({}) }))
  }
  public freezeKnowledge(code: string) {
    let url = BASE_URL + '/admin/knowledge/freeze?code=' + code;
    return this.handleError(this.http.put(url, null, { headers: this.makeHeader() }))
  }
  public unfreezeKnowledge(code: string) {
    let url = BASE_URL + '/admin/knowledge/unfreeze?code=' + code;
    return this.handleError(this.http.put(url, null, { headers: this.makeHeader() }))
  }
  public deleteKnowledge(code: string) {
    let url = BASE_URL + '/admin/knowledge/delete?code=' + code;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader() }))
  }
  public freezeVillage(code: string) {
    let url = BASE_URL + '/admin/village/freeze?code=' + code;
    return this.handleError(this.http.put(url, null, { headers: this.makeHeader() }))
  }
  public unfreezeVillage(code: string) {
    let url = BASE_URL + '/admin/village/unfreeze?code=' + code;
    return this.handleError(this.http.put(url, null, { headers: this.makeHeader() }))
  }
  public deleteVillage(code: string) {
    let url = BASE_URL + '/admin/village/delete?code=' + code;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader() }))
  }
  public updateVillageIntro(code: string, intro: string) {
    let url = BASE_URL + '/admin/village/update/intro';
    let body = 'code=' + code + '&intro=' + encodeURIComponent(intro)
    return this.handleError(this.http.put(url, body, { headers: this.makeHeader({ form: true }) }))
  }
  public deleteVillagePicture(code: string, picId: string) {
    let url = BASE_URL + '/admin/village/delete/picture?code=' + code + '&picId=' + picId;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader({ json: true }) }))
  }
  public reorderVillagePictures(code: string, order: number[]) {
    let url = BASE_URL + '/admin/village/reorder/picture?code=' + code;
    return this.handleError(this.http.put(url, order, { headers: this.makeHeader({ json: true }) }))
  }
  public reorderVillageVideoes(code: string, order: number[]) {
    let url = BASE_URL + '/admin/village/reorder/video?code=' + code;
    return this.handleError(this.http.put(url, order, { headers: this.makeHeader({ json: true }) }))
  }
  public deleteVillageVideo(code: string, videoId: string) {
    let url = BASE_URL + '/admin/village/delete/video?code=' + code + '&videoId=' + videoId;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader({}) }))
  }
  public deleteComments(codes: string[]) {
    let url = BASE_URL + '/admin/comment/delete';
    return this.handleError(this.http.delete(url, { headers: this.makeHeader({ json: true }), params: { id: codes } }))
  }
  public deleteQuestions(codes: string[]) {
    let url = BASE_URL + '/admin/qa/question/delete';
    return this.handleError(this.http.delete(url, { headers: this.makeHeader({ json: true }), params: { code: codes } }))
  }
  public deleteAnswers(codes: string[]) {
    let url = BASE_URL + '/admin/qa/answer/delete';
    return this.handleError(this.http.delete(url, { headers: this.makeHeader({ json: true }), params: { code: codes } }))
  }
  //获取统计数据
  public getStatisticData(): Observable<{
    relic: StatisticData,
    knowledge: StatisticData,
    moment: StatisticData,
    qa: StatisticData
  }> {
    if (this.cache.statisticData) { return of(this.cache.statisticData) }
    let url = BASE_URL + '/admin/statistics';
    return this.handleError(this.http.get<any>(url).pipe(map((data) => {
      if (data && !data.error) {
        this.cache.statisticData = data
      }
      return data
    })))
  }

  public addPicture(file, code: string, target: TargetType) {
    return Observable.create((observer) => {
      let url = BASE_URL + '/admin/' + TargetType[target] + '/add/picture?code=' + code
      let form = new FormData()
      form.append('picture', file, 'picture')
      if (!XMLHttpRequest) {
        observer.error('浏览器不支持异步上传，请升级浏览器')
        return
      }
      let xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('id', this.user.id)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200)
            observer.complete()
          else
            observer.error('服务器内部错误')
        }
      }
      xhr.upload.onprogress = (ev) => {
        observer.next(ev.loaded / ev.total)
      }
      xhr.onerror = (ev) => {
        observer.error(ev)
        console.log('error', ev)
      }
      xhr.send(form)
    })
  }
  // 获取文化村数据
  public getCultureVillages(code?: string, keyword?: string, page?: number, size?: number): Observable<SearchResult<CultureVillage>> {
    const params = {
      all: true,
      code,
      keyword,
      page,
      size
    } as any
    for (let key in params) {
      if (!params[key]) {
        delete params[key]
      }
    }
    return this.handleError(this.http.get(BASE_URL + '/village', {
      headers: this.makeHeader(),
      params: params
    }))
  }

  public addRelicVideo(code: string) {
    NativeObj.AddRelicVideo(code)
  }
  public addKnowledgeVideo(code: string) {
    NativeObj.AddKnowledgeVideo(code)
  }
  public addVillageVideo(code: string) {
    NativeObj.AddVillageVideo(code)
  }
  public uploadRelics() {
    NativeObj.UploadRelics()
  }
  public uploadKnowledges() {
    NativeObj.UploadKnowledges()
  }
  public uploadVillages() {
    NativeObj.UploadVillages()
  }


  public makeCounterArray(value: number): number[] {
    if (value <= 0) return []
    let res = []
    for (let i = 0; i < value; ++i)
      res.push(i)
    return res
  }

  private handleError(obs: Observable<any>): Observable<any> {
    return Observable.create((observer) => {
      obs.subscribe({
        next: (res) => {
          observer.next(res)
          if (res.error)
            console.log('服务器返回了一个错误：', res.error)
        },
        error: (e) => {
          let result = new BaseResult
          console.log('网络错误', e)
          result.error = '网络错误：\n' + e.message
          observer.next(result)
        },
        complete: () => observer.complete()
      })
    })
  }
}

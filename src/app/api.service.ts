import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from './entities/location';
import { BaseResult, RelicTypesResult } from './entities/Result';
import { Observable, of, observable } from 'rxjs'
import { User } from './entities/User';

declare let NativeObj
//const BASE_URL = 'http://localhost:8080'
export const BASE_URL = 'http://60.205.187.71:8080'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  private user = {id: '5ccbb97703b7a73e5cdf91c1'}

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
      alert('未登录')
      return
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

  public getRelics(page: number = 1, size: number = 5, code: string = null) {
    let p = { page: page.toString(), size: size.toString() }
    if (code)
      Object.defineProperty(p, 'relicCode', { enumerable: true, value: code })
    return this.handleError(this.http.get(BASE_URL + '/relic' , {
      headers: this.makeHeader({ id: false }), params: p }))
  }
  public getRelicTypes() {
    let obs = Observable.create((observer)=>{
      let types
      try {
        types = NativeObj.GetRelicTypes()
      }
      catch {
        observer.error('获取遗迹类型列表失败')
        return
      }
      let res = new RelicTypesResult();
      if (types)
        res.relicTypes = types
      else
        res.error = '未获取到遗迹类型列表'
      observer.next(res)
      observer.complete()
    })
    return this.handleError(obs)
  }
  public getKnowledges(page: number, size: number, code: string = null) {
    let p = { page: page.toString(), size: size.toString() }
    if (code)
      Object.defineProperty(p, 'code', { enumerable: true, value: code })
    return this.handleError(this.http.get(BASE_URL + '/knowledge' , {
      headers: this.makeHeader({ id: false }), params: p }))
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
      res.error = NativeObj.UpdateRelic(update)
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
  public deleteRelic(code: string) {
    let url = BASE_URL + '/admin/relic/delete?code=' + code;
    this.http.delete(url, { headers: this.makeHeader() }).toPromise()
    let obs = Observable.create((observer) => {
      let res = new BaseResult()
      res.error = NativeObj.DeleteRelic(code)
      observer.next(res)
      observer.complete()
    })
    return this.handleError(obs)
  }
  public updateKnowledgeIntro(code: string, intro: string) {
    let url = BASE_URL + '/admin/knowledge/update/intro';
    return this.handleError(this.http.put(url, { intro: intro }, { headers: this.makeHeader({ json: true }) }))
  }
  public deleteKnowledgePicture(code: string, picId: string) {
    let url = BASE_URL + '/admin/knowledge/delete/picture?code=' + code + '&picId=' + picId;
    return this.handleError(this.http.delete(url, { headers: this.makeHeader({ json: true }) }))
  }
  public reorderKnowledgePictures(code: string, order: number[]) {
    let url = BASE_URL + '/admin/knowledge/reorder/picture?code=' + code;
    return this.handleError(this.http.put(url, { order: order }, { headers: this.makeHeader({ json: true }) }))
  }
  public reorderKnowledgeVideoes(code: string, order: number[]) {
    let url = BASE_URL + '/admin/knowledge/reorder/video?code=' + code;
    return this.handleError(this.http.put(url, { order: order }, { headers: this.makeHeader({ json: true }) }))
  }
  public deleteKnowledgeVideo(code: string, videoId: string) {
    let url = BASE_URL + '/admin/knowledge/delete/video?code=' + code + '&videoId' + videoId;
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

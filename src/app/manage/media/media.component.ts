import { Component, OnInit } from '@angular/core';
import { ApiService, BASE_URL } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { Relic, VideoInfo } from 'src/app/entities/Relic';
import { Knowledge } from 'src/app/entities/knowledge';
import { RelicResult, BaseResult, KnowledgeResult } from 'src/app/entities/Result';
import { Observable } from 'rxjs';
import { TargetType } from 'src/app/entities/enums';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  //媒体序列
  orderArray: number[] = []
  //媒体序列备份
  oldOrderArray: number[]
  //媒体类型
  mediaType: 'picture' | 'video'
  //媒体路径
  media: string[] | VideoInfo[] = []
  //媒体所属对象
  mediaOwner: Relic | Knowledge
  targetType: TargetType
  //是否允许调整顺序
  canChangeOrder: boolean = false
  //正在拖拽的项的索引
  draggingItemIndex: number = -1
  //切分点索引。调整顺序时使用
  splitIndex: number
  //是否正在上传
  uploading: boolean = false
  //上传进度
  uploadProgress: number
  //错误内容
  errText: string

  ngOnInit() {
    this.targetType = TargetType[this.route.snapshot.queryParamMap.get('targetType')]
    this.mediaType = this.route.snapshot.queryParamMap.get('mediaType') as ('picture' | 'video')
    let code = this.route.snapshot.paramMap.get('code')
    let obs: Observable<any>
    if (this.targetType == TargetType.relic)
      obs = this.api.getRelics(0, 0, code)
    else if (this.targetType == TargetType.knowledge)
      obs = this.api.getKnowledges(0, 0, code)
    else {
      this.errText = '参数错误'
      return
    }
    document.addEventListener('mouseup', () => {
      this.draggingItemIndex = -1
      this.splitIndex = this.orderArray.length
    })
    obs.subscribe((res) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      if ((!res.relics || !res.relics.length) && (!res.knowledges || !res.knowledges.length)) {
        this.errText = '获取数据失败'
        return
      }
      if (this.targetType == TargetType.relic)
        this.mediaOwner = (res as RelicResult).relics[0]
      else if (this.targetType == TargetType.knowledge)
        this.mediaOwner = (res as KnowledgeResult).knowledges[0]

      if (this.mediaType == 'picture') {
        this.media = []
        if (this.mediaOwner.pictures) {
          for (let i = 0; i < this.mediaOwner.pictures.length; ++i) {
            if (!this.mediaOwner.pictures[i])
              continue
            (this.media as string[]).push(BASE_URL + '/picture/' + this.mediaOwner.pictures[i])
          }
        }
      }
      else if (this.mediaType == 'video') {
        let media = this.mediaOwner.videos
        if (media) {
          for (let i = 0; i < media.length; ++i) {
            if (!media[i]) continue
            if (media[i].poster)
              media[i].poster = BASE_URL + '/picture/' + media[i].poster
            media[i].video = BASE_URL + '/video/' + media[i].video;
            (this.media as VideoInfo[]).push(media[i])
          }
        }
      }
      this.orderArray = this.api.makeCounterArray(this.media ? this.media.length : 0)
      this.splitIndex = this.orderArray.length
    })
  }
  startDrag(_, index) {
    this.draggingItemIndex = index
  }
  dragOver(event, index) {
    event.preventDefault()
    if (index == -1) return
    if (this.splitIndex == index)
      this.splitIndex++
    else
      this.splitIndex = index
    return
  }

  drop() {
    //不移动
    if (this.splitIndex == this.draggingItemIndex || this.splitIndex == this.draggingItemIndex + 1) {
      this.draggingItemIndex = -1
      this.splitIndex = this.orderArray.length
      return
    }
    let newOrderArray = []
    for (let i = 0; i < this.orderArray.length; ++i) {
      if (i == this.draggingItemIndex)
        continue
      if (i == this.splitIndex) {
        newOrderArray.push(this.orderArray[this.draggingItemIndex])
        newOrderArray.push(this.orderArray[i])
      }
      else if (this.splitIndex == this.orderArray.length && i == this.orderArray.length - 1) {
        newOrderArray.push(this.orderArray[i])
        newOrderArray.push(this.orderArray[this.draggingItemIndex])
      }
      else
        newOrderArray.push(this.orderArray[i])
    }
    this.orderArray = newOrderArray
    this.draggingItemIndex = -1
    this.splitIndex = this.orderArray.length
  }

  changeOrder() {
    this.splitIndex = this.orderArray.length
    if (this.canChangeOrder) {
      this.canChangeOrder = !this.canChangeOrder
      let obs
      if (this.mediaType == 'picture' && this.targetType == TargetType.relic)
        obs = this.api.reorderRelicPictures(this.mediaOwner.code, this.orderArray)
      else if (this.mediaType == 'picture' && this.targetType == TargetType.knowledge)
        obs = this.api.reorderKnowledgePictures(this.mediaOwner.code, this.orderArray)
      else if (this.mediaType == 'video' && this.targetType == TargetType.relic)
        obs = this.api.reorderRelicVideoes(this.mediaOwner.code, this.orderArray)
      else if (this.mediaType == 'video' && this.targetType == TargetType.knowledge)
        obs = this.api.reorderKnowledgeVideoes(this.mediaOwner.code, this.orderArray)
      if (!obs) {
        this.errText = '无效参数'
        return
      }
      obs.subscribe((res: BaseResult) => {
        if (res.error) {
          this.errText = res.error
          this.orderArray = this.oldOrderArray
          return
        }
        let temp = []
        this.orderArray.forEach((i) => temp.push(this.media[i]))
        this.media = temp
        this.orderArray = this.oldOrderArray = this.api.makeCounterArray(this.media.length)
      })
    }
    else {
      this.canChangeOrder = true
      this.oldOrderArray = this.orderArray
    }
  }
  cancelChangeOrder() {
    this.canChangeOrder = false
    this.draggingItemIndex = -1
    this.orderArray = this.oldOrderArray
    this.splitIndex = this.orderArray.length
  }

  deletePicture(i) {
    let obs: Observable<BaseResult>
    let pid = (this.media[i] as string).slice((this.media[i] as string).lastIndexOf('/') + 1)
    if (this.targetType == TargetType.relic)
      obs = this.api.deleteRelicPicture(this.mediaOwner.code, pid)
    else if (this.targetType == TargetType.knowledge)
      obs = this.api.deleteKnowledgePicture(this.mediaOwner.code, pid)
    obs.subscribe((res) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      let temp: string[] = this.media as string[]
      temp = temp.slice(0, i).concat(temp.slice(i + 1))
      this.media = temp
      this.orderArray = this.api.makeCounterArray(this.media.length)
    })
  }
  deleteVideo(i) {
    let obs: Observable<BaseResult>
    let vid = (this.media[i] as VideoInfo).video.slice((this.media[i] as VideoInfo).video.lastIndexOf('/') + 1)
    if (this.targetType == TargetType.relic)
      obs = this.api.deleteRelicVideo(this.mediaOwner.code, vid)
    else if (this.targetType == TargetType.knowledge)
      obs = this.api.deleteKnowledgeVideo(this.mediaOwner.code, vid)
    obs.subscribe((res) => {
      if (res.error) {
        this.errText = res.error
        return
      }
      let temp: VideoInfo[] = this.media as VideoInfo[]
      temp = temp.slice(0, i).concat(temp.slice(i + 1))
      this.media = temp
      this.orderArray = this.api.makeCounterArray(this.media.length)
    })
  }
  playVideo(i) {
    this.api.playVideo((this.media[i] as VideoInfo).video + '?mode=high')
  }
  addVideo() {
    if (this.mediaType == 'picture') return
    if (this.targetType == TargetType.relic)
      this.api.addRelicVideo(this.mediaOwner.code)
    else
      this.api.addKnowledgeVideo(this.mediaOwner.code)
  }

  onPictureChanged(input: HTMLInputElement) {
    if (!input.files.length || this.uploading)
      return
    this.uploading = true
    this.uploadProgress = 0
    let obs = this.api.addPicture(input.files[0], this.mediaOwner.code, this.targetType)
    obs.subscribe({
      next: (value) => {
        this.uploadProgress = value * 100
      },
      complete: () => {
        this.uploading = false
      },
      error: (e) => {
        this.errText = e.message ? e.message : e
        this.uploading = false
      }
    })
  }

  back() {
    history.back()
  }
}

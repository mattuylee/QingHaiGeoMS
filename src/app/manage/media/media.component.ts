import { Component, OnInit } from '@angular/core';
import { ApiService, BASE_URL } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { Relic, VideoInfo } from 'src/app/entities/Relic';
import { Knowledge } from 'src/app/entities/knowledge';
import { RelicResult, BaseResult, KnowledgeResult } from 'src/app/entities/Result';
import { Observable } from 'rxjs';
import { TargetType } from 'src/app/entities/enums';

declare let NativeObj

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
        this.media = this.mediaOwner.pictures
        if (this.media) {
          for (let i = 0; i < this.media.length; ++i)
            this.media[i] = BASE_URL + '/picture/' + this.media[i]
        }
      }
      else if (this.mediaType == 'video') {
        this.media = this.mediaOwner.videos
        if (this.media) {
          for (let i = 0; i < this.media.length; ++i) {
            if (this.media[i].poster) this.media[i].poster = BASE_URL + '/picture/' + this.media[i].poster
            this.media[i].video = BASE_URL + '/video/' + this.media[i].video
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
    console.log(this.draggingItemIndex, this.splitIndex)
    if (this.splitIndex == this.draggingItemIndex || this.splitIndex == this.draggingItemIndex + 1) {
      this.draggingItemIndex = -1
      this.splitIndex = this.orderArray.length  
      return
    }
    let newOrderArray = []
    for (let i = 0; i < this.orderArray.length; ++i) {
      if (i == this.draggingItemIndex)
        continue
      if (i == this.splitIndex){
        newOrderArray.push(this.orderArray[this.draggingItemIndex])
        newOrderArray.push(this.orderArray[i])
      }
      else if (this.splitIndex == this.orderArray.length && i == this.orderArray.length - 1){
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
        this.errText = res.error
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

  addMidea() {
    if (this.mediaType == 'picture')
      NativeObj.AddPicture(this.mediaOwner.code)
    else
      NativeObj.AddVideo(this.mediaOwner.code)
  }
}

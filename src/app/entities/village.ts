import { VideoInfo } from './Relic'
import { Location } from './location'

export class CultureVillage {
  code: string    //文化村编号
  name: string    //文化村名称
  location: Location  //经纬度（高程信息可能缺失）
  description: string //文化村相关介绍
  pictures: string[]  //相关图片
  videos: VideoInfo[] //相关视频
  likeCount: number   //被点赞数
  isFreezed: boolean  //是否被冻结
  recordTime: Date  //上传时间
}
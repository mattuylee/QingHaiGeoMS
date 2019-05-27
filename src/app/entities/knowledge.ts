import { CommentResult, BaseResult } from './Result';
import {Comment}from './comment'
import { VideoInfo } from './Relic';
/**
 * 地质科普
 */
export class Knowledge {
    public code:string//地质科普编码
    public name:string//地质科普名称
    public description:string//地质科普
    public pictures:string[]//图片
    public videos:VideoInfo[]//视频
    public likeCount:number//点赞数
    public isFreezed: boolean;
    public recordTime: Date;
    public recorder: string;
}
import { TargetType } from './enums';

export class Favorite{
    public code:string//收藏编号
    public type:TargetType//收藏目标类型
    public title:string;
    public description:string;
    public time:Date;
}
import { TargetType } from './enums';


export class Like{
    public code :string //被点赞对象编号
    public type:TargetType;//被点赞对象类型
    public title:string;//被点赞对象标题
    public description:string;//被点赞对象简介
    public time:Date;//点赞时间
}
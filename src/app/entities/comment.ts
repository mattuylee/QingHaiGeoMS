import { TargetType } from './enums';
import { User } from './User';
export class Comment {
    public code: string;//对象本身ID
    public user:User;
    public likeCount:number;
    public content:string;//评论内容
    public tagetType:TargetType;
    public targetCode:string;//目标ID
}

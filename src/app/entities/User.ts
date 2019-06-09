import { TargetType } from './enums';
import { Favorite } from './Favorite';
import { Like } from './Like';

export class User {
    public id: string;//用户识别码
    public nickName: string;//昵称
    public userName:string;//用户名
    public email: string;
    public password: string;
    public phone: string;
    public avatar: string;//用户头像url
    public isProfessional: boolean;
    public address: string;
    public weChat: string;
    public realName: string;//姓名
    public idCardNumber: string;
    public creditCount: number;
    public isAdmin: boolean;
    public isFreezed: boolean
    public isSuperAdmin: boolean;
}
import { TargetType, MessageType } from './enums';

export class Message{
    public title:string;
    public targetType:TargetType;
    public messageType:MessageType;
    public code: string;
    public sender:string;
    public unread:boolean;
    public time:Date;
}
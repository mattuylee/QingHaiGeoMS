import { User } from './User';

export class Answer {
    public code: string;
    public questionId:string;
    public answer: string;
    public user: User;
    public likeCount: number;
    public time: Date;
}
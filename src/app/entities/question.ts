import { AnswerResult } from './Result';
import { User } from './User';

export class Question {
    public code: string;
    public user: User;
    public likeCount: number;
    public question: string;
    public answerCount: number;
}
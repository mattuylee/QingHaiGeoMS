import { Comment } from './comment';
import { Knowledge } from './knowledge';
import { Like } from './Like';
import { Favorite } from './Favorite';
import { Relic } from './Relic';
import { RelicType } from './RelicType';
import { User } from './User';
import { Moment } from './moment';
import { Question } from './question';
import { Answer } from './answer';
import { Message } from './message';

export class BaseResult{
    public error:string;
}
export class RelicResult extends BaseResult{
    public relics:Relic[];
}
export class UserResult extends BaseResult{
    public user:User;
}
export class CommentResult extends BaseResult{
    public comments:Comment[];
}
export class KnowledgeResult extends BaseResult{
    public 	knowledges:Knowledge[];
}
export class LikeResult extends BaseResult{
    public likes:Like[];
}
export class FavoriteResult extends BaseResult{
    public favorites:Like[];
}
export class MomentResult extends BaseResult{
    public moments:Moment[];
}
export class QuestionResult extends BaseResult{
    public questions:Question[];
}
export class AnswerResult extends BaseResult{
    public answers: Answer[];
}
export class MessageResult extends BaseResult{
    public messages: Message[];
}
export class RelicTypesResult extends BaseResult{
    public relicTypes: RelicType[];
}
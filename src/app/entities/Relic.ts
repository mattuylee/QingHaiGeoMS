import { RelicType } from './RelicType';
import { Location } from './location';
import { CommentResult, BaseResult } from './Result';
import {Comment} from './comment';

export class Relic {
    public name: string;
    public description: string;
    public relicType: RelicType;
    public pictures: string[];
    public music: string;
    public videos: VideoInfo[];
    public likeCount: number;
    public code: string;
    public isFreezed: boolean;
    public location: Location;
    public recordTime: Date;
    public recorder: string;
}

export class VideoInfo {
    public poster: string;
    public video: string;
}


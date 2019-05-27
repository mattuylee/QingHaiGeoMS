/**
 * 目标类型
 */
export enum TargetType {
    /**遗迹 */
    'relic',
    /**地质科普 */
    'knowledge',
    /**随手拍 */
    'moment',
    /**回答 */
    'answer',
    /**问题 */
    'question',
}
/**
 * 消息类型
 */
export enum MessageType {
    'liked',
    'commented'
}
/**
 * 距离筛选枚举
 */
export enum DistanceType {
    '十公里以内',
    '二十公里以内',
    '五十公里以内',
    '一百公里以内',
    '二百公里以内',
}
/**
 * 热点筛选枚举
 */
export enum HotType {
    '周度热点',
    '月度热点',
    '年度热点',
}
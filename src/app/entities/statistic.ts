/** 遗迹/地质科普统计信息 */
export class StatisticData {
    number: number  //数量
    classify: ClassifiedStatisticData[]
}

export interface ClassifiedStatisticData {
    relicTypeCode: string, //遗迹类型编码
    relicTypeName: string,  //遗迹类型名称
    topRelicTypeCode: string,   //一级遗迹类型分类
    number: number, //该类型下的遗迹/地质科普数量
    thisTypePercent: number //该类型的遗迹/地质科普所占比例
}
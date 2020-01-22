import { Component, OnInit, ViewChild } from '@angular/core';
import { ECharts, EChartOption } from 'echarts';
import { ApiService } from '../api.service';
import { StatisticData } from '../entities/statistic';

const pieLabel = {
  normal: {
    show: true,
    position: 'center',
    fontSize: 16
  },
  emphasis: {
    show: true,
    position: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  }
}
const itemStyles: any[] = [
  {
    color: {
      type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{
        offset: 0.1, color: 'rgb(50, 85, 153)'
      }, {
        offset: 0.9, color: 'rgb(113, 213, 253)'
      }]
    }
  },
  {
    color: {
      type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{
        offset: 0.1, color: 'red'
      }, {
        offset: 0.9, color: 'pink'
      }]
    }
  },
  {
    color: {
      type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{
        offset: 0.1, color: 'yellow'
      }, {
        offset: 0.9, color: 'lightyellow'
      }]
    }
  }
]

@Component({
  selector: 'app-statistic-right',
  templateUrl: './statistic-right.component.html',
  styleUrls: ['./statistic-right.component.scss']
})
export class StatisticRightComponent implements OnInit {
  constructor(
    private api: ApiService
  ) { }

  qaData: StatisticData
  knowledgeData: StatisticData
  @ViewChild('pieGraph') private pieGraph: { nativeElement: HTMLDivElement }
  private chart: ECharts
  private option: EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: "{a}：{c}%"
    },
    legend: {
      show: false
    },
    series: []
  }

  async ngOnInit() {
    const data = await this.api.getStatisticData().toPromise()
    if (!data || !data.knowledge) { return }
    this.qaData = data.qa
    this.knowledgeData = data.knowledge
    this.option.series = []
    this.option.legend.data = []
    if (!data.knowledge.classify) { return }
    data.knowledge.classify.sort((a, b) => +a.relicTypeCode - +b.relicTypeCode)
    this.knowledgeData.classify.forEach((item, index) => {
      (this.option.legend.data as string[]).push(item.relicTypeName)
      this.option.series.push({
        type: 'pie',
        name: item.relicTypeName,
        radius: [20, 36],
        center: [50 + 92 * index, '45%'],
        label: pieLabel,
        itemStyle: itemStyles[index % itemStyles.length],
        data: [{ value: item.thisTypePercent * 100, name: String(item.number) }]
      })
    })
    //下一轮事件循环绘制，等待容器元素宽度更新
    setTimeout(() => {
      this.chart = echarts.init(this.pieGraph.nativeElement)
      this.chart.setOption(this.option)
    }, 0)
  }
}

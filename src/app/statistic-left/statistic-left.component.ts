import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { EChartOption, ECharts } from 'echarts';
import { StatisticData, ClassifiedStatisticData } from '../entities/statistic';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-statistic-left',
  templateUrl: './statistic-left.component.html',
  styleUrls: ['./statistic-left.component.scss']
})
export class StatisticLeftComponent implements OnInit {
  constructor(
    private api: ApiService
  ) { }

  momentData: StatisticData
  relicData: StatisticData
  @ViewChild('pieGraph') private pieGraph: { nativeElement: HTMLDivElement }
  private chart: ECharts
  private option: EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      top: '10%',
      right: 16,
      data: []
    },
    series: [
      {
        name: '遗迹点',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
            formatter: '100%',
            fontSize: 18,
            fontWeight: 'bold'
          },
          emphasis: {
            show: true,
            position: 'center',
            formatter: '{d}%'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: []
      }
    ]
  }

  ngOnInit() {
    this.chart = echarts.init(this.pieGraph.nativeElement)
    this.api.getStatisticData().toPromise().then(data => {
      if (!data || !data.relic) { return }
      this.option.legend.data = []
      this.option.series[0]['data'] = []
      this.relicData = data.relic
      this.momentData = data.moment
      if (!data.relic.classify) { return }
      data.relic.classify.sort((a, b) => a.relicTypeCode - b.relicTypeCode)
      data.relic.classify.forEach(i => {
        if (i.topRelicTypeCode) { return }
        (this.option.legend.data as any).push(i.relicTypeName)
        this.option.series[0]['data'].push({
          value: i.number,
          name: i.relicTypeName
        })
      })
      this.chart.setOption(this.option)
    })
  }
}

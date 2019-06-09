import { Component, OnInit } from '@angular/core';
import 'leaflet/dist/leaflet.js';
import 'leaflet.chinatmsproviders'
import { ApiService } from '../../api.service';
import { RelicResult } from '../../entities/Result';
import { Relic } from '../../entities/Relic';
import { Router } from '@angular/router';
declare let L;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  private map

  ngOnInit() {
    var Gaode = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
      maxZoom: 18,
      minZoom: 5
    });
    var Gaodimgem = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
      maxZoom: 18,
      minZoom: 5
    });
    var Gaodimga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
      maxZoom: 18,
      minZoom: 5
    });
    var Gaodimage = L.layerGroup([Gaodimgem, Gaodimga]);

    var baseLayers = {
      "地图": Gaode,
      "影像": Gaodimage,
    }

    this.map = L.map("mapDiv", {
      center: [35.85, 96.35],
      zoom: 7,
      layers: [Gaode],
      zoomControl: false
    });

    L.control.layers(baseLayers, null).addTo(this.map);
    L.control.zoom({
      zoomInTitle: '放大',
      zoomOutTitle: '缩小',
      position: 'bottomright'
    }).addTo(this.map);

    this.loadRelics(1)

    this.map.on('click', (e) => {
      console.log(e)
    })
  }

  //递归加载遗迹
  loadRelics(page: number) {
    let popup = L.popup({ maxWidth: 600 })
    this.api.getRelics(page, 3).subscribe((res: RelicResult) => {
      if (res.error) {
        alert(res.error)
        return
      }
      if (!res.relics || !res.relics.length)
        return
      res.relics.forEach((i: Relic) => {
        let marker = L.marker([i.location.latitude, i.location.longitude]).addTo(this.map);
        marker.on('click', () => {
          popup.setLatLng([i.location.latitude, i.location.longitude]).setContent(`
          <div class="container-fluid">
            <div class="row-fluid">
            	<div class="span12">
            		<div class="hero-unit">
            			<h1><a id="t-${i.code}">${i.name}</a></h1>
            			<p>
            				<h5>${'　　' + (i.description.length > 144 ? i.description.slice(0, 144) + '......' : i.description)}<h5>
            			</p>
                   <a id="s-${i.code}" class="btn btn-default btn-large">查看详情</a>
                   <br/>
                   <br/>
            		</div>
                 <table class="table">
                   <tbody>
                   <tr><th><big>名称</big></th><th><big>${i.name}</big></th></tr>
            				<tr><th><big>编号</big></th><th><big>${i.code}</big></th></tr>
                     <tr><th><big>位置</big></th><th><big>${i.location.latitude.toFixed(3)}N,　${i.location.longitude.toFixed(3)}E</big></th></tr>
            				<tr><th><big>遗迹类型</big></th><th><big>${i.relicType.category}</big></th></tr>
                     <tr><th><big>类型代码</big></th><th><big>${i.relicType.code}</big></th></tr>
                   </tbody>
            		</table>
            	</div>
            </div>
          </div>
          `).openOn(this.map)
          let clickCallback = () => {
            this.router.navigateByUrl('/manage/relic/' + i.code)
          }
          document.getElementById('t-' + i.code).addEventListener('click', clickCallback)
          document.getElementById('s-' + i.code).addEventListener('click', clickCallback)
        })
      })
      this.loadRelics(page + 1)
    })
  }

  goto(url: string) {
    this.router.navigateByUrl(url)
  }
}

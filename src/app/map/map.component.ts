import { Component, OnInit } from '@angular/core';
import 'leaflet/dist/leaflet.js';
import 'leaflet.chinatmsproviders'
import { ApiService } from '../api.service';
import { RelicResult } from '../entities/Result';
import { Relic } from '../entities/Relic';
import { Router } from '@angular/router';
import { ManageService } from '../shared/manage.service';
declare let L;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    private router: Router,
    private api: ApiService,
    private manageService: ManageService
  ) { }

  private map
  private popup

  ngOnInit() {
    var Gaode = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
      maxZoom: 18,
      minZoom: 5
    });

    this.map = L.map("mapDiv", {
      center: [35.85, 96.35],
      zoom: 7,
      layers: [Gaode],
      zoomControl: false
    });

    L.control.zoom({
      zoomInTitle: '放大',
      zoomOutTitle: '缩小',
      position: 'bottomright'
    }).addTo(this.map);
    this.popup = L.popup({ maxWidth: 600 })
    this.manageService.onRelicItemFocus.subscribe((relic: Relic) => {
      if (relic.location && relic.location.latitude && relic.location.longitude) {
        this.map.panTo(L.latLng(relic.location.latitude, relic.location.longitude), {
          duration: 0.35
        })
        const zoom = this.map.getZoom()
        if (zoom != 8) { this.map.zoomIn(8 - zoom) }
        setTimeout(() => {
          this.showPopup(relic)
        }, 500)
      }
    })
    this.loadRelics(1)
  }

  //递归加载遗迹
  loadRelics(page: number) {
    this.api.getRelics(page, 3).subscribe((res: RelicResult) => {
      if (res.error) {
        alert(res.error)
        return
      }
      if (!res.relics || !res.relics.length)
        return
      res.relics.forEach((i: Relic) => {
        let marker = L.marker([i.location.latitude, i.location.longitude]).addTo(this.map);
        marker.on('click', () => this.showPopup(i))
      })
      this.loadRelics(page + 1)
    })
  }

  showPopup(relic: Relic) {
    this.popup.setLatLng([relic.location.latitude, relic.location.longitude]).setContent(`
          <div class="container-fluid">
            <div class="row-fluid">
            	<div class="span12">
            		<div class="hero-unit">
            			<h1><a id="t-${relic.code}">${relic.name}</a></h1>
            			<p>
            				<h5>${'　　' + (relic.description.length > 144 ? relic.description.slice(0, 144) + '......' : relic.description)}<h5>
            			</p>
                   <a id="icon-to-relic-detail-${relic.code}" class="btn btn-default btn-large">查看详情</a>
                   <br/>
                   <br/>
            		</div>
                 <table class="table">
                   <tbody>
                   <tr><th><big>名称</big></th><th><big>${relic.name}</big></th></tr>
            				<tr><th><big>编号</big></th><th><big>${relic.code}</big></th></tr>
                     <tr><th><big>位置</big></th><th><big>${relic.location.latitude.toFixed(3)}N,　${relic.location.longitude.toFixed(3)}E</big></th></tr>
            				<tr><th><big>遗迹类型</big></th><th><big>${relic.relicType.category}</big></th></tr>
                     <tr><th><big>类型代码</big></th><th><big>${relic.relicType.code}</big></th></tr>
                   </tbody>
            		</table>
            	</div>
            </div>
          </div>
          `).openOn(this.map)
    this.manageService.navigationFolded = true
    document.getElementById('icon-to-relic-detail-' + relic.code).addEventListener('click', () => {
      this.router.navigate(['/relic', relic.code])
    })
  }

  goto(url: string) {
    this.router.navigateByUrl(url)
  }
}

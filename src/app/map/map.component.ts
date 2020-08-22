import { Component, OnInit } from '@angular/core';
import 'leaflet/dist/leaflet.js';
import 'leaflet.chinatmsproviders'
import { ApiService } from '../api.service';
import { RelicResult } from '../entities/Result';
import { Relic } from '../entities/Relic';
import { Router } from '@angular/router';
import { ManageService } from '../shared/manage.service';
import { CultureVillage } from '../entities/village';
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
        if (zoom != 10) { this.map.zoomIn(10 - zoom) }
        setTimeout(() => {
          this.showPopup(relic)
        }, 500)
      }
    })
    this.manageService.onVillageItemFocus.subscribe((village: CultureVillage) => {
      if (village.location && village.location.latitude && village.location.longitude) {
        this.map.panTo(L.latLng(village.location.latitude, village.location.longitude), {
          duration: 0.35
        })
        const zoom = this.map.getZoom()
        if (zoom != 10) { this.map.zoomIn(10 - zoom) }
        setTimeout(() => {
          this.showVillagePopup(village)
        }, 500)
      }
    })
    this.loadRelics(1)
    this.loadVillages()
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
        let marker = L.marker([
          i.location.latitude,
          i.location.longitude
        ], {
          icon: L.icon({
            iconUrl: 'assets/marker/marker-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 12],
            shadowUrl: 'assets/marker/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 12]
          })
        }).addTo(this.map);
        marker.on('click', () => this.showPopup(i))
      })
      this.loadRelics(page + 1)
    })
  }
  loadVillages() {
    this.api.getCultureVillages().toPromise().then(res => {
      const villages = (res && res.results) || [];
      for (const village of villages) {
        let marker = L.marker([
          village.location.latitude,
          village.location.longitude
        ], {
          icon: L.icon({
            iconUrl: 'assets/marker/marker-red.png',
            iconSize: [48, 48],
            iconAnchor: [12, 12],
            shadowUrl: 'assets/marker/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 12]
          }),
        }).addTo(this.map);
        marker.on('click', () => this.showVillagePopup(village))
      }
    });
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
  showVillagePopup(village: CultureVillage) {
    this.popup.setLatLng([village.location.latitude, village.location.longitude]).setContent(`
          <div class="container-fluid">
            <div class="row-fluid">
            	<div class="span12">
            		<div class="hero-unit">
            			<h1><a id="t-${village.code}">${village.name}</a></h1>
            			<p>
            				<h5>${'　　' + (village.description.length > 144 ? village.description.slice(0, 144) + '......' : village.description)}<h5>
            			</p>
                   <a id="icon-to-village-detail-${village.code}" class="btn btn-default btn-large">查看详情</a>
                   <br/>
                   <br/>
            		</div>
                 <table class="table">
                   <tbody>
                   <tr><th><big>名称</big></th><th><big>${village.name}</big></th></tr>
            				<tr><th><big>编号</big></th><th><big>${village.code}</big></th></tr>
                     <tr><th><big>位置</big></th><th><big>${village.location.latitude.toFixed(3)}N,　${village.location.longitude.toFixed(3)}E</big></th></tr>
                   </tbody>
            		</table>
            	</div>
            </div>
          </div>
          `).openOn(this.map)
    this.manageService.navigationFolded = true
    document.getElementById('icon-to-village-detail-' + village.code).addEventListener('click', () => {
      this.router.navigate(['/village', village.code])
    })
  }

  goto(url: string) {
    this.router.navigateByUrl(url)
  }
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map/map.component'
import { RelicDetailComponent } from './manage/relic-detail/relic-detail.component';
import { RelicComponent } from './manage/relic/relic.component';
import { MediaComponent } from './manage/media/media.component';

const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'manage', redirectTo: 'manage/relic', pathMatch: 'full'},
  { path: 'manage/relic', component: RelicComponent },
  { path: 'manage/relic/:code', component: RelicDetailComponent },
  { path: 'manage/media/:code', component: MediaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

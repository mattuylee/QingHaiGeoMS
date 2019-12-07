import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component'
import { RelicDetailComponent } from './manage/relic-detail/relic-detail.component';
import { RelicComponent } from './manage/relic/relic.component';
import { MediaComponent } from './manage/media/media.component';
import { KnowledgeComponent } from './manage/knowledge/knowledge.component';
import { KnowledgeDetailComponent } from './manage/knowledge-detail/knowledge-detail.component';
import { CommentComponent } from './manage/comment/comment.component';
import { UserComponent } from './manage/user/user.component';
import { StatisticLeftComponent } from './statistic-left/statistic-left.component';

const routes: Routes = [
  { path: '', component: StatisticLeftComponent },
  { path: 'map', component: MapComponent },
  { path: 'manage', redirectTo: 'manage/relic', pathMatch: 'full' },
  { path: 'manage/relic', component: RelicComponent },
  { path: 'manage/relic/:code', component: RelicDetailComponent },
  { path: 'manage/knowledge', component: KnowledgeComponent },
  { path: 'manage/knowledge/:code', component: KnowledgeDetailComponent },
  { path: 'manage/comment/:code', component: CommentComponent },
  { path: 'manage/media/:code', component: MediaComponent },
  { path: 'manage/user', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

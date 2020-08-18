import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticLeftComponent } from './statistic-left/statistic-left.component';
import { ManageComponent } from './manage/manage.component';
import { RelicComponent } from './manage/relic/relic.component';
import { KnowledgeComponent } from './manage/knowledge/knowledge.component';
import { MomentComponent } from './manage/moment/moment.component';
import { QaComponent } from './manage/qa/qa.component';
import { UserComponent } from './manage/user/user.component';
import { RelicDetailComponent } from './manage/relic-detail/relic-detail.component';
import { CommentComponent } from './manage/comment/comment.component';
import { MediaComponent } from './manage/media/media.component';
import { KnowledgeDetailComponent } from './manage/knowledge-detail/knowledge-detail.component';
import { MomentDetailComponent } from './manage/moment-detail/moment-detail.component';
import { CultureVillageComponent } from './manage/culture-village/village.component';
import { CultureVillageDetailComponent } from './manage/culture-village-detail/village-detail.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'manage' },
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      { path: '', component: StatisticLeftComponent },
      { path: 'relic', component: RelicComponent },
      { path: 'knowledge', component: KnowledgeComponent },
      { path: 'village', component: CultureVillageComponent },
      { path: 'moment', component: MomentComponent },
      { path: 'qa', component: QaComponent },
      { path: 'user', component: UserComponent },
    ]
  },
  { path: 'relic', pathMatch: 'full', redirectTo: 'manage/relic' },
  { path: 'relic/:code', component: RelicDetailComponent },
  { path: 'relic/:code', component: RelicDetailComponent },
  { path: 'knowledge/:code', component: KnowledgeDetailComponent },
  { path: 'village/:code', component: CultureVillageDetailComponent },
  { path: 'moment/:code', component: MomentDetailComponent },
  { path: 'comment/:code', component: CommentComponent },
  { path: 'media/:code', component: MediaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

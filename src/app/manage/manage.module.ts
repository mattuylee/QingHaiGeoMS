import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelicComponent } from './relic/relic.component';
import { RelicDetailComponent } from './relic-detail/relic-detail.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { MediaComponent } from './media/media.component';
import { KnowledgeDetailComponent } from './knowledge-detail/knowledge-detail.component';
import { CommentComponent } from './comment/comment.component';
import { UserComponent } from './user/user.component';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage.component';
import { SharedModule } from '../shared/shared.module';
import { RouteGuard } from './route.guard';
import { PaginationComponent } from './pagination/pagination.component';
import { TableWrapperComponent } from './table-wrapper/table-wrapper.component';
import { MomentComponent } from './moment/moment.component';
import { QaComponent } from './qa/qa.component';

const routes: Routes = [
  {
    path: '',
    component: ManageComponent,
    canActivateChild: [RouteGuard],
    children: [
      { path: 'relic', component: RelicComponent },
      { path: 'relic/:code', component: RelicDetailComponent },
      { path: 'knowledge', component: KnowledgeComponent },
      { path: 'knowledge/:code', component: KnowledgeDetailComponent },
      { path: 'moment', component: MomentComponent },
      { path: 'qa', component: QaComponent },
      { path: 'user', component: UserComponent },
      { path: 'media/:code', component: MediaComponent },
    ]
  },
]


@NgModule({
  declarations: [
    CommentComponent,
    KnowledgeComponent,
    KnowledgeDetailComponent,
    ListComponent,
    ManageComponent,
    MediaComponent,
    RelicComponent,
    RelicDetailComponent,
    UserComponent,
    PaginationComponent,
    TableWrapperComponent,
    MomentComponent,
    QaComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    SharedModule
  ]
})
export class ManageModule { }

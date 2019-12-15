import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelicComponent } from './relic/relic.component';
import { HeaderComponent } from './header/header.component';
import { RelicDetailComponent } from './relic-detail/relic-detail.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { MediaComponent } from './media/media.component';
import { KnowledgeDetailComponent } from './knowledge-detail/knowledge-detail.component';
import { CommentComponent } from './comment/comment.component';
import { UserComponent } from './user/user.component';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  
  { path: 'relic', component: RelicComponent },
  { path: 'relic/:code', component: RelicDetailComponent },
  { path: 'knowledge', component: KnowledgeComponent },
  { path: 'knowledge/:code', component: KnowledgeDetailComponent },
  { path: 'comment/:code', component: CommentComponent },
  { path: 'media/:code', component: MediaComponent },
  { path: 'user', component: UserComponent }
];


@NgModule({
  declarations: [
    HeaderComponent,
    RelicComponent,
    RelicDetailComponent,
    KnowledgeComponent,
    MediaComponent,
    KnowledgeDetailComponent,
    CommentComponent,
    UserComponent,
    ListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    RouterModule,
    CommonModule,
    FormsModule
  ]
})
export class ManageModule { }

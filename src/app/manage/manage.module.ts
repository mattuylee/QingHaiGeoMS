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
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    HeaderComponent,
    RelicComponent,
    RelicDetailComponent,
    KnowledgeComponent,
    MediaComponent,
    KnowledgeDetailComponent,
    CommentComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,
    FormsModule
  ]
})
export class ManageModule { }

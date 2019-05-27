import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelicComponent } from './relic/relic.component';
import { HeaderComponent } from './header/header.component';
import { RelicDetailComponent } from './relic-detail/relic-detail.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { MediaComponent } from './media/media.component';


@NgModule({
  declarations: [
    HeaderComponent,
    RelicComponent,
    RelicDetailComponent,
    KnowledgeComponent,
    MediaComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ManageModule { }

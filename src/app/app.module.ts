import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { StatisticLeftComponent } from './statistic-left/statistic-left.component';
import { StatisticRightComponent } from './statistic-right/statistic-right.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { CommentComponent } from './manage/comment/comment.component';
import { KnowledgeComponent } from './manage/knowledge/knowledge.component';
import { KnowledgeDetailComponent } from './manage/knowledge-detail/knowledge-detail.component';
import { ListComponent } from './manage/list/list.component';
import { ManageComponent } from './manage/manage.component';
import { MediaComponent } from './manage/media/media.component';
import { RelicComponent } from './manage/relic/relic.component';
import { RelicDetailComponent } from './manage/relic-detail/relic-detail.component';
import { UserComponent } from './manage/user/user.component';
import { PaginationComponent } from './manage/pagination/pagination.component';
import { TableWrapperComponent } from './manage/table-wrapper/table-wrapper.component';
import { MomentComponent } from './manage/moment/moment.component';
import { QaComponent } from './manage/qa/qa.component';
import { MomentDetailComponent } from './manage/moment-detail/moment-detail.component';
import { CultureVillageComponent } from './manage/culture-village/village.component';
import { CultureVillageDetailComponent } from './manage/culture-village-detail/village-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CommentComponent,
    KnowledgeComponent,
    KnowledgeDetailComponent,
    CultureVillageComponent,
    CultureVillageDetailComponent,
    ListComponent,
    ManageComponent,
    MapComponent,
    MediaComponent,
    MomentComponent,
    PaginationComponent,
    QaComponent,
    RelicComponent,
    RelicDetailComponent,
    StatisticLeftComponent,
    StatisticRightComponent,
    TableWrapperComponent,
    UserComponent,
    MomentDetailComponent,
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

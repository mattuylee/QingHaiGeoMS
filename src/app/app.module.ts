import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ManageModule } from './manage/manage.module';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { StatisticLeftComponent } from './statistic-left/statistic-left.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StatisticLeftComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    ManageModule
  ],
  providers: [
    //{ provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

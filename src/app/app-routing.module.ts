import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticLeftComponent } from './statistic-left/statistic-left.component';
import { ManageModule } from './manage/manage.module';

const routes: Routes = [
  { path: '', component: StatisticLeftComponent },
  { path: 'manage', loadChildren: () => ManageModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

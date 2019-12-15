import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'relic'
  }
]

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule
  ]
})
export class ListModule { }

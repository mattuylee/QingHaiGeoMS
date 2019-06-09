import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MapComponent],
  imports: [
    RouterModule,
    CommonModule
  ]
})
export class MapModule { }

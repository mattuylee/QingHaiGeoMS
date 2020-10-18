import { NgModule } from '@angular/core';
import { IdToNamePipe } from './id-to-name.pipe';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IdToNamePipe,
    TitlebarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormsModule,
    IdToNamePipe,
    TitlebarComponent
  ]
})
export class SharedModule { }

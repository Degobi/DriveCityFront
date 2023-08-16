import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HistoricoComponent } from './historico.component';

@NgModule({
  declarations: [
    HistoricoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    HistoricoComponent
  ]
})
export class HistoricoComponentModule { }

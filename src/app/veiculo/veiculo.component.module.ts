import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VeiculoComponent } from './veiculo.component';

@NgModule({
  declarations: [
    VeiculoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    VeiculoComponent
  ]
})
export class VeiculoComponentModule { }

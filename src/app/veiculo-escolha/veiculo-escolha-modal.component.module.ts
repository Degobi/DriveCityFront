import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { VeiculoEscolhaModalComponent } from './veiculo-escolha-modal.component';

@NgModule({
  declarations: [
    VeiculoEscolhaModalComponent,
  ],
  providers: [
    InAppBrowser
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    VeiculoEscolhaModalComponent
  ]
})
export class VeiculoEscolhaModalComponentModule { }

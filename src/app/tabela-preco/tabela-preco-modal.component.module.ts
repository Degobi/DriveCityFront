import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { TabelaPrecoModalComponent } from './tabela-preco-modal.component';

@NgModule({
  declarations: [
    TabelaPrecoModalComponent,
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
    TabelaPrecoModalComponent
  ]
})
export class TabelaPrecoModalComponentModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEnterprisePageRoutingModule } from './modal-enterprise-routing.module';

import { ModalEnterprisePage } from './modal-enterprise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEnterprisePageRoutingModule
  ],
  declarations: [ModalEnterprisePage]
})
export class ModalEnterprisePageModule {}

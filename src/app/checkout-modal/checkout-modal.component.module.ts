import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CheckoutModalComponent } from './checkout-modal.component';

@NgModule({
  declarations: [
    CheckoutModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    CheckoutModalComponent
  ]
})
export class CheckoutModalComponentModule { }

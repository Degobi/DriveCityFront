import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-checkout-modal',
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.scss'],
})

export class CheckoutModalComponent  implements OnInit {

  constructor(
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private navParams: NavParams,)
    {

    }

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
  
}

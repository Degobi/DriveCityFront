import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Empresa } from 'src/interfaces/empresa.interface';

@Component({
  selector: 'app-tabela-preco-modal',
  templateUrl: './tabela-preco-modal.component.html',
  styleUrls: ['./tabela-preco-modal.component.scss'],
})

export class TabelaPrecoModalComponent  implements OnInit {
  empresa: Empresa;
  tabelaPrecos: Array<any>;

  constructor(
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private navParams: NavParams,)
    {
      this.empresa = this.navParams.get('empresa');
      this.tabelaPrecos = this.empresa.tabelaPrecos

      console.log("tabela preços", this.tabelaPrecos)
    }

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
  
}

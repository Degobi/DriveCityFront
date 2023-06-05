import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Empresa } from 'src/interfaces/empresa.interface';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tabela-preco-modal',
  templateUrl: './tabela-preco-modal.component.html',
  styleUrls: ['./tabela-preco-modal.component.scss'],
})

export class TabelaPrecoModalComponent implements OnInit {
  empresa: Empresa;
  tabelaPrecos: Array<any>;
  servicoSelecionado: any;
  disabledCheckbox: boolean;

  constructor(
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private inAppBrowser: InAppBrowser
  ) {
    this.empresa = this.navParams.get('empresa');
    this.tabelaPrecos = this.empresa.tabelaPrecos;
    this.disabledCheckbox = false;
  }

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  selecionarServico(indice: number) {
    if (this.servicoSelecionado === this.tabelaPrecos[indice]) {
      this.servicoSelecionado = null;
      this.tabelaPrecos.forEach((tabela) => {
        tabela.disabled = false;
      });
    } else {
      this.servicoSelecionado = this.tabelaPrecos[indice];
      this.tabelaPrecos.forEach((tabela, i) => {
        tabela.disabled = i !== indice;
      });
    }
  }
  
  
  realizarPagamento() {

    if (this.servicoSelecionado) {
      const urlCheckout = `https://buy.stripe.com/test_3cs3eF5h6h0XgbC000`;

      // const options = {
      //   location: 'yes',
      //   hidden: 'no',
      //   clearcache: 'yes',
      //   clearsessioncache: 'yes',
      //   zoom: 'yes',
      //   hardwareback: 'yes',
      //   mediaPlaybackRequiresUserAction: 'no',
      //   shouldPauseOnSuspend: 'no',
      //   closebuttoncaption: 'Fechar',
      //   disallowoverscroll: 'no',
      //   toolbar: 'yes',
      //   enableViewportScale: 'no',
      //   allowInlineMediaPlayback: 'no',
      //   presentationstyle: 'pagesheet',
      //   fullscreen: 'yes'
      // };
    
      const browser = this.inAppBrowser.create(urlCheckout, '_blank');
    
      browser.on('exit').subscribe(() => {
        // Lógica a ser executada quando o usuário sair da tela de checkout
      });

    } else {
      this.presentToast('Nenhum serviço selecionado', 'warning');
    }
  }

  async presentToast(message: string, style: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: style
    });
    toast.present();
  }
}

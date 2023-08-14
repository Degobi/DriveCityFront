import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiService } from '../services/api.service';
import { Veiculo } from 'src/interfaces/veiculo.interface';

@Component({
  selector: 'app-veiculo-escolha-modal',
  templateUrl: './veiculo-escolha-modal.component.html',
  styleUrls: ['./veiculo-escolha-modal.component.scss'],
})

export class VeiculoEscolhaModalComponent implements OnInit {
  veiculos: Array<Veiculo>;
  veiculoSelecionado: any;
  disabledCheckbox: boolean;
  valorServico: number;

  constructor(
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private inAppBrowser: InAppBrowser,
    private apiService: ApiService
  ) {
    this.veiculos     = this.navParams.get('veiculos');
    this.valorServico = this.navParams.get('valorServico');
  }

  ngOnInit() {
    this.veiculos.forEach((tabela) => {
      tabela.disabled = false;
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  selecionarVeiculo(indice: number) {
    if (this.veiculoSelecionado === this.veiculos[indice]) {
      this.veiculoSelecionado = null;
      this.veiculos.forEach((tabela) => {
        tabela.disabled = false;
      });
    } else {
      this.veiculoSelecionado = this.veiculos[indice];
      this.veiculos.forEach((tabela, i) => {
        tabela.disabled = i !== indice;
      });
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

  async pagar() {

    if (this.veiculoSelecionado) {

      const valorDoServico = this.valorServico;
      const descricaoDoServico = 'Descrição do Serviço';
      const publicKeyDoMercadoPago = 'TEST-c5185e79-b72c-4c77-9a79-7a53d7715583';
      
      const urlDePagamento = `http://mpago.la/2na2mxr`;
      
      const browser = this.inAppBrowser.create(urlDePagamento, '_blank');
      
      browser.on('loadstop').subscribe(event => {
        if (event.url.includes('URL_DE_RETORNO_DO_PAGAMENTO')) {
          this.modalCtrl.dismiss();
          browser.close();
        }
      });
      this.modalCtrl.dismiss();

    } else {
      this.presentToast('Selecione ao menos um veículo para prosseguir!', 'warning');
    }

  }

  criarPreferenciaDePagamento(valor: number, descricao: string) {

    const preferencia = {
      items: [
        {
          title: descricao,
          quantity: 1,
          unit_price: valor,
        },
      ],
    };

    return 'ID_DA_PREFERENCIA';
  }

}

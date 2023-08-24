import { Component, OnInit, Renderer2 } from '@angular/core';
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
  servico: any;
  idPreference: any;
  
  constructor(
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private inAppBrowser: InAppBrowser,
    private apiService: ApiService,
    private renderer: Renderer2
  ) {
    this.veiculos     = this.navParams.get('veiculos');
    this.servico      = this.navParams.get('valorServico');

    let dados = {
      UnitPrice: this.servico.valorServico,
      Title: this.servico.descricaoServico
    }

    this.apiService.gerarLinkPagamento(dados).subscribe({
      next: (response: any) => {
        this.idPreference = response.value;
      },
      error: error => {
      }
    });
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

  pagar() {

    if (this.veiculoSelecionado) {
      const urlDePagamento = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${this.idPreference}`;
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

}

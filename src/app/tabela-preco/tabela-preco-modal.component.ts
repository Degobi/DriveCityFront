import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Empresa } from 'src/interfaces/empresa.interface';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiService } from '../services/api.service';
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
    private inAppBrowser: InAppBrowser,
    private apiService: ApiService
  ) {
    this.empresa = this.navParams.get('empresa');
    this.tabelaPrecos = this.empresa.tabelaPrecos;
    this.disabledCheckbox = false;
  }

  ngOnInit() {}

  closeModal() {
    this.tabelaPrecos.forEach((tabela, i) => {
      tabela.disabled = false;
    });

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

    // if (this.servicoSelecionado) {
    //   const dadosPagamento = {
    //     valor: this.servicoSelecionado.valorServico,
    //     descricao: this.servicoSelecionado.descricaoServico,
    //     // Outros dados necessários para o pagamento, como nome do comprador, email, etc.
    //   };
  
    //   // Chamar a API do PagSeguro para criar uma transação de pagamento e obter o link de pagamento
    //   this.pagSeguroService.criarTransacao(dadosPagamento).subscribe(
    //     (resposta) => {
    //       const linkPagamento = resposta.linkPagamento;
    //       // Redirecionar o usuário para o link de pagamento
    //       window.location.href = linkPagamento;
    //     },
    //     (erro) => {
    //       this.presentToast('Erro ao processar pagamento', 'danger');
    //     }
    //   );
    // } else {
    //   this.presentToast('Nenhum serviço selecionado', 'warning');
    // }

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

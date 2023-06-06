import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

enum TipoVeiculo {
  Moto = 'Moto',
  Carro = 'Carro',
  Caminhonete = 'Caminhonete',
  Caminhao = 'Caminhão',
}
@Component({
  selector: 'app-veiculo',
  templateUrl: './veiculo.component.html',
  styleUrls: ['./veiculo.component.scss'],
})

export class VeiculoComponent implements OnInit {
  placa: string;
  tipoVeiculoSelecionado: TipoVeiculo;
  tiposVeiculo: string[];
  userId: number;
  isCadastro: boolean

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private navParams: NavParams,
    private modalCtrl: ModalController) 
  {
    this.placa = "Sua Placa";
    this.tiposVeiculo = Object.values(TipoVeiculo);
    this.userId = this.navParams.get('userId');
    this.isCadastro = this.navParams.get('cadastro')

  }

  ngOnInit() {}

  async cadastrarVeiculo() {

    if (!this.placa || this.placa.length <= 0) {
      await this.exibirToast('Informe a placa do veículo', 'warning');
      return;
    }

    if (!this.tipoVeiculoSelecionado) {
      await this.exibirToast('Selecione o tipo de veículo', 'warning');
      return;
    }

    var modelo = {Tipo: this.tipoVeiculoSelecionado, Placa: this.placa, UsuarioId: this.userId}

    this.apiService.postVeiculo(modelo).subscribe({
      next: response => {
        this.modalCtrl.dismiss();
        this.exibirToast('Veículo cadastrado com sucesso', 'success');
      },
      error: error => {
      }
    });

  }

  async exibirToast(mensagem: string, estilo) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'bottom',
      color: estilo
    });
  
    toast.present();
  }

}

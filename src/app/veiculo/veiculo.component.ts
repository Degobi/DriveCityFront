import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Veiculo } from 'src/interfaces/veiculo.interface';

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
  veiculos: Array<Veiculo>
  showOptions: boolean[] = [];

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private router: Router,) 
  {
    this.placa        = "Sua Placa";
    this.tiposVeiculo = Object.values(TipoVeiculo);
    this.userId       = this.navParams.get('userId');
    this.isCadastro   = this.navParams.get('cadastro')

  }

  ngOnInit() {
    this.apiService.getVeiculo(this.userId).subscribe({
      next: response => {
        this.veiculos = response as Veiculo[];
      },
      error: error => {
      }
    });

    this.veiculos.forEach(() => {
      this.showOptions.push(false);
    });
  }

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

  goToBack() : void {
    this.modalCtrl.dismiss();
  }

  openOptions(index: number) {
    // Alterne o estado de exibição das opções para o índice especificado
    this.showOptions[index] = !this.showOptions[index];
    
    // Feche as opções de outras linhas
    for (let i = 0; i < this.showOptions.length; i++) {
      if (i !== index) {
        this.showOptions[i] = false;
      }
    }
  }

  closeOptions() {
    this.showOptions.fill(false);
  }
}

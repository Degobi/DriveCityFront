import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Veiculo } from 'src/interfaces/veiculo.interface';


@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
})

export class HistoricoComponent implements OnInit {
  placa: string;
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


  }

  ngOnInit() {

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

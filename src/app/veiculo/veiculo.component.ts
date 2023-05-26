import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-veiculo',
  templateUrl: './veiculo.component.html',
  styleUrls: ['./veiculo.component.scss'],
})
export class VeiculoComponent implements OnInit {
  placa: string;

  constructor() {
    this.placa = "Sua Placa";

  }

  ngOnInit() {

  }

  cadastrarVeiculo() {

    if (!this.placa || this.placa.length <= 0) {
      
    }
    console.log(this.placa);
    // lógica para salvar o veículo cadastrado
  }


}

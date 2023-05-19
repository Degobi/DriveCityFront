import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-veiculo',
  templateUrl: './veiculo.component.html',
  styleUrls: ['./veiculo.component.scss'],
})
export class VeiculoComponent implements OnInit {
  placa: string = '';
  xOffset: number = 0;
  isTouchIn: boolean = false;

  constructor() {}

  ngOnInit() {

    const slides: HTMLElement | null = document.getElementById("slides");

    setInterval(() => {
      this.translate();
    }, 0);

    this.translate();

    if (slides) {
      slides.addEventListener("touchstart", () => {
        this.isTouchIn = true;
      });

      slides.addEventListener("touchend", () => {
        this.isTouchIn = false;
      });
    }
  }

  cadastrarVeiculo() {
    console.log(this.placa);
    // lógica para salvar o veículo cadastrado
  }

  translate(): void {
    let offsetIncrementor: number = this.isTouchIn ? 0.05 : 0.2;
    if (this.xOffset >= 258 * 7) {
      this.xOffset = 0;
    } else {
      this.xOffset = this.xOffset + offsetIncrementor;
    }
    const slides: HTMLElement | null = document.getElementById("slides");
    if (slides) {
      slides.style.transform = "translateX(-" + this.xOffset + "px)";
    }
  }

}

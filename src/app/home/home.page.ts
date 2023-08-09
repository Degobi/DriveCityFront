import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Empresa } from 'src/interfaces/empresa.interface';
import { VeiculoComponent } from '../veiculo/veiculo.component';
import { User } from 'src/interfaces/user.interface';
import { TabelaPrecoModalComponent } from '../tabela-preco/tabela-preco-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map') mapContainer: ElementRef;
  map: mapboxgl.Map;
  lat: number;
  lng: number;
  empresas: Array<Empresa>;
  usuario: User;
  distanceInKm: number;
  cost: number;

  constructor(
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private apiService: ApiService) {
      this.getEmpresas()
      const userSessionStorage = this.apiService.currentUserValue;
      this.getUsuario(userSessionStorage)
    }

  ngOnInit(): void { }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.initializeMap();

      if (this.usuario?.veiculo.length == 0) this.exibirModalVeiculo(true);
    });
  }

  async exibirModalVeiculo(boolCadastro) {
    const modal = await this.modalCtrl.create({
      component: VeiculoComponent,
      cssClass: 'meu-modal-classe',
      keyboardClose: false,
      backdropDismiss: false,
      componentProps: {
        userId: this.usuario.id,
        cadastro: boolCadastro,
      },
    });

    await modal.present();
  }

  async initializeMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: 12.5,
      accessToken: environment.mapboxToken, // Definir o token aqui
    });
  
    this.userLocation();
    this.addEmpresas();
  }

  async addEmpresas() {
    this.empresas.forEach((e) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([Number(e.lng), Number(e.lat)])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${e.nome}</h3><p>${e.descricao}</p>`))
        .addTo(this.map);
    });
  }

  async userLocation() {
    const userMarker = new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Sua Localização</h3>'))
      .addTo(this.map);
  }

  destinationOnMap(empresa: any) {
    // Crie o mapa
    const map = new mapboxgl.Map({
      accessToken: environment.mapboxToken,
      container: document.getElementById('map'),
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: 10,
    });
  
    // Adicione a marca de destino
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat([empresa.lng, empresa.lat])
      .addTo(map);
  
    // Adicione a marca de origem
    new mapboxgl.Marker({ color: 'blue' })
      .setLngLat([this.lng, this.lat])
      .addTo(map);
  
    // Abra um modal para checkout e pagamento
    this.openCheckoutModal(empresa);
  }

  getEmpresas() {
    this.apiService.getEmpresa().subscribe({
      next: response => {
        this.empresas = response as Empresa[];
      },
      error: error => {
      }
      
    });
  }

  getUsuario(usuario: any) {
    this.apiService.getUsuarioId(usuario.id).subscribe((data: {value: any}) => {
      this.usuario = data.value as User
    })
  }

  logout() {
    this.apiService.logout()
  }

  async openCheckoutModal(empresa: any) {
    const modal = await this.modalCtrl.create({
      component: TabelaPrecoModalComponent,
      cssClass: 'custom-modal',
      keyboardClose: false,
      componentProps: {
        empresa: empresa
      },
      breakpoints: [0, 0.6],
      initialBreakpoint: 0.6,
      backdropDismiss: false,
      showBackdrop: false
    });

    modal.onDidDismiss().then((result) => {
      this.initializeMap()
      console.log("RESPOSTA MODAL",result)
    });
  
    await modal.present();
  }

  async veiculos() {
    await this.exibirModalVeiculo(false);
  }

}

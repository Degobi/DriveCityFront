import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
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
  @ViewChild('map') mapRef: ElementRef;
  map: any;
  lat: number;
  lng: number;
  empresas: Array<Empresa>;
  usuario: User
  distanceInKm: number;
  cost: number;

  constructor(
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private apiService: ApiService) 
    {
      this.getEmpresas()
      const userSessionStorage = this.apiService.currentUserValue;
      this.getUsuario(userSessionStorage)
    }

  ngOnInit(): void { }

  ionViewDidEnter() {

    this.geolocation.getCurrentPosition().then((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.createMap();
      
      if (this.usuario?.veiculo.length == 0)
        this.exibirModal(true);

    }).catch((err) => {
      
    })

  }

  async exibirModal(boolCadastro) {
    const modal = await this.modalCtrl.create({
      component: VeiculoComponent,
      cssClass: 'meu-modal-classe',
      keyboardClose: false,
      backdropDismiss: false,
      componentProps: {
        userId: this.usuario.id,
        cadastro: boolCadastro
      }
    });

    await modal.present();
  }

  async initialMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      config: {
        center: {
          lat: this.lat,
          lng: this.lng
        },
        streetViewControl: false,
        disableDefaultUI: true,
        zoom: 12.5,
      }
    })

    const marcador: Marker[] = []
    this.empresas.forEach(e => {
      marcador.push({
        coordinate: {
          lat: Number(e.lat),
          lng: Number(e.lng)
        },
        title: e.nome,
        snippet: e.descricao,
      })
    });

    this.userLocation();
    await this.map.addMarkers(marcador)
  }

  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      config: {
        center: {
          lat: this.lat,
          lng: this.lng
        },
        streetViewControl: false,
        disableDefaultUI: true,
        zoom: 12.5
      }
    })

    this.userLocation();
    this.addEmpresas();
  }

  async addEmpresas() {
    const marcador: Marker[] = [];
    const directionsService = new google.maps.DirectionsService();

    this.empresas.forEach(e => {

      let directionsRequest = { 
        origin: {lat: this.lat, lng: this.lng }, 
        destination: {lat: Number(e.lat), lng: Number(e.lng) }, 
        travelMode: google.maps.TravelMode.DRIVING
      }

      directionsService.route(directionsRequest, (res, stat) => {
        e.res = res
        let distanceInMeters = res.routes[0].legs[0].distance.value;
        e.distancia = Math.round(distanceInMeters / 1000);
      })

      marcador.push({
        coordinate: {
          lat: Number(e.lat),
          lng: Number(e.lng)
        },
        title: e.nome,
        snippet: e.descricao,
        iconAnchor: { x: 25, y: 50 },
        iconSize: { width: 50, height: 50 },
        iconOrigin: { x: 0, y: 0 },
        iconUrl: '../assets/icon/car.png'
      })
    });

    await this.map.addMarkers(marcador)
  }

  async userLocation() {

    console.log("Localização usuario", this.lat, this.lng)
    var user: Marker = {
      coordinate: { lat: this.lat, lng: this.lng },
      iconAnchor: { x: 25, y: 50 },
      iconSize: { width: 50, height: 50 },
      iconOrigin: { x: 0, y: 0 },
      iconUrl: '../assets/icon/navigation.png',
      title: 'Sua Localização',
    }

    await this.map.addMarker(user)
  }

  destinationOnMap(empresa: any) {
    const directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true  // Suprime os marcadores padrão
    });

    this.map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: this.lat,
        lng: this.lng
      },
      zoom: 10,
      streetViewControl: false,
      disableDefaultUI: true,
    });

    directionsDisplay.setMap(this.map);
    directionsDisplay.setDirections(empresa.res);

    // Personalize o marcador do "Ponto A"
    const startPointMarker = new google.maps.Marker({
      position: directionsDisplay.getDirections().routes[0].legs[0].start_location,
      icon: {
        url: "../assets/icon/navigation.png",
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 50)
      },
      map: this.map
    });

    // Personalize o marcador do "Ponto B"
    const endPointMarker = new google.maps.Marker({
      position: directionsDisplay.getDirections().routes[0].legs[0].end_location,
      icon: {
        url: "../assets/icon/car.png",
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 50)
      },
      map: this.map
    });

    //Modal para checkout e pagamento
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
      this.createMap()
      console.log("RESPOSTA MODAL",result)
    });
  
    await modal.present();
  }

  async veiculos() {
    await this.exibirModal(false);
  }

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Empresa } from 'src/interfaces/empresa.interface';
import { VeiculoComponent } from '../veiculo/veiculo.component';
import { LocalNotifications } from '@capacitor/local-notifications';
import { User } from 'src/interfaces/user.interface';

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
        this.exibirModal();

    }).catch((err) => {
      console.log(err)
    })

  }

  async exibirModal() {
    const modal = await this.modalCtrl.create({
      component: VeiculoComponent,
      cssClass: 'meu-modal-classe',
      keyboardClose: false,
      backdropDismiss: false,
      componentProps: {
        userId: this.usuario.id
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

  destinationOnMap(destination: any) {
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
    directionsDisplay.setDirections(destination.res);

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
  }

  async getEmpresas() {
    this.apiService.getEmpresa().subscribe((data) => {
      this.empresas = [];
      this.empresas = data as Empresa[];
      console.log('Empresas', this.empresas);
    })
  }

  getUsuario(usuario: any) {
    this.apiService.getUsuarioId(usuario.id).subscribe((data: {value: any}) => {
      this.usuario = data.value as User
      console.log('Usuario', this.usuario)
    })
  }

  logout() {
    this.apiService.logout()
  }

}

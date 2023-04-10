import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { ModalEnterprisePage } from '../modal-enterprise/modal-enterprise.page';
import { ApiService } from '../services/api.service';
import { Empresa } from 'src/interfaces/empresa.interface';

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

  constructor(
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private apiService: ApiService) 
    {
      this.getEmpresas()
    }

  ngOnInit(): void { }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.createMap();
    }).catch((err) => {
      console.log(err)
    })

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
        zoom: 12.5,
      }
    })

    this.userLocation();
    this.addEmpresas();
  }

  async addEmpresas() {
    const marcador: Marker[] = [];
    
    this.empresas.forEach(e => {
      marcador.push({
        coordinate: {
          lat: Number(e.lat),
          lng: Number(e.lng)
        },
        title: e.nome,
        snippet: e.descricao
      })
    });

    await this.map.addMarkers(marcador)
    this.map.setOnMarkerClickListener(async (marker) => { await this.openModal(marker) })
  }

  async userLocation() {

    var user: Marker = {
      coordinate: { lat: this.lat, lng: this.lng },
      iconAnchor: { x: 50, y: 50 },
      iconSize: { width: 50, height: 50 },
      iconOrigin: { x: 25, y: 50 },
      iconUrl: '',
      title: 'Sua Localização',
    }

    await this.map.addMarker(user)
  }

  calculateRoute(origin: any, destination: any) {
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();

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

    const directionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(directionsRequest, (result, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(result);

        const distanceInMeters = result.routes[0].legs[0].distance.value;
        const distanceInKm = distanceInMeters / 1000;

        console.log(`Distance: ${distanceInKm} km`);

        const kmPerLiter = 8;
        const pricePerLiter = 6.19;
        const cost = this.calculateCost(distanceInKm, kmPerLiter, pricePerLiter);
        console.log(`Cost: R$ ${Math.round(cost)} currency `);
      }
    });
  }

  calculateCost(distance: any, kmPerLiter: any, pricePerLiter: any) {
    const liters = distance / kmPerLiter;
    const cost = liters * pricePerLiter;
    return cost;
  }

  async openModal(marker: any) {
    const modal = await this.modalCtrl.create({
      component: ModalEnterprisePage,
      componentProps: {
        data: marker,
      },
      breakpoints: [0, 0.4],
      initialBreakpoint: 0.4,
      backdropDismiss: false,
      showBackdrop: false
    })

    let localizacao: any = { lat: this.lat, lng: this.lng };
    this.calculateRoute(localizacao, { lat: marker.latitude, lng: marker.longitude })

    modal.present()
    const result = await modal.onDidDismiss();

    if (result.role === 'cancel')
      await this.initialMap()

    //chamar pagina de historico onde o usuario podera ver o historico onde mostrará 
    //1 (PAGO), 2 (AGUARDANDO CONFIRMACAO LAVA-JATO), 3 (RETIRADA VEICULO), 4 (LAVANDO), 5 (A CAMINHO), 6 (FINALIZADO/ENTREGUE)
    console.log(result)
  }

  getEmpresas() {
    this.apiService.getEmpresa().subscribe((data) => {
      this.empresas = []
      this.empresas = data as Empresa[]
      console.log('Empresas', this.empresas)
    })
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Empresa } from 'src/interfaces/empresa.interface';
import { User } from 'src/interfaces/user.interface';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('slides') slides: IonSlides;
  map: any;
  lat: number;
  lng: number;
  empresas: Array<Empresa>;
  distanceInKm: number;
  cost: number;

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

  calculateRoute(destination: any) {
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
      origin: {lat: this.lat, lng: this.lng},
      destination: { lat: destination.latitude || Number(destination.lat), lng: destination.longitude || Number(destination.lng)},
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(directionsRequest, (result, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(result);

        const distanceInMeters = result.routes[0].legs[0].distance.value;
        this.distanceInKm = Math.round(distanceInMeters / 1000);

        console.log(`Distance: ${this.distanceInKm} km`);

        const kmPerLiter = 8;
        const pricePerLiter = 6.19;
        this.cost = Math.round(this.calculateCost(this.distanceInKm, kmPerLiter, pricePerLiter));
        console.log(`Cost: R$ ${Math.round(this.cost)} currency `);
      }
    });
  }

  calculateCost(distance: any, kmPerLiter: any, pricePerLiter: any) {
    const liters = distance / kmPerLiter;
    const cost = liters * pricePerLiter;
    return cost;
  }

  getEmpresas() {
    this.apiService.getEmpresa().subscribe((data) => {
      this.empresas = []
      this.empresas = data as Empresa[]
      console.log('Empresas', this.empresas)
    })
  }

  logout() {
    this.apiService.logout()
  }

}

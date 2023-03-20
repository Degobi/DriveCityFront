import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map')mapRef: ElementRef;
  map: GoogleMap;
  lat: number;
  lng: number;

  constructor(private geolocation: Geolocation) { }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.createMap();
    }).catch((err) => {
      console.log(err)
    })
    
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
        zoom: 12,
      }
    })

    this.addEmpresas();
  }


  async addEmpresas() {
    //realizar o Get na api, onde o cadastro das empresas foram efetuadas e retornar no mapa
    //exemplo abaixo
    const empresas: Marker[] = [
      {
        coordinate: {
          lat: -17.53858761249304, 
          lng: -39.73754033276241
        },
        title:'Top Lava Rápido',
        snippet:'Lava Jato alto padrão'
      },
      {
        coordinate: {
          lat: -17.544628670343858, 
          lng: -39.73889541396544
        },
        title:'Top Lava Rápido',
        snippet:'Lava Jato alto padrão'
      }
    ]

    await this.map.addMarkers(empresas)
  }
}

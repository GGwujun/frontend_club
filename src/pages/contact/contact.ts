import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  positions: any;
  images: any;
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private geolocation: Geolocation,
    public camera: Camera,
    private callNumber: CallNumber,
    private barcodeScanner: BarcodeScanner,
    private googleMaps: GoogleMaps
  ) {
    platform.ready().then(() => {
    });


  };


  cameras() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.images = base64Image;
    }, (err) => {
      // Handle error
    });
  }

  locations() {
    // get current position
    this.geolocation.getCurrentPosition().then(pos => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      this.positions = 'lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude;
    });

    const watch = this.geolocation.watchPosition().subscribe(pos => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      this.positions = 'lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude;
    });

    // to stop watching
    watch.unsubscribe();
  }

  phones() {
    this.callNumber.callNumber('18001010101', true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  scans() {
    this.barcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
    }, (err) => {
      // An error occurred
    });
  }
}

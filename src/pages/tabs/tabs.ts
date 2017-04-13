import { Component } from '@angular/core';

import { ModalController, NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { SearchPage } from '../search/search';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;
  tab4Root: any = SearchPage;
  constructor(
    public modalCtrl: ModalController
  ) {
    
  }
}

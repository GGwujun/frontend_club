import { Component } from '@angular/core';
import { List } from '../../providers/List';
import { Search } from '../../providers/Search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public list: List, public search: Search) { }

  ionViewDidLoad() {
    this.list.initData(this.conf, null);
    // this.list.initData(this.conf1, null);
    this.search.initSearch(this.conf,'data/search/arrsefej.json')
  }

  conf = {
    data: {
      cmd: 'config',
      flag: 'module',
      _memb: '1',
      page: 1,
      cou: 20,
      sort: '',
      ord: '1',
      ent: '1',
      defa: [{ value: 4, type: '1', name: 'type' }],
      filter: []
    },
    view : {
      endtext: '',
      loadtext: 'Loading more data...',
      infiniteIcon: 'bubbles',
      nullData: true,
      Alert : false,
      search :false,
      filt : false
    },   
    items:[],
    searchs: [],
    filt: [],
    currentsearch: []    
  }

  conf1 = {
      data: {
        cmd: 'config',
        flag: 'module',
        _memb: '1',
        page: 1,
        cou: 20,
        sort: '',
        ord: '1',
        ent: '1',
        defa: [{ value: 4, type: '1', name: 'type' }],
        filter: []
      },
      view : {
        nullData: true
      },   
      items:[]        
    }
}

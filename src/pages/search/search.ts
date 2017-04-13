import { Component, ViewChild } from '@angular/core';

import { NavController } from 'ionic-angular';


import { Net } from '../../providers/Net';


import { Events } from 'ionic-angular';
import { Content } from 'ionic-angular';

@Component({
  selector: 'search-home',
  templateUrl: 'search.html'
})
export class SearchPage {
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public net: Net, public event: Events) {
  }

  ionViewDidLoad() {
    this.hIndex = (document.body.clientHeight - 120 - 10) / 26;
    console.log(this.hIndex)
    let $this = this;
    this.reloadlist(this.cmlist, function (data) {
      if (data.success) {
        if (data.data.length) {
          $this.cityDatas = data.data;
        }
      } else {
        alert('网络错误');
      }
    });
    for (var i = 0; i < this.chars.length; i++) {
      this.indexs.push(this.chars.charAt(i));//获取字母数组
    }
  }





  shouldShowCancel = false; //是否显示清除输入的图标
  showMiddle = false; //是否在屏幕中央显示选中的字母索引
  hIndex;
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  indexs = [];
  cityName = '';
  hint;
  cityDatas;

  cmlist = {
    cmd: 'config',
    flag: 'module',
    _memb: '1',
    page: 1,
    cou: 5,
    sort: '',
    ord: '',
    ent: '1',
    defa:[{value:4,type:'1',name:'type'}],
    flt:[]
  }



  startDot() {
    let $this = this;
    if (this.cityName == "") {
      this.shouldShowCancel = false;
      $this.reloadlist(this.cmlist, function (data) {
        if (data.success) {
          if (data.data.length) {
            $this.cityDatas = data.data;
          }
        } else {
          alert('网络错误');
        }
      });
    } else {
      this.shouldShowCancel = true;
      $this.reloadlist(this.cmlist, function (data) {
        if (data.success) {
          if (data.data.length) {
            $this.cityDatas = data.data.filter((item) => {
              return (item.name.toLowerCase().indexOf($this.cityName.toLowerCase()) > -1);
            });
          }
        } else {
          alert('网络错误');
        }
      });
    }
  };

  searchEmpty() {
    let $this = this;
    $this.shouldShowCancel = false;
    $this.cityName = "";
    $this.reloadlist(this.cmlist, function (data) {
      if (data.success) {
        if (data.data.length) {
          $this.cityDatas = data.data;
        }
      } else {
        alert('网络错误');
      }
    });
  };


  mTouch(event) {
    let $this = this;
    var positionX = event.pageX || event.touches[0].pageX;
    var positioinY = event.pageY || event.touches[0].pageY;
    var ele: any = document.elementFromPoint(positionX, positioinY);
    if (!ele) {
      return;
    }
    var c = ele.innerText;
    if (!c || c == " " || c.length != 1) {
      return;
    }
    $this.hint = c;
    $this.showMiddle = true;

    var scroll = document.getElementById("city_" + $this.hint).offsetTop;
    $this.content.scrollTo(0, scroll, 300);


    var ele: any = document.getElementsByTagName("ion-content");
    ele[0].style.overflow = "auto";
  };



  mRelease() {
    let $this = this;
    setTimeout(function () {
      $this.showMiddle = false;
    }, 300);
  };


  reloadlist(cmlist, callback) {
    this.net.ajax('list',cmlist,function(data){
      callback && callback(data)
    })
  }
}

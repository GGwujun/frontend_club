import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import {AlertController } from 'ionic-angular';

import { Net } from '../../providers/Net';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

@Injectable()

export class AboutPage {
  private todo: FormGroup;

  csducheck: Array<{ value: string, isChecked: boolean }> = [];

  conf={
    URL:'csb/cnt/',
    cmd:'save',
    flag:'lgckonih',
    title:'',
    description:'',
    sexradio:'',
    cobom:'',
    date:'',
    loveitem:'',
    todo:null
  }


  constructor(
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public net: Net
  ) {

    this.getData('ionic/data.json', 'csducheck');

    this.todo = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      sexradio: ['', Validators.required],
      cobom: ['', Validators.required],
      date: ['', Validators.required],
      loveitem: ['', Validators.required]
    });

  }



  //固定获取数据并配置对应绑定值
  getData(url, code) {
    let $this=this;
    return this.net.ajax('get', {url:url}, function (data) {
      $this[code] = data.data;
    })
  }


  Datapost(type,conf,callback) {
    return this.net.ajax(type,conf, function (data) {
      callback && callback(data)
    })
  }

  //针对checkbox的选择赋值提交函数
  changeCheckbox() {
    let check = this.csducheck.filter(c => c.isChecked).map(c => c.value);
    this.todo.value.loveitem = check.join(',');
  }


  //表单提交函数
  logForm() {
    this.todo.value.loveitem = (this.csducheck.filter(c => c.isChecked).map(c => c.value)).join(',');
    let $this = this;
    for (var key in this.todo.value) {
      if (this.todo.value[key] instanceof Object && !(this.todo.value[key] instanceof Array)) {
        let arraydata = this.todo.value[key];
        this.todo.value[key] = [];
        for (var keys in arraydata) {
          if (arraydata[keys] == true) {
            this.todo.value[key].push(keys);
          }
        }
      }
    }
    this.todo.value.cmd=$this.conf.cmd;
    this.todo.value.flag=$this.conf.flag;
    this.Datapost('post',this.todo.value, function (data) {
      let alert = $this.alertCtrl.create({
        title: '提交数据',
        subTitle: JSON.stringify(data),
        buttons: ['OK']
      });
      alert.present();
    });
  }
}

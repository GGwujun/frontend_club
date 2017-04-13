import { Injectable } from '@angular/core';

import { List } from '../providers/List';
import { Net } from '../providers/Net';


@Injectable()

export class Search {

    constructor(public list: List, public net: Net) { }

    initSearch(conf, url) {
        this.net.ajax('get', { url: url }, function (data) {
 
            data.filt.forEach(function (item,index) {
                conf.filt.push({
                    id: index,
                    name: item.name,
                    class_name: item.class_name
                })
            })

            data.list.forEach(function(item,index){
                conf.searchs.push({
                    class_name:item.class_name,
                    id:item.id,
                    ismore:item.ismore,
                    name:item.name,
                    sub_cat:item.sub_cat
                })
            })

            data.svr.forEach(function(item,index){
                conf.searchs.push({
                    class_name:item.class_name,
                    id:item.id,
                    ismore:item.ismore,
                    name:item.name,
                    sub_cat:item.sub_cat
                })
            })

            data.url.forEach(function(item,index){
                conf.searchs.push({
                    class_name:item.class_name,
                    id:item.id,
                    ismore:item.ismore,
                    name:item.name,
                    sub_cat:item.sub_cat
                })
            })
        })
    }

    searchSwitch(conf, name) {
        conf.view.Alert = true;
        if (name == 'searchs') {
            conf.view.search = true;
            conf.view.filt = false;
        } else if (name == 'filt') {
            conf.view.filt = true;
            conf.view.search = false;
        }
    }

    Alerthide(conf) {
        conf.view.Alert = false;
        conf.view.search = false;
        conf.view.filt = false;
    }



    addActive(event) {
        event.currentTarget.className = 'active';
        this.siblings(event.currentTarget, function (ele) {
            if (ele.className == 'active')
                ele.className = '';
        })
    }

    isActives(conf, item, i, event) {
        this.addActive(event);
        let ret = conf.currentsearch.find(function (data) {
            return data.class_name == item.class_name;
        })

        if (!ret) {
            conf.currentsearch.push({
                class_name: item.class_name,
                value: i.id
            })
        } else {
            conf.currentsearch.forEach(function (item) {
                if (item.class_name == ret.class_name)
                    item.value = i.id
            })
        }
    }


    siblings(elem, callback) {
        var n = elem.parentNode.firstChild;
        for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
                callback && callback(n);
            }
        }
    }

    confirm(conf) {
        conf.refresh=true;
        conf.data.filter=[];
        conf.currentsearch.forEach(function (item) {
            conf.data.filter.push({ value: item.value, type: '1', 'name': item.class_name });
        })
        this.Alerthide(conf);
        this.list.initData(conf, null);
    }
    

    sort(conf,event,name){
        conf.refresh=true;
        conf.data.sort=name;
        this.addActive(event);
        this.Alerthide(conf);
        this.list.initData(conf, null);
    
    }

}

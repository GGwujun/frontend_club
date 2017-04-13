import { Injectable } from '@angular/core';

import { Net } from '../providers/Net';


@Injectable()

export class List {

    constructor(public net: Net) { }
    

    initData(conf, callback) {
        this.net.ajax('list', conf.data, function (data) {
            if (data.success) {
                if (data.data.length) {
                    conf.view.loadtext = '加载更多数据...';
                    conf.view.infiniteIcon = 'bubbles';
                    if (conf.refresh) {
                        conf.items = data.data;
                    }
                    else {
                        data.data.forEach(item => conf.items.push(item));
                    }
                    conf.nullData = true;
                    callback && callback(data);
                } else {
                    conf.items = [];
                    conf.nullData = false;
                }
            } else {
                alert('网络错误');
            }
        });
    }



    //上拉刷新
    doRefresh(conf, refresher, callback) {
        let that = this;
        conf.data.page = 1;
        setTimeout(() => {
            conf.refresh = true;
            that.initData(conf, function () {
                conf.refresh = false;
                conf.infiniteScroll && conf.infiniteScroll.enable(true);
                conf.infiniteScroll = null;
                conf.end = false;
                conf.start = false;
                refresher.complete();
            });
        }, 200);
    }




    // 下拉刷新
    doInfinite(conf, infiniteScroll, callback) {
        if (!conf.end && !conf.start) {
            let that = this;
            conf.data.page++;
            conf.start = true;
            setTimeout(() => {
                that.initData(conf, function (data) {
                    conf.start = false;
                    if (conf.items.length == data.total) {
                        conf.infiniteScroll = infiniteScroll;
                        //infiniteScroll.enable(false);
                        conf.end = true;
                        conf.infiniteIcon = 'none';
                        conf.loadtext = '亲，已到低了哦！';
                        callback && callback(data);
                    }
                    infiniteScroll.complete();
                });

            }, 200);
        }
    }

}

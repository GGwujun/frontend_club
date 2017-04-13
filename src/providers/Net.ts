import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()

export class Net {
    Path = 'https://www.csdu.net/';//打包地址
    path = '/api/';//开发地址
    constructor(
        public http: Http,
        public RequestOptions: RequestOptions
    ) { }


    makeURL(cmd) {
        if (cmd === 'admin')
            return 'admin/cod/';
        else if (cmd === 'cdn')
            return 'cdn/';
        else if (cmd === 'save')
            return 'csb/cnt/';
        else
            return 'csb/' + cmd + '/';
    }

    ajax(type, body, callback) {
        let cmd = body.cmd;
        let flag = body.flag;
        let url = this.path + this.makeURL(cmd);
        if (type == 'get') {
            body.url = this.path + body.url;
            this.http.get(body.url).map((data: any) => data.json()).subscribe((data: any) => {
                callback && callback(data);
            });

        } else if (type == 'post') {
            let bodys = new URLSearchParams()
            body.cmd = cmd;
            body._flag = flag;
            body.pf = 1000;
            for (var key in body) {
                if (key != 'flag')
                    bodys.append(key, body[key]);
            }
            let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
            let options = new RequestOptions({
                headers: headers
            });
            this.http.post(url, bodys.toString(), options).map((data: any) => data.json()).subscribe((data: any) => {
                callback && callback(data);
            });

        } else if (type == 'list') {
            let bodydata = '';
            let flt = '<Filter xmlns="filter"><Row>';
            if (body.filter) {

                body.filter.forEach(function (i) {
                    let t = i.type;
                    let v = i.value.toString();
                    let name = i.name;
                    flt += '<Data Type="' + t + '" Value="' + v + '">' + name + '</Data>';
                })
            }

            if (body.defa) {
                body.defa.forEach(function (i) {
                    let t = i.type;
                    let v = i.value.toString();
                    let name = i.name;
                    flt += '<Data Type="' + t + '" Value="' + v + '">' + name + '</Data>';
                })
            }

            flt += '</Row></Filter>';

            if (flt == '<Filter xmlns="filter"><Row></Row></Filter>')
                flt = '';
            
            body.flt = flt;
            for (var key in body) {
                if (key != 'cmd' && key !='filter' && key != 'defa') {
                    if (bodydata)
                        bodydata += '&' + (key == 'flag' ? '_flag' : key) + '=' + body[key];
                    else
                        bodydata += (key == 'flag' ? '_flag' : key) + '=' + body[key];
                }
            }

            bodydata += '&pf=1000&cmd=list';
            let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
            let options = new RequestOptions({
                headers: headers
            });
            this.http.post(url, bodydata, options).map((data: any) => data.json()).subscribe((data: any) => {
                callback && callback(data);
            });
        }
    }
}

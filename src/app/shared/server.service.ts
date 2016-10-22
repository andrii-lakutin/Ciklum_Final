import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';


@Injectable() 
export class ServerService {

  constructor(private http: Http) {
  }

  loginUser(name,pass) {

    let url = `http://localhost:3000/login`;
    let data = {
      name: name,
      pass: pass
    };
    let body = JSON.stringify(data);
    let head = new Headers({'Content-Type': 'application/json'});

   	return this.http.post(url, body, {headers: head})
   		.toPromise()
  }

}
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
*	API Service
*/
import { ApiServiceProvider } from '../api-service/api-service';

/*
*	User Service
*/
import { UserServiceProvider } from '../user-service/user-service';
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
  	*/
  @Injectable()
  export class AuthServiceProvider {

  	apiService:ApiServiceProvider = new ApiServiceProvider();

  	constructor(public http: Http, public platform: Platform, public alerCtrl: AlertController, public storage: Storage, public user: UserServiceProvider) {
          user = new UserServiceProvider(storage, http);
      }

      public login(credentials) {
          if (credentials.email === null || credentials.password === null) {
              return Observable.throw("Please insert credentials");
          } else {
              return Observable.create(observer => {
                  
                  var apiLink = this.apiService.getLoginAPI();
                  let loginServiceData = {
                      email: credentials.email,
                      password: credentials.password
                  };

                  this.http.post(apiLink, loginServiceData)
                  .subscribe(data => {
                      var result = JSON.parse(data['_body']);
                      console.log(result);
                      let access = (result.success);

                      if(access === true){
                          this.user.addToken(result.token);
                          this.user.addUser(result.user);
                      }

                      observer.next(result);
                      observer.complete();

                  }, error => {
                      console.log(error.toString());
                  });
              });
          }
      }

      public register(credentials) {
          if (credentials.email === null || credentials.username === null || credentials.password === null || credentials.name === null || credentials.phone_number === null || credentials.confirm_password === null) {
              return Observable.throw("Please insert credentials");
          } else {
              // At this point store the credentials to your backend!
              return Observable.create(observer => {
                  var apiLink = this.apiService.getRegisterAPI();

                  let dataObj = {
                      name: credentials.name,
                      username: credentials.username,
                      phone_number: credentials.phone_number,
                      email: credentials.email,
                      password: credentials.password,
                      confirm_password: credentials.confirm_password
                  };

                  this.http.post(apiLink, dataObj)
                  .subscribe(data => {
                      var result = JSON.parse(data['_body']);
                      console.log(result);
                      let access = (result);

                      observer.next(access);
                      observer.complete();

                  }, error => {
                      console.log(error.toString());
                  });
              });
          }
      }

      public getUserInfo() : UserServiceProvider {
          return this.user;
      }

      public logout() {
          return Observable.create(observer => {
              this.user = null;
              observer.next(true);
              observer.complete();
          });
      }

  }

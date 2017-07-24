import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
*  Request
*/
import { Http, Headers, RequestOptions } from '@angular/http';

/*
*	API Service
*/
import { ApiServiceProvider } from '../api-service/api-service';

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
  	*/
  @Injectable()
  export class UserServiceProvider {

  	apiService:ApiServiceProvider = new ApiServiceProvider();

      constructor(public storage: Storage, public http: Http ) {}

      addUser(user: any){
          this.storage.set('user', user);
      }

      public addToken(token: string){
          this.storage.set('token', token);
      }

      public getUser() : any{
          return this.storage.get('user');
      }

      public getToken() : any{
          return this.storage.get('token');
      }

      public clearUser (){
          this.storage.clear();
      }

      public getProfile(){

          this.getToken().then(token => {
              // API Link
              var apiLink = this.apiService.getProfileAPI();

              // Request options
              let opt: RequestOptions;
              let header: Headers = new Headers;

              // include token in header
              header.append('Authorization', 'Bearer '+token);

              opt = new RequestOptions({
                  headers: header
              });  

              //  GET Request
              this.http.get(apiLink, opt)
              .subscribe(data => {

                  // parse result
                  var result = JSON.parse(data['_body']);

                  // if result success
                  if(result.success){
                      this.storage.remove('user').then(() => {
                          console.log(result.userData);
                          this.addUser(result.userData);
                      });
                  }

              }, error => {
                  console.log(error);
              });

          });

      }

  }

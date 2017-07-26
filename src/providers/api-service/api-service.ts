import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
Generated class for the ApiServiceProvider provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular DI.
    */
@Injectable()
export class ApiServiceProvider {

    constructor() { }

    // public root:String = "https://128.199.228.93/api";
    public root:String = "http://128.199.228.93/api";

    public register:String = "register";
    public login:String = "login";
    public profile:String = "profile";
    public profileUpdate:String = "profile/update";
    public profilePictureUpdate:String = "profile/picture";
    public dashboardAPI:String = "profile/dashboard";
    public transferHistoriesAPI:String = "transactions/transfer/histories";
    public transferAPI:String = "transactions/transfer";
    public requestHistoriesAPI:String = "transactions/request/histories";
    public requestAPI:String = "transactions/request";

    public getRegisterAPI() {
        return this.root+"/"+this.register;
    }

    public getLoginAPI() {
        return this.root+"/"+this.login;
    }

    public getProfileAPI() {
        return this.root+"/"+this.profile;
    }

    public getProfileUpdateAPI() {
        return this.root+"/"+this.profileUpdate;
    }

    public getProfilePictureUpdateAPI() {
        return this.root+"/"+this.profilePictureUpdate;
    }

    public getDashboardAPI() {
        return this.root+"/"+this.dashboardAPI;
    }

    public getTransferHistoriesAPI() {
        return this.root+"/"+this.transferHistoriesAPI;
    }

    public getTransferAPI(){
        return this.root+"/"+this.transferAPI;
    }

    public getRequestHistoriesAPI(){
        return this.root+"/"+this.requestHistoriesAPI;
    }

    public getRequestAPI(){
        return this.root+"/"+this.requestAPI;
    }

}

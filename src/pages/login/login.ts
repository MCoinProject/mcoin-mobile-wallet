import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage, Platform, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';

/*
*	Request
*/
import { Http, Headers, RequestOptions } from '@angular/http';

/*
*	API Service
*/
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';

/*
* Sweet Alert 2 for popup
*/
import swal from 'sweetalert2';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @Component({
 	selector: 'page-login',
 	templateUrl: 'login.html',
 })
 export class LoginPage {

 	loading: Loading;
 	loginCredentials = { email: '', password: '' };
 	user: any;

 	apiService:ApiServiceProvider = new ApiServiceProvider();

 	constructor(private nav: NavController, private auth: AuthServiceProvider, private userProvider: UserServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage, private platform: Platform, private events: Events, private http: Http) {
 		this.initUser();
 		this.platform.registerBackButtonAction(() => {
 			this.platform.exitApp();
 		});
 	}

 	public initUser(){
 		this.storage.get("user").then((user) => {
 			this.user = user;
 			this.storage.get("token").then(token => {
	 			this.checkToken(token);
	 		});
 		});
 	}

 	public checkToken(token){
 		this.loading = this.loadingCtrl.create({
 			content: 'Please wait...',
 			dismissOnPageChange: true
 		});
 		this.loading.present();

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
			this.loading.dismiss();
		    // parse result
		    var result = JSON.parse(data['_body']);

		    // if result success
		    if(result.success){
		    	this.events.publish('user:initialize');
		    	this.nav.setRoot(HomePage);
		    } else {
		    	this.userProvider.clearUser();
		    }

		}, error => {
		    console.log(error);
		});
	}

 	public login() {
 		this.showLoading()
 		this.auth.login(this.loginCredentials).subscribe(result => {
 			if (result.success) {        
 				this.nav.setRoot(HomePage);
 			} else {
 				this.showError(result.message);
 			}
 		},
 		error => {
 			this.showError(error);
 		});
 	}

 	showLoading() {
 		this.loading = this.loadingCtrl.create({
 			content: 'Please wait...',
 			dismissOnPageChange: true
 		});
 		this.loading.present();
 	}

 	showError(text) {
 		this.loading.dismiss();
 		swal(
 			'Error!',
 			text,
 			'error'
 			);
 	}

 	public createAccount() {
 		this.nav.push(RegisterPage);
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad LoginPage');
 	}

 }

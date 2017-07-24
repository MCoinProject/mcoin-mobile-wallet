import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage, Platform, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';

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

 	constructor(private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage, private platform: Platform, private events: Events) {
 		this.initUser();
 		this.platform.registerBackButtonAction(() => {
 			this.platform.exitApp();
 		});
 	}

 	public initUser(){
 		this.storage.get("user").then((user) => {
 			if(user != null){
 				this.user = user;
 				this.events.publish('user:initialize');
 				this.nav.setRoot(HomePage);
 			}
 		});
 	}

 	public login() {
 		this.showLoading()
 		this.auth.login(this.loginCredentials).subscribe(allowed => {
 			if (allowed) {        
 				this.nav.setRoot(HomePage);
 			} else {
 				this.showError("Access Denied");
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

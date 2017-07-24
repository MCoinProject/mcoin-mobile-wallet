import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/*
* Sweet Alert 2 for popup
*/
import swal from 'sweetalert2';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @Component({
 	selector: 'page-register',
 	templateUrl: 'register.html',
 })
 export class RegisterPage {

 	createSuccess = false;
 	registerCredentials = { 
 		name: '',
 		phone_number: '',
 		email: '', 
 		username: '', 
 		password: '' ,
 		confirm_password: '' 
 	};

 	constructor(private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController) {
 	}

 	public register() {
 		this.auth.register(this.registerCredentials).subscribe(result => {
 			if (result.success) {
 				this.createSuccess = true;
 				this.showPopup("Success", "Account created.");
 			} else {
 				this.showPopup("Error", result.message);
 			}
 		},
 		error => {
 			this.showPopup("Error", error);
 		});
 	}
 	
 	showPopup(title, message) {
 		var msg = "";

 		if (title == "Error") {
 			if(typeof message === 'object'){
 			    for (var key in message) {
 			        if (message.hasOwnProperty(key)) {
 			            msg += message[key][0]+"<br>";
 			        }
 			    }
 			}else{
 			    msg += message;
 			}
 			swal(title, msg, 'error');
 		} else {
 			swal(title, message, 'success').then( data => {
				this.nav.pop();
			});
 		}
 		
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad RegisterPage');
 	}

 }

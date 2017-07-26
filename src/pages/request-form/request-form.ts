import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Loading } from 'ionic-angular';

/*
*	Request
*/
import { Http, Headers, RequestOptions } from '@angular/http';

/*
*	User Provider - get local data
*/
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';

/*
* Sweet Alert 2 for popup
*/
import swal from 'sweetalert2';

/*
*	API Service
*/
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the RequestFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @Component({
 	selector: 'page-request-form',
 	templateUrl: 'request-form.html',
 })
 export class RequestFormPage {

	/*
	* variables
	*/
	public user : any;
	public token: any;
	public loading: any;

	apiService:ApiServiceProvider = new ApiServiceProvider();

	formData = {
		description: '',
		amount: '',
		email: '',
	};

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage:Storage, public http: Http, public userProvider: UserServiceProvider) {
		this.getUserData();
		this.userProvider.getToken().then(token => {
			this.token = token;
		});
	}

	public submitRequest(){
 		var apiLink = this.apiService.getRequestAPI();

 		let data = {
 			amount: this.formData.amount,
 			description: this.formData.description,
 			email: this.formData.email,
 		};

 		console.log(data);

 		// Request options
 		let opt: RequestOptions;
 		let header: Headers = new Headers;

 		// include token in header
 		header.append('Authorization', 'Bearer '+this.token);

 		opt = new RequestOptions({
 		    headers: header
 		});  

 		this.http.post(apiLink, data, opt)
 		.subscribe(data => {
 			var result = JSON.parse(data['_body']);
 			console.log(result);
 			
 			if(result.success){
 				swal(
 					'Success!',
 					result.message,
 					'success'
 					).then(data => {
 						this.closeSelf();
 					});
 			}else{
 				var msg = "";
 				if(typeof result.message === 'object'){
 					for (var key in result.message) {
 						if (result.message.hasOwnProperty(key)) {
 							msg += result.message[key][0]+"<br>";
 						}
 					}
 				}else{
 					msg += result.message;
 				}
 				
 				swal(
 					'Error!',
 					msg,
 					'error'
 					);
 			}

 		}, error => {
 			console.log(error.toString());
 		});
 	}

	public getUserData(){
		this.userProvider.getUser().then(data => {
			this.user = data;
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RequestFormPage');
	}

	public closeSelf(){
		this.viewCtrl.dismiss();
	}

}

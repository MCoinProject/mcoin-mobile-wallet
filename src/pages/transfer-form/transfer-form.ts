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

/*
*	Barcode scanner
*/
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the TransferFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @Component({
 	selector: 'page-transfer-form',
 	templateUrl: 'transfer-form.html',
 	providers: [BarcodeScanner]
 })
 export class TransferFormPage {

	/*
	* variables
	*/
	public user : any;
	public token: any;
	public loading: any;

	apiService:ApiServiceProvider = new ApiServiceProvider();

	formData = {
		address: '',
		amount: '',
		email: '',
	};

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage:Storage, public http: Http, public userProvider: UserServiceProvider, public barcodeScanner: BarcodeScanner) {
		this.getUserData();
		this.userProvider.getToken().then(token => {
			this.token = token;
		});
	}

	public scan() {
		this.barcodeScanner.scan().then((barcodeData) => {
			this.formData.address = barcodeData.text;
		}, (err) => {
		    swal(
		    	'Error!',
		    	err,
		    	'error'
		    	);
		});
	}

	public transferRequest(){
 		var apiLink = this.apiService.getTransferAPI();

 		let data = {
 			amount: this.formData.amount,
 			address: this.formData.address,
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
		console.log('ionViewDidLoad TransferFormPage');
	}

	public closeSelf(){
		this.viewCtrl.dismiss();
	}

}

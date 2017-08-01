/*
*	Basic component
*/
import { Component } from '@angular/core';
import { ModalController, NavController, IonicPage, NavParams } from 'ionic-angular';

/*
*	Request
*/
import { Http, Headers, RequestOptions } from '@angular/http';

/*
*	Date format
*/
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

/*
*	Loading spinner
*/
import { LoadingController, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

/*
* Floating Action Button
*/
import { FabContainer } from 'ionic-angular';

/*
* Sweet Alert 2 for popup
*/
import swal from 'sweetalert2';

/*
*	User Provider - get local data
*/
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';

/*
*	Import Page
*/
import { TransferFormPage } from '../transfer-form/transfer-form';

/*
*	API Service
*/
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the TransferPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @Component({
 	selector: 'page-transfer',
 	templateUrl: 'transfer.html',
 	providers: [DatePipe, DecimalPipe]
 })
 export class TransferPage {

 	/*
 	* variables
 	*/
 	public user : any;
 	public token: any;
 	public loading: any;
 	public transactions: any[] = [];
 	public nextUrl: any;
 	public overlayHidden: boolean = true;

 	apiService:ApiServiceProvider = new ApiServiceProvider();

 	constructor(private nav: NavController, private modalCtrl: ModalController, private userProvider: UserServiceProvider, public storage:Storage, public http: Http, public datePipe: DatePipe, public decimalPipe: DecimalPipe, public loadingCtrl: LoadingController) {
 		this.getUserData();
 		this.userProvider.getToken().then(token => {
 			this.token = token;
 			this.getTransferHistories();
 		});
 	}

 	public hideOverlay() {
 		this.overlayHidden = !this.overlayHidden;
 	}

 	public haveData(){
 		if (this.transactions.length > 0)
 			return true;

 		return false;
 	}

 	public getUserData(){
		this.userProvider.getUser().then(data => {
			this.user = data;
		});
	}

	doInfinite(infiniteScroll) {
	    console.log('Begin async operation');
	    this.getTransferHistories().then(()=>{
	    	infiniteScroll.complete();
	    	if(!this.nextUrl){
	    		infiniteScroll.enable(false);
	    	} else {
	    		infiniteScroll.enable(true);
	    	}
	    });
	}

 	public getTransferHistories(){
 		
 		return new Promise(resolve => {

 			var apiLink = "";

	 		// API Link
	 		if(this.nextUrl){
	 			apiLink = this.nextUrl;
	 		} else {
	 			this.transactions = [];
	 			apiLink = this.apiService.getTransferHistoriesAPI();
	 		}
			
			// Request options
			let opt: RequestOptions;
			let header: Headers = new Headers;

			// include token in header
			header.append('Authorization', 'Bearer '+this.token);

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
			        // this.transactions = result.transaction.data;
			        for(var indx = 0; indx < result.transaction.data.length; indx ++){
			        	this.transactions.push(result.transaction.data[indx]);
			        }
			        if(result.transaction.next_page_url != null){
			        	this.nextUrl = result.transaction.next_page_url;
			        } else {
			        	this.nextUrl = null;
			        }
			    }

			    resolve(true);

			}, error => {
			    console.log(error);
			});
		});
 	}

 	public openAddForm(fab?: FabContainer){
 		this.hideOverlay();

 		if (fab !== undefined) {
 			fab.close();
 		}

 		let modal = this.modalCtrl.create(TransferFormPage);
 		modal.onDidDismiss(data => {});
 		modal.present();
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad TransferPage');
 	}

 }

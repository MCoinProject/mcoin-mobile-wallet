/*
*	Basic component
*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Loading } from 'ionic-angular';

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
*	API Service
*/
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the StakeProfitPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @Component({
 	selector: 'page-stake-profit',
 	templateUrl: 'stake-profit.html',
 	providers: [DatePipe, DecimalPipe]
 })
 export class StakeProfitPage {

  /*
	* variables
	*/
	public user : any;
	public token: any;
	public loading: any;
	public profits: any[] = [];
	public nextUrl: any;
	public overlayHidden: boolean = true;

	apiService:ApiServiceProvider = new ApiServiceProvider();

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage:Storage, public http: Http, public userProvider: UserServiceProvider) {
		this.getUserData();
		this.userProvider.getToken().then(token => {
			this.token = token;
		});
	}

	public hideOverlay() {
		this.overlayHidden = !this.overlayHidden;
	}

	public haveData(){
		if (this.profits.length > 0)
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
		this.getRequestHistories().then(()=>{
			infiniteScroll.complete();
			if(!this.nextUrl){
				infiniteScroll.enable(false);
			} else {
				infiniteScroll.enable(true);
			}
		});
	}

	public getRequestHistories(){

		return new Promise(resolve => {

			// 	var apiLink = "";

			// 	// API Link
			// 	if(this.nextUrl){
				// 		apiLink = this.nextUrl;
				// 	} else {
					// 		this.profits = [];
					// 		apiLink = this.apiService.getRequestHistoriesAPI();
					// 	}

					// // Request options
					// let opt: RequestOptions;
					// let header: Headers = new Headers;

					// // include token in header
					// header.append('Authorization', 'Bearer '+this.token);

					// opt = new RequestOptions({
						//     headers: header
						// });  

						//  GET Request
						// this.http.get(apiLink, opt)
						// .subscribe(data => {

							//     // parse result
							//     var result = JSON.parse(data['_body']);

							//     // if result success
							//     if(result.success){
								//         // this.transactions = result.transaction.data;
								//         for(var indx = 0; indx < result.request.data.length; indx ++){
									//         	this.profits.push(result.request.data[indx]);
									//         }
									//         if(result.request.next_page_url != null){
										//         	this.nextUrl = result.request.next_page_url;
										//         } else {
											//         	this.nextUrl = null;
											//         }
											//     }

											resolve(true);

											// }, error => {
												//     console.log(error);
												// });
											});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad StakeProfit');
	}

	public closeSelf(){
		this.viewCtrl.dismiss();
	}
}

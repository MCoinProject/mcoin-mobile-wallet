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

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [DatePipe, DecimalPipe]
})
export class HomePage {

	/*
	* variables
	*/
	public user : any;
	public token: any;
	public loading: any;

	public transfered: any;
	public received: any;
	public balance: any;
	public dncPrice: any;

	public transactions: any;

	apiService:ApiServiceProvider = new ApiServiceProvider();

	@ViewChild(Slides) slides: Slides;

	constructor(private nav: NavController, private userProvider: UserServiceProvider, public storage:Storage, public http: Http, public datePipe: DatePipe, public decimalPipe: DecimalPipe, public loadingCtrl: LoadingController) {
		this.getUserData();
		this.userProvider.getToken().then(token => {
			this.token = token;
			this.getDashboardData();
		});
	}

	public getUserData(){
		this.userProvider.getUser().then(data => {
			this.user = data;
		});
	}

	public getDashboardData(){
		// API Link
		var apiLink = this.apiService.getDashboardAPI();

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
		        this.transfered = result.transfered;
		        this.received = result.received;
		        this.balance = result.balance;
		        this.dncPrice = result.dncPrice;

		        this.transactions = result.transactions;
		    }

		}, error => {
		    console.log(error);
		});
	}
}

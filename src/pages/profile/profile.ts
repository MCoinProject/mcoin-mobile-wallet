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
import { DatePipe } from '@angular/common';

/*
* Sweet Alert 2 for popup
*/
import swal from 'sweetalert2';

/*
*	Camera
*/
import { Camera, CameraOptions } from '@ionic-native/camera';

/*
*	File transfer
*/
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/*
*	Loading spinner
*/
import { LoadingController } from 'ionic-angular';

/*
* Floating Action Button
*/
import { FabContainer } from 'ionic-angular';

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
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @Component({
 	selector: 'page-profile',
 	templateUrl: 'profile.html',
 	providers: [DatePipe, Camera, File, FileTransfer]
 })
 export class ProfilePage {

	/*
	* variables
	*/
	public user : any;
	public token: any;
	public loading: any;
	public disableForm: boolean = true;
	public overlayHidden: boolean = true;

	updateData = {
		name: '',
		phone_number: '',
	};

	apiService:ApiServiceProvider = new ApiServiceProvider();

	constructor(private nav: NavController, private userProvider: UserServiceProvider, public storage:Storage, public http: Http, public datePipe: DatePipe, public modalCtrl: ModalController, public camera: Camera, public transfer: FileTransfer, public file: File, public loadingCtrl: LoadingController) {
		this.getUserData();
		this.userProvider.getToken().then(token => {
			this.token = token;
		});
	}

	public hideOverlay() {
		this.overlayHidden = !this.overlayHidden;
	}

	public openCamera(fab?: FabContainer){

		this.hideOverlay();

		if (fab !== undefined) {
			fab.close();
		}
		
		const options: CameraOptions = {
			quality: 70,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then((imageData) => {
			// API Link
			var updateAvatarUrl = this.apiService.getProfilePictureUpdateAPI();

			// let base64Image = 'data:image/jpeg;base64,' + imageData;

			const fileFileTransfer: FileTransferObject = this.transfer.create();

			let options: FileUploadOptions = {
				fileKey: 'profile_picture',
				fileName: 'avatar.jpg',
				headers: {'Authorization': 'Bearer '+this.token},
				chunkedMode: true,
				httpMethod: "POST",
			}

			// initialize loader
			let loader = this.loadingCtrl.create({
				content: 'Please wait...'
			});

			// show loader
			loader.present();

			fileFileTransfer.upload(imageData, updateAvatarUrl, options)
			.then((data) => {
				let result = JSON.parse(data.response);

				// hide loader
				loader.dismiss();

				if(result.success == true || result.success == "true")
				{
					swal(
						'Success!',
						'You have update your profile picture',
						'success'
						).then(data => {
							this.userProvider.getProfile();
							setTimeout(() => {
								this.getUserData();
							},1000);
						});
				}
				else
				{
					swal(
						'Error!',
						result.message,
						'error'
						);
				}

			}, (err) => {
				swal(
					'Error!',
					err.body,
					'error'
					);
			});
		}, (err) => {
			swal(
				'Error!',
				'Operation canceled',
				'error'
				);
		});
	}

	public enableEditting(fab?: FabContainer){

		this.hideOverlay();

		if (fab !== undefined) {
			fab.close();
		}

		this.disableForm = !this.disableForm;
		console.log(this.disableForm);
	}

	public getUserData(){
		this.userProvider.getUser().then(data => {
			this.user = data;
			this.updateData.name = data.profile.name;
			this.updateData.phone_number = data.profile.phone_number;
		});
	}

	public updateProfile(){

		// API link
		var apiLink = this.apiService.getProfileUpdateAPI();

		// Request options
		let opt: RequestOptions;
		let header: Headers = new Headers;

		// add token into header
		header.append('Authorization', 'Bearer '+this.token);

		opt = new RequestOptions({
			headers: header
		});

		// request body
		let body = {
			name: this.updateData.name,
			phone_number: this.updateData.phone_number
		};

		// POST request
		this.http.post(apiLink, body, opt)
		.subscribe(data => {
			// parse result data
			var result = JSON.parse(data['_body']);
			console.log(result);
			// if success
			if(result.success){
				swal(
					'Success!',
					'You have update your profile',
					'success'
					).then(data => {
						this.userProvider.getProfile();
						this.enableEditting();
					});
			} else {
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
			console.log(error);
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProfilePage');
	}

}

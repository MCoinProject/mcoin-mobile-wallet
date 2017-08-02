import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { TransferPage } from '../pages/transfer/transfer';
import { RequestPage } from '../pages/request/request';
import { StakePage } from '../pages/stake/stake';

// import { ListPage } from '../pages/list/list';

@Component({
    templateUrl: 'app.html'
})
export class WalletApp {
    @ViewChild(Nav) nav: Nav;

    // set default page to be loaded
    rootPage: any = LoginPage;

    // define datatype for side menu pages object
    pages: Array<{title: string, component: any, icon: string}>;

    /*
    * variables
    */
    public user : any;
    public zone = new NgZone({ enableLongStackTrace: false });

    constructor(public platform: Platform, private auth: AuthServiceProvider, public statusBar: StatusBar, public splashScreen: SplashScreen, public userProvider: UserServiceProvider, public storage: Storage, public http: Http, public events: Events) {
        this.initializeApp();

        events.subscribe('user:initialize', () => {
          this.setSideBar();
        });

        // list of pages in side bar navigation
        this.pages = [
        { title: 'Wallet', component: HomePage , icon: "home"},
        { title: 'Profile', component: ProfilePage, icon: "contact" },
        // { title: 'List', component: ListPage, icon: "list" },
        { title: 'Transfer', component: TransferPage, icon: "trending-up" },
        { title: 'Request', component: RequestPage, icon: "trending-down" },
        { title: 'Stake', component: StakePage, icon: "logo-buffer" },
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    setSideBar(){

        this.zone.run(() => {

            this.userProvider.getUser().then(data => {
                this.user = data;
                console.log(this.user);
            });

        });

    }

    menuOpened() {
        this.userProvider.getUser().then(data => {
            this.user = data;
        });
    }

    logout() {
        this.userProvider.clearUser();
        this.nav.setRoot(LoginPage);
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}

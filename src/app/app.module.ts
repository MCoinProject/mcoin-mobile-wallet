import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { WalletApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import { TransferPage } from '../pages/transfer/transfer';
import { TransferFormPage } from '../pages/transfer-form/transfer-form';
import { RequestPage } from '../pages/request/request';
import { RequestFormPage } from '../pages/request-form/request-form';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { WalletServiceProvider } from '../providers/wallet-service/wallet-service';
import { ApiServiceProvider } from '../providers/api-service/api-service';

@NgModule({
  declarations: [
    WalletApp,
    LoginPage,
    RegisterPage,
    ProfilePage,
    TransferPage,
    TransferFormPage,
    RequestPage,
    RequestFormPage,

    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(WalletApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WalletApp,
    LoginPage,
    RegisterPage,
    ProfilePage,
    TransferPage,
    TransferFormPage,
    RequestPage,
    RequestFormPage,
    
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    UserServiceProvider,
    WalletServiceProvider,
    ApiServiceProvider
  ]
})
export class AppModule {}

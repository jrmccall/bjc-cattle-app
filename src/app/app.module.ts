import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {StatesPage} from "../pages/states/states";
import {AuctionsPage} from "../pages/auctions/auctions";
import {MapPage} from "../pages/map/map";
import {MARSProvider} from "../providers/MARS-provider";
import {AuctionPage} from "../pages/auction/auction";
import {LibraryModule} from "../library/library.module";
import {StoreModule} from '../store/store.module';
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    StatesPage,
    AuctionsPage,
    MapPage,
    AuctionPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    LibraryModule,
    StoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    StatesPage,
    AuctionsPage,
    MapPage,
    AuctionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MARSProvider,
    LibraryModule
  ]
})
export class AppModule {}

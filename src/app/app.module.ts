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
import {AuctionPage} from "../pages/auction/auction";
import {LibraryModule} from "../library/library.module";
import {StoreModule} from '../store/store.module';
import {HttpClientModule} from "@angular/common/http";
import {AuctionInfoPopover} from "../pages/auction-info-popover/auction-info-popover";
import {AuctionInfoTableProvider} from "../providers/auction-info-table-provider";
import {StartPage} from "../pages/start/start";
import {AuctionDataUtility} from "../utility/auctionDataUtility";
import {UserConfigPage} from "../pages/user-config/user-config";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    StatesPage,
    AuctionsPage,
    MapPage,
    AuctionPage,
    AuctionInfoPopover,
    StartPage,
    UserConfigPage
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
    AuctionPage,
    AuctionInfoPopover,
    StartPage,
    UserConfigPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LibraryModule,
    AuctionInfoTableProvider,
    AuctionDataUtility
  ]
})
export class AppModule {}

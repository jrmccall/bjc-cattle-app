import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {select} from "@angular-redux/store";
import {isEmpty} from 'ramda';
import {MarsAllReports} from "../../library/mars-all-reports.model";
import {Observable} from "rxjs/Rx";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @select(['library', 'globalAuctionData']) globalAuctionData$: Observable<any>;
  @select(['library', 'auctionTableData']) auctionTable: Observable<any>;

  auctionReports: MarsAllReports[];

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad(){

  }

  ionViewWillLeave() {
  }

  highestAuction$: Observable<any> = Observable.combineLatest(
    this.globalAuctionData$,
    this.auctionTable,
  (globalData: any, auctionTable: any) => {
    if(globalData == null){
      return null;
    }

    let highestSteerAuction = null;
    let highestHeiferAuction = null;
    let key = '';
    let i = 0;
    for(key in globalData){
      if(globalData.hasOwnProperty(key)){
        if(i==0){
          highestSteerAuction = globalData[key];
          highestHeiferAuction = globalData[key];
        }

        if(globalData[key].avgSteerPrice > highestSteerAuction.avgSteerPrice){
          highestSteerAuction = globalData[key];
        }

        if(globalData[key].avgHeiferPrice > highestHeiferAuction.avgSteerPrice){
          highestHeiferAuction = globalData[key];
        }
      }
      i++;
    }
    if(highestSteerAuction.avgSteerPrice > highestHeiferAuction.avgHeiferPrice){
      return {
        name: auctionTable[highestHeiferAuction.slug_id],
        price: highestHeiferAuction.avgHeiferPrice
      };
    } else {
      return {
        name: auctionTable[highestSteerAuction.slug_id],
        price: highestSteerAuction.avgSteerPrice
      };
    }
  });

}

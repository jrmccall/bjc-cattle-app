import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LibraryActions} from "../../library/library.actions";
import {select} from "@angular-redux/store";
import {isEmpty} from 'ramda';
import {MarsAllReports} from "../../library/mars-all-reports.model";
import {Observable} from "rxjs/Rx";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @select(['library', 'MARSData']) marsReports$: Observable<MarsAllReports[]>;

  auctionReports: MarsAllReports[];

  constructor(public navCtrl: NavController, private _libraryActions: LibraryActions) {

  }

  ionViewDidLoad(){

  }

  ionViewWillLeave() {
    console.log(this.auctionList$);
  }

  auctionList$: Observable<MarsAllReports[]> = this.marsReports$.map((reports: MarsAllReports[]) => {
    if(isEmpty(reports)){
      return null;
    }
    this.auctionReports = reports.filter(function(currentReport, index, reportList) {
      return currentReport.market_types.findIndex(function(currentMarketType, index, marketTypeList){return currentMarketType =='Live Auction'});
    });
    console.log(this.auctionReports);
    return this.auctionReports;
  });

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuctionsPage} from "../auctions/auctions";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {select} from "@angular-redux/store";
import {isEmpty} from "ramda";
import {MarsAllReports} from "../../library/mars-all-reports.model";

/**
 * Generated class for the StatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-states',
  templateUrl: 'states.html',
})
export class StatesPage {

  @select(['library', 'MARSData']) marsReports$: Observable<MarsAllReports[]>;

  states: Array<{name: string, avgPrice: number}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.states = [
      {name:'Tennessee', avgPrice: 0},
      {name: 'Kansas', avgPrice: 0}
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatesPage');
  }

  auctionList$: Observable<MarsAllReports[]> = this.marsReports$.map((reports: MarsAllReports[]) => {
    if(isEmpty(reports)){
      return null;
    }
    return reports.filter(function(currentReport, index, reportList) {
      if(currentReport.market_types.findIndex(
        function(currentMarketType, index, marketTypeList) {
          return currentMarketType =='Live Auction'
        }) != -1) {
        return currentReport;
      }
    });
  });

  pushAuctionsPage(state: {name: string, avgPrice: number}){
    this.navCtrl.push(AuctionsPage, {state: state});
  }

}

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {isEmpty,  last} from "ramda";
import {Chart} from 'chart.js';
import { MARSProvider } from "../../providers/MARS-provider";
import {AuctionPage} from "../auction/auction";

/**
 * Generated class for the AuctionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auctions',
  templateUrl: 'auctions.html',
})
export class AuctionsPage {

  @ViewChild('chartCanvas') chartCanvas;

  state: any;
  auctions: Array<{name: string, avgPrice: number}>;
  lineChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public MARSProv: MARSProvider) {
    this.state = navParams.get('state');
    this.auctions = [
      {name: 'Auction 1', avgPrice: 0},
      {name: 'Auction 2', avgPrice: 0}
    ]
    //this.getAllReports();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuctionsPage');
  }

  getAllReports(){
    this.MARSProv.getAllReports();
  }

  pushAuctionPage(auction: {name: string, avgPrice: number}){
    this.navCtrl.push(AuctionPage, auction);
  }


}

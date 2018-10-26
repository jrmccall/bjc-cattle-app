import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AuctionInfoPopover} from "../auction-info-popover/auction-info-popover";

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  auctionList: any[] = [{name: 'Auction 1', price: 23, top: '23%', left: '50%'}, {name: 'Auction 1', price: 23, top: '23%', left: '50%'}];

  constructor(public navCtrl: NavController, public navParams: NavParams, public popCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  log(){
    console.log("clicked point");
    const popover = this.popCtrl.create(AuctionInfoPopover);
    popover.present();
  }

}

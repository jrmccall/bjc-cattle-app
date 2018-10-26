import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-auction-info-popover',
  templateUrl: 'auction-info-popover.html',
})
export class AuctionInfoPopover {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }


}

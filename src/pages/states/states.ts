import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuctionsPage} from "../auctions/auctions";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {select} from "@angular-redux/store";
import {isEmpty} from "ramda";
import {MarsAllReports} from "../../library/mars-all-reports.model";
import {AuctionTableRecord} from "../../library/auction-table-record.model";
import {BehaviorSubject} from "rxjs/Rx";

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
  @select(['library', 'auctionTableData']) auctionTable$: Observable<any>;
  @select(['library', 'stateData']) stateData$: Observable<any>;

  sortBySteerPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sortByHeiferPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  currentSort$: BehaviorSubject<string> = new BehaviorSubject<string>('steer');
  displayType$: BehaviorSubject<string> = new BehaviorSubject<string>('steer');

  auctionInfoList: any[];
  stateMap: any;
  iconType: string = "md-female";

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatesPage');
  }

  states$: Observable<any[]> = Observable.combineLatest(
    this.stateData$,
    this.sortBySteerPrice$,
    this.sortByHeiferPrice$,
    this.currentSort$,
    (stateData: any, sortBySteerPrice: boolean, sortByHeiferPrice: boolean, currentSort: string)=>{
    if(stateData == null){
      return [];
    }

    let key = '';
    let stateList = [];
    for(key in stateData){
      if(stateData.hasOwnProperty(key)){
        stateList.push(stateData[key]);
      }
    }
    stateList.sort(function (a,b) {
      if(sortBySteerPrice && currentSort=='steer'){
        return +b.steerAvgPrice-(+a.steerAvgPrice);
      } else if(!sortBySteerPrice && currentSort=='steer'){
        return +a.steerAvgPrice-(+b.steerAvgPrice);
      }

      if(sortByHeiferPrice && currentSort=='heifer'){
        return +b.heiferAvgPrice-(+a.heiferAvgPrice);
      } else if(!sortByHeiferPrice && currentSort=='heifer'){
        return +a.heiferAvgPrice-(+b.heiferAvgPrice);
      }
    });

    return stateList;
  });

  sortByAvgSteerPrice(){
    this.setCurrentSort('steer');
    let sortValue = false;
    this.sortBySteerPrice$.subscribe(data => sortValue = data);
    if(sortValue){
      this.sortBySteerPrice$.next(false);
    } else {
      this.sortBySteerPrice$.next(true);
    }

  }

  sortByAvgHeiferPrice(){
    this.setCurrentSort('heifer');
    let sortValue = false;
    this.sortByHeiferPrice$.subscribe(data => sortValue = data);
    if(sortValue){
      this.sortByHeiferPrice$.next(false);
    } else {
      this.sortByHeiferPrice$.next(true);
    }

  }

  setCurrentSort(sortValue: string){
    this.currentSort$.next(sortValue);
  }

  changeDisplayType(){
    let displayType = '';
    this.displayType$.subscribe(type => displayType = type);
    if(displayType == 'steer'){
      this.iconType = "md-male";
      this.displayType$.next('heifer');
    } else {
      this.iconType = "md-female";
      this.displayType$.next('steer');
    }

  }


  pushAuctionsPage(auctions: any){
    this.navCtrl.push(AuctionsPage, auctions);
  }

}

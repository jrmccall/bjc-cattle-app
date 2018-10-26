import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {isEmpty,  last} from "ramda";
import {Chart} from 'chart.js';
import { MARSProvider } from "../../providers/MARS-provider";
import {AuctionPage} from "../auction/auction";
import {LibraryActions} from "../../library/library.actions";
import {select} from "@angular-redux/store";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {isUndefined} from "ionic-angular/util/util";


@IonicPage()
@Component({
  selector: 'page-auctions',
  templateUrl: 'auctions.html',
})
export class AuctionsPage {

  @ViewChild('chartCanvas') chartCanvas;

  @select(['library', 'globalAuctionData']) globalAuctionData$: Observable<any>;

  state: any;
  auctions: any[];
  iconType: string = "md-female";

  sortBySteerPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sortByHeiferPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  currentSort$: BehaviorSubject<string> = new BehaviorSubject<string>('steer');
  displayType$: BehaviorSubject<string> = new BehaviorSubject<string>('steer');

  constructor(public navCtrl: NavController, public navParams: NavParams, public MARSProv: MARSProvider,
              private _libraryActions: LibraryActions) {
    this.auctions = this.navParams.data;
    this.state = this.auctions[0].state;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuctionsPage');
  }

  auctionDisplayList$: Observable<any[]> = Observable.combineLatest(
    this.globalAuctionData$,
    this.sortBySteerPrice$,
    this.sortByHeiferPrice$,
    this.currentSort$,
    (globalData: any, sortBySteerPrice: boolean, sortByHeiferPrice: boolean, currentSort: string) => {
    if(globalData == null){
      return [];
    }

    let displayList = this.auctions.map(function (current) {
      if(globalData.hasOwnProperty(current.slug_id)){
        let displayData = {};
        /* Maybe change this format to the .field format */
        displayData['steerAvgPrice'] = globalData[current.slug_id].steerAvgPrice.toFixed(2);
        displayData['heiferAvgPrice'] = globalData[current.slug_id].heiferAvgPrice.toFixed(2);
        displayData['name'] = current.name;
        displayData['slug_id'] = current.slug_id;
        displayData['lastReportDate'] = globalData[current.slug_id].lastReportDate;
        displayData['steerMedPrice'] = globalData[current.slug_id].steerMedPrice.toFixed(2);
        displayData['heiferMedPrice'] = globalData[current.slug_id].heiferMedPrice.toFixed(2);
        displayData['steerCount'] = globalData[current.slug_id].steerCount;
        displayData['heiferCount'] = globalData[current.slug_id].heiferCount;
        return displayData;
      }
    }).filter(function (current) {
      if(!isUndefined(current)){
        return current;
      }
    }).sort(function (a,b) {
      if(sortBySteerPrice && currentSort=='steer'){
        return +b['steerAvgPrice']-(+a['steerAvgPrice']);
      } else if(!sortBySteerPrice && currentSort=='steer'){
        return +a['steerAvgPrice']-(+b['steerAvgPrice']);
      }

      if(sortByHeiferPrice && currentSort=='heifer'){
        return +b['heiferAvgPrice']-(+a['heiferAvgPrice']);
      } else if(!sortByHeiferPrice && currentSort=='heifer'){
        return +a['heiferAvgPrice']-(+b['heiferAvgPrice']);
      }
    });
    return displayList;
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

  checkNaN(value){
    let isANaN = isNaN(value);
    return isANaN;
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


  pushAuctionPage(auction: any){
    this.navCtrl.push(AuctionPage, auction.slug_id);
  }


}

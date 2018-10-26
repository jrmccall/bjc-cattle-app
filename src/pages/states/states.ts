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

  auctionInfoList: any[];
  stateMap: any;

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

  // auctionList$: Observable<MarsAllReports[]> = this.marsReports$.map((reports: MarsAllReports[]) => {
  //   if(isEmpty(reports)){
  //     return null;
  //   }
  //   return reports.filter(function(currentReport, index, reportList) {
  //     if(currentReport.market_types.findIndex(
  //       function(currentMarketType, index, marketTypeList) {
  //         return currentMarketType =='Live Auction'
  //       }) != -1) {
  //       return currentReport;
  //     }
  //   });
  // });

  // auctionInfoList$: Observable<any[]> = Observable.combineLatest(
  //   this.auctionList$,
  //   this.auctionTable$,
  //   (auctions: MarsAllReports[], auctionTable: any) => {
  //   if(isEmpty(auctions)){
  //     return null;
  //   }
  //   let auctionFinalList = auctions.map(function(current, index, list){
  //     let auctionInfo = auctionTable[current.slug_id];
  //     //console.log(current.slug_id);
  //     //console.log(auctionInfo);
  //     return auctionInfo;
  //   }).sort(function(a,b){
  //     if(a.state > b.state){
  //       return 1;
  //     } else if(a.state < b.state){
  //       return -1;
  //     } else{
  //       return 0;
  //     }
  //   });
  //   this.auctionInfoList = auctionFinalList;
  //   console.log(auctionFinalList);
  //   return auctionFinalList;
  // });
  //
  // stateList$: Observable<any[]> = this.auctionInfoList$.map((auctionList: any[]) => {
  //   if(isEmpty(auctionList)){
  //     return null;
  //   }
  //   let tempState = '';
  //   return auctionList.filter(function(current, index, list){
  //     if(current.state != tempState){
  //       tempState = current.state;
  //       return current.state;
  //     }
  //   });
  // });
  //
  // stateMap$: Observable<any> = this.auctionInfoList$.map((auctionList: any[]) => {
  //   if(isEmpty(auctionList)){
  //     return null;
  //   }
  //   let map = {};
  //   let tempState = auctionList[0].state;
  //   let tempObj = auctionList[0];
  //   let tempArray = [];
  //   auctionList.forEach(function(current, index, list){
  //     if(current.state != tempState){
  //       map[tempState] = tempArray;
  //       tempArray = [];
  //       tempState = current.state;
  //       tempArray.push(current);
  //     } else if(current.state == tempState){
  //       tempArray.push(current);
  //     }
  //   });
  //   //this.stateMap = map;
  //   return map;
  // });
  //
  // makeStateMap(){
  //   let map = {};
  //   let tempState = this.auctionInfoList[0].state;
  //   let tempObj = this.auctionInfoList[0];
  //   let tempArray = [];
  //   this.auctionInfoList.forEach(function(current, index, list){
  //     if(current.state != tempState || index == (list.length -1)){
  //       map[tempState] = tempArray;
  //       tempArray = [];
  //       tempState = current.state;
  //       tempArray.push(current);
  //     } else if(current.state == tempState){
  //       tempArray.push(current);
  //     }
  //   });
  //   console.log(map);
  //   return map;
  // }

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


  pushAuctionsPage(auctions: any){
    // let stateMap = this.makeStateMap();
    // let auctionListFromState = stateMap[state.state];
    // console.log(auctionListFromState);
    this.navCtrl.push(AuctionsPage, auctions);
  }

}

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {isEmpty,  last} from "ramda";
import {Chart} from 'chart.js';
import {AuctionPage} from "../auction/auction";
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
  @select(['library', 'auctionTableData']) auctionTable$: Observable<any>;
  @select(['library', 'userConfig']) userConfig$: Observable<any>;

  state: any;
  auctions: any[];
  iconType: string = "md-female";

  sortBySteerPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sortByHeiferPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sortByTransportation$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  currentSort$: BehaviorSubject<string> = new BehaviorSubject<string>('average');
  displayType$: BehaviorSubject<string> = new BehaviorSubject<string>('steer');
  transportationCity$: BehaviorSubject<string> = new BehaviorSubject<string>('drummonds');

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.auctions = this.navParams.data;
    this.state = this.auctions[0].state;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuctionsPage');
  }

  auctionInitializeList$: Observable<any[]> = Observable.combineLatest(
    this.globalAuctionData$,
    this.auctionTable$,
    (globalData: any, auctionTable: any) => {
    if(globalData == null){
      return [];
    }

    let displayList = this.auctions.map(function (current) {
      if(globalData.hasOwnProperty(current.slug_id)){
        let displayData = {
          steerAvgPrice: globalData[current.slug_id].steerAvgPrice.toFixed(2),
          heiferAvgPrice: globalData[current.slug_id].heiferAvgPrice.toFixed(2),
          name: current.name,
          slug_id: current.slug_id,
          lastReportDate: globalData[current.slug_id].lastReportDate,
          steerMedPrice: globalData[current.slug_id].steerMedPrice.toFixed(2),
          heiferMedPrice: globalData[current.slug_id].heiferMedPrice.toFixed(2),
          steerCount: globalData[current.slug_id].steerCount,
          heiferCount: globalData[current.slug_id].heiferCount,
          transportation: {
            drummonds: {
              steer: '',
              heifer: ''
            },
            yatesCenter: {
              steer: '',
              heifer: ''
            }
          }
        };
        return displayData;
      }
    }).filter(function (current) {
      if(!isUndefined(current)){
        return current;
      }
    });

    for(let i=0; i<displayList.length; i++){
      let milageData = auctionTable[displayList[i].slug_id].transportation;
      this.calculateMedPriceWithTransCost(milageData, displayList[i]);

    }
    return displayList;
  });

  auctionDisplayList$: Observable<any[]> = Observable.combineLatest(
    this.auctionInitializeList$,
    this.sortByHeiferPrice$,
    this.sortBySteerPrice$,
    this.currentSort$,
    this.displayType$,
    this.transportationCity$,
    this.sortByTransportation$,
    (auctionList: any[], sortByHeiferPrice: boolean, sortBySteerPrice: boolean,
     currentSort: string, displayType: string, transportationCity: string,
     sortByTransportation: boolean) => {
      if(isEmpty(auctionList)){
        return [];
      }

      switch(displayType){
        case 'steer':
          switch(currentSort){
            case 'average':
              return auctionList.sort(function (a, b) {
                if(sortBySteerPrice){
                  return +b['steerAvgPrice']-(+a['steerAvgPrice']);
                } else {
                  return +a['steerAvgPrice']-(+b['steerAvgPrice']);
                }
              });

            case 'transportation':
              switch(transportationCity){
                case 'drummonds':
                  return auctionList.sort(function (a, b) {
                    if(sortByTransportation){
                      return +b.transportation.drummonds.steer - +a.transportation.drummonds.steer;
                    } else {
                      return +a.transportation.drummonds.steer - +b.transportation.drummonds.steer;
                    }
                  });
                case 'yatesCenter':
                  return auctionList.sort(function (a, b) {
                    if(sortByTransportation){
                      return +b.transportation.yatesCenter.steer - +a.transportation.yatesCenter.steer;
                    } else {
                      return +a.transportation.yatesCenter.steer - +b.transportation.yatesCenter.steer;
                    }
                  });
              }
          }

        case 'heifer':
          switch(currentSort){
            case 'average':
              return auctionList.sort(function (a, b) {
                if(sortByHeiferPrice){
                  return +b['heiferAvgPrice']-(+a['heiferAvgPrice']);
                } else {
                  return +a['heiferAvgPrice']-(+b['heiferAvgPrice']);
                }
              });

            case 'transportation':
              switch(transportationCity){
                case 'drummonds':
                  return auctionList.sort(function (a, b) {
                    if(sortByTransportation){
                      return +b.transportation.drummonds.heifer - +a.transportation.drummonds.heifer;
                    } else {
                      return +a.transportation.drummonds.heifer - +b.transportation.drummonds.heifer;
                    }
                  });
                case 'yatesCenter':
                  return auctionList.sort(function (a, b) {
                    if(sortByTransportation){
                      return +b.transportation.yatesCenter.heifer - +a.transportation.yatesCenter.heifer;
                    } else {
                      return +a.transportation.yatesCenter.heifer - +b.transportation.yatesCenter.heifer;
                    }
                  });
              }
          }
      }

  });

  sortByAvgSteerPrice(){
    this.setCurrentSort('average');
    let sortValue = false;
    this.sortBySteerPrice$.subscribe(data => sortValue = data);
    if(sortValue){
      this.sortBySteerPrice$.next(false);
    } else {
      this.sortBySteerPrice$.next(true);
    }

  }

  sortByAvgHeiferPrice(){
    this.setCurrentSort('average');
    let sortValue = false;
    this.sortByHeiferPrice$.subscribe(data => sortValue = data);
    if(sortValue){
      this.sortByHeiferPrice$.next(false);
    } else {
      this.sortByHeiferPrice$.next(true);
    }

  }

  sortByTransportation(){
    this.setCurrentSort('transportation');
    let sortValue = false;
    this.sortByTransportation$.subscribe(data => sortValue = data);
    if(sortValue){
      this.sortByTransportation$.next(false);
    } else {
      this.sortByTransportation$.next(true);
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

  changeTransportationCity(){
    let city = '';
    this.transportationCity$.subscribe(data => city = data);
    if(city == 'drummonds'){
      this.transportationCity$.next('yatesCenter');
    } else {
      this.transportationCity$.next('drummonds');
    }
  }

  calculateMedPriceWithTransCost(milageData, displayData){
    let drummondsMiles = +milageData.drummonds;
    let yatesMiles = +milageData.yatesCenter;
    let pricePerMile = 1;
    let poundsPerTruck = 1;
    this.userConfig$.subscribe(data => {
      pricePerMile = +data.pricePerMile;
      poundsPerTruck = +data.poundsPerTruckLoad;
    });
    let poundsToCwt = 100;
    let steerMed = displayData.steerMedPrice;
    let heiferMed = displayData.heiferMedPrice;

    console.log(drummondsMiles);
    console.log(pricePerMile);
    console.log(steerMed);

    displayData.transportation.drummonds.steer = (+steerMed + (pricePerMile/poundsPerTruck)*drummondsMiles*poundsToCwt).toFixed(2);
    displayData.transportation.drummonds.heifer = (+heiferMed + (pricePerMile/poundsPerTruck)*drummondsMiles*poundsToCwt).toFixed(2);

    displayData.transportation.yatesCenter.steer = (+steerMed + (pricePerMile/poundsPerTruck)*yatesMiles*poundsToCwt).toFixed(2);
    displayData.transportation.yatesCenter.heifer = (+heiferMed + (pricePerMile/poundsPerTruck)*yatesMiles*poundsToCwt).toFixed(2);
  }


  pushAuctionPage(auction: any){
    this.navCtrl.push(AuctionPage, auction.slug_id);
  }


}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AuctionPage} from "../auction/auction";
import {ViewChild} from "@angular/core";
import {Chart} from 'chart.js';
import {isEmpty} from 'ramda';
import {Observable} from "rxjs/Rx";
import {select} from "@angular-redux/store";
import {BehaviorSubject} from "rxjs/Rx";

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

  @select(['library', 'auctionTableData']) auctionTableData$: Observable<any>;
  @select(['library', 'globalAuctionData']) auctionData$: Observable<any>;

  @ViewChild('chartCanvas') chartCanvas;

  weightBound$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  lineChart: any;

  name: string;
  steerMinPrice: number;
  steerMaxPrice: number;
  heiferMinPrice: number;
  heiferMaxPrice: number;
  slug_id: string;
  mostRecentDate: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public popCtrl: PopoverController) {
    this.name = navParams.data.name;
    this.slug_id = navParams.data.slug_id;
    console.log(name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
    this.loadChart();
  }

  currentData$: Observable<any[]> = this.auctionData$.map((auctionData: any) => {
    if(auctionData == null){
      return [];
    }
    let currentDates = [];
    if(auctionData.hasOwnProperty(this.slug_id)){
      let results = auctionData[this.slug_id].results;
      let mostRecentDate = results[0].report_date;
      this.mostRecentDate = mostRecentDate;
      results.forEach(function(current, arr, index){
        if(current.report_date == mostRecentDate){
          currentDates.push(current);
        }
      });

    }
    currentDates.sort(function(a,b){
      return a.avg_weight - b.avg_weight;
    });
    return currentDates;
  });

  steerData$: Observable<any[]> = Observable.combineLatest(
    this.currentData$,
    this.weightBound$,
    (currentData: any, weightBound: number) => {
      if(currentData == null){
        return [];
      }
      let steers = this.getDataForType(currentData, 'Steers', weightBound);


      return steers;
    });

  heiferData$: Observable<any[]> = Observable.combineLatest(
    this.currentData$,
    this.weightBound$,
    (currentData: any, weightBound: number) => {
      if(currentData == null){
        return [];
      }
      let heifers = this.getDataForType(currentData, 'Heifers', weightBound);


      return heifers;
    });

  chartDataRange$: Observable<any[]> = Observable.combineLatest(
    this.steerData$,
    this.heiferData$,
    (steerData: any[], heiferData: any[]) => {
      if(isEmpty(steerData) || isEmpty(heiferData)){
        return [];
      }
      let steerMaxWeightClass = steerData[steerData.length-1].x;
      let steerMinWeightClass = steerData[0].x;
      let heiferMaxWeightClass = heiferData[heiferData.length-1].x;
      let heiferMinWeightClass = heiferData[0].x;

      let maxRange = '';
      let minRange = '';

      if(steerMaxWeightClass > heiferMaxWeightClass){
        maxRange = steerMaxWeightClass;
      } else {
        maxRange = heiferMaxWeightClass;
      }

      if(steerMinWeightClass < heiferMinWeightClass){
        minRange = steerMinWeightClass;
      } else {
        minRange = heiferMinWeightClass;
      }

      let min = +minRange.split('-')[0];
      let max = +maxRange.split('-')[1];
      let range = [];

      while(min < max){
        let weightRange = min + '-' + (min+100);
        range.push(weightRange);
        min += 100;

      }

      return range;
    });

  loadChart(){

    this.lineChart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: "Steer Price",
            fill: false,
            data: [],
            backgroundColor: "rgba(75,192,192, 1)",
            borderColor: "rgba(0, 0, 128, 1)",
            pointBorderColor: "rgba(0, 0, 0, 1)",
            pointBackgroundColor: "rgba(0, 0, 0, 1)",
            pointRadius: 1
          },
          {
            label: "Heifer Price",
            fill: false,
            data: [],
            backgroundColor: "rgba(75,192,192, 1)",
            borderColor: "rgba(178, 34, 34, 1)",
            pointBorderColor: "rgba(0, 0, 0, 1)",
            pointBackgroundColor: "rgba(0, 0, 0, 1)",
            pointRadius: 1
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Average Price per Weight Class'
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'category',
            scaleLabel: {
              display: true,
              labelString: 'Weight Class'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Avg Price (Cwt)'
            }
          }]
        }
      }
    });

    this.steerData$.filter(datasets => !isEmpty(datasets)).subscribe(datasets => {
      const ci = this.lineChart;
      ci.data.datasets[0].data = datasets;
      ci.update();
    });

    this.heiferData$.filter(datasets => !isEmpty(datasets)).subscribe(datasets => {
      const ci = this.lineChart;
      ci.data.datasets[1].data = datasets;
      ci.update();
    });

    this.chartDataRange$.filter(datasets => !isEmpty(datasets)).subscribe(datasets => {
      const ci = this.lineChart;
      ci.options.scales.xAxes[0].labels = datasets;
      ci.update();
    });

  }

  pushAuctionPage(){
    this.navCtrl.push(AuctionPage, this.slug_id);
  }

  /*
   * @param type should be 'Steers' or 'Heifers'
   */
  getDataForType(auctionDataArray: any[], type, weightLowerBound){
    let typeData = [];
    let weightLowBound = this.getHundredRange(+auctionDataArray[0].avg_weight);
    let avgPrice = 0;
    let totalWeight = 0;
    let count = 0;
    let weightRange = weightLowBound + '-' + (weightLowBound+100);
    auctionDataArray.forEach(function(current){
      if(current._class == type && (+current.avg_weight <= (weightLowBound+100) && +current.avg_weight >= weightLowBound)){
        avgPrice += +current.avg_price;
        totalWeight += +current.avg_weight;
        count++;
      } else if(+current.avg_weight > (weightLowBound +100)) {
        avgPrice = avgPrice/count;
        let weightClass = {
          x: weightRange,
          y: avgPrice
        };
        if(isNaN(weightClass.y)){
          weightClass.y = 0;
        }
        typeData.push(weightClass);

        avgPrice = +current.avg_price;
        totalWeight = +current.avg_weight;
        count = 1;
        weightLowBound += 100;
        weightRange = weightLowBound + '-' + (weightLowBound + 100);
      }

    });
    return typeData;
  }

  getHundredRange(lowestWeight: number){
    return Math.floor(lowestWeight/100)*100;
  }


}

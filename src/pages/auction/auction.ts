import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import {isEmpty,  last} from "ramda";
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {select} from '@angular-redux/store';
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {ChartTest} from "../../library/chart-test.model";
import {LibraryActions} from "../../library/library.actions";

/**
 * Generated class for the AuctionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auction',
  templateUrl: 'auction.html',
})
export class AuctionPage {

  @ViewChild('chartCanvas') chartCanvas;

  @select(['library', 'auctionTableData']) auctionTableData$: Observable<any>;
  @select(['library', 'auctionData']) auctionData$: Observable<any>;

  displayType$: BehaviorSubject<string> = new BehaviorSubject<string>('steer');
  displayTime$: BehaviorSubject<string> = new BehaviorSubject<string>('all');
  weightBound$: BehaviorSubject<number> = new BehaviorSubject<number>(400);
  recordSort$: BehaviorSubject<string> = new BehaviorSubject<string>('avg_weight');


  auction: any;
  lineChart: any;
  iconType: string = "md-female";

  slug_id: string;
  mostRecentReportDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private _libraryActions: LibraryActions) {
    this.slug_id = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuctionPage');

    this.loadChart();
  }

  mostRecentRecords$: Observable<any[]> = Observable.combineLatest(
    this.auctionData$,
    this.recordSort$,
  (auctionData: any, recordSort: string) => {
    if(auctionData == null){
      return [];
    }

    let auctionRecords = auctionData[this.slug_id].results;
    let mostRecentReportDate = auctionRecords[0].report_date;
    this.mostRecentReportDate = mostRecentReportDate;
    let recentRecords = auctionRecords.filter(function (current) {
      if(current.report_date == mostRecentReportDate && (current._class=='Steers' || current._class == 'Heifers')){
        return current;
      }
    });

    let sortedRecords = this.recordSorter(recordSort, recentRecords);

    console.log(recentRecords);

    return sortedRecords;

  });


  auctionInfo$: Observable<any> = this.auctionTableData$.map((auctionTable: any) => {
    if(auctionTable == null){
      return null;
    }
    return auctionTable[this.slug_id];
  });

  /* todo: develop an organized way of organizing historical data for all the desired groupings */

  /* This is to separate the raw aucton data into two groups: steers and heifers */

  steerData$: Observable<any[]> = Observable.combineLatest(
    this.auctionData$,
    this.weightBound$,
    (auctionData: any, weightBound: number) => {
      if(auctionData == null){
        return [];
      }
      let steers = [];
      if(auctionData.hasOwnProperty(this.slug_id)){
        let currentAuctionData = auctionData[this.slug_id].results;
        steers = this.getDataForType(currentAuctionData, 'Steers', weightBound);
      } else {
        return [];
      }

      return steers;
  });

  heiferData$: Observable<any[]> = Observable.combineLatest(
    this.auctionData$,
    this.weightBound$,
    (auctionData: any, weightBound: number) => {
      if(auctionData == null){
        return [];
      }
      let heifers = [];
      if(auctionData.hasOwnProperty(this.slug_id)){
        let currentAuctionData = auctionData[this.slug_id].results;
        heifers = this.getDataForType(currentAuctionData, 'Heifers', weightBound);
      } else {
        return [];
      }

      return heifers;
    });

  /* This is to sort the data for the steers and heifers individually to display on the chart
   * without having to do the separate the data again. Additionally, the filters
   * can be applied here to the datasets separately without having to have a ton of logic
   * put all together in one observable.
   */

  steerDisplay$: Observable<any[]> = this.steerData$.map((steerData: any[]) => {
    if(isEmpty(steerData)){
      return [];
    }
    let steerDataByDate = [];
    let currentDate = steerData[0].report_date;
    let currentSum = 0;
    let count = 0;
    steerData.forEach(function(current){
      if(current.report_date != currentDate){
        let currentAvg = currentSum/count;
        let dataForArray = {
          x: new Date(currentDate),
          y: currentAvg
        };
        steerDataByDate.push(dataForArray);
        currentDate = current.report_date;
        currentSum = 0;
        count = 0;
      }
      currentSum += +current.avg_price;
      count++;
    });

    steerDataByDate.sort(function (a,b) {
      return a.x.getTime()-b.x.getTime();
    });
    return steerDataByDate;
  });

  heiferDisplay$: Observable<any[]> = this.heiferData$.map((heiferData: any[]) => {
    if(isEmpty(heiferData)){
      return [];
    }
    let heiferDataByDate = [];
    let currentDate = heiferData[0].report_date;
    //let timeInfo = this.setTimeInfoForFiltering(currentDate);
    let currentSum = 0;
    let count = 0;
    heiferData.forEach(function(current){
      if(current.report_date != currentDate){
        let currentAvg = currentSum/count;
        /* Formatting of x and y necessary for the chart */
        let dataForArray = {
          x: new Date(currentDate),
          y: currentAvg
        };
        heiferDataByDate.push(dataForArray);
        currentDate = current.report_date;
        currentSum = 0;
        count = 0;
      }
      currentSum += +current.avg_price;
      count++;
    });

    heiferDataByDate.sort(function (a,b) {
      return a.x.getTime()-b.x.getTime();
    });
    return heiferDataByDate;
  });

  /* This is where the heiferDisplay$ and steerDisplay$ will be combined in order to display
   * whichever we wish on the chart
   */

  auctionChartData$: Observable<any[]> = Observable.combineLatest(
    this.steerDisplay$,
    this.heiferDisplay$,
    this.displayType$,
    this.displayTime$,
    (steerDisplay: any[], heiferDisplay: any[], displayType: string, displayTime: string) => {
      if(isEmpty(steerDisplay) || isEmpty(heiferDisplay)){
        return [];
      }

      let currentSteerDisplay = [];
      let currentHeiferDisplay = [];

      let yearBound = steerDisplay[steerDisplay.length-1].x.getFullYear();
      let monthBound = steerDisplay[steerDisplay.length-1].x.getMonth();

      switch(displayTime){
        case 'all':
          currentSteerDisplay = steerDisplay;
          currentHeiferDisplay = heiferDisplay;
          break;
        case '1y':
          let date = new Date();
          date.setFullYear(yearBound-1);
          date.setMonth(monthBound);
          currentSteerDisplay = steerDisplay.filter(function(current){
            if(current.x > date){
              return current;
            }
          });
          currentHeiferDisplay = heiferDisplay.filter(function(current){
            if(current.x > date){
              return current;
            }
          });
          break;
        case '6m':
          if(monthBound - 6 < 1){
            yearBound = yearBound - 1;
            monthBound = monthBound + 12 - 6;
          } else {
            monthBound = monthBound - 6;
          }
          date = new Date();
          date.setFullYear(yearBound);
          date.setMonth(monthBound);
          currentSteerDisplay = steerDisplay.filter(function(current){
            if(current.x > date){
              return current;
            }
          });
          currentHeiferDisplay = heiferDisplay.filter(function(current){
            if(current.x > date){
              return current;
            }
          });
          break;
        case '1m':
          if(monthBound - 1 < 1){
            yearBound = yearBound - 1;
            monthBound = monthBound + 12 - 1;
          } else {
            monthBound = monthBound - 1;
          }
          date = new Date();
          date.setFullYear(yearBound);
          date.setMonth(monthBound);
          currentSteerDisplay = steerDisplay.filter(function(current){
            if(current.x > date){
              return current;
            }
          });
          currentHeiferDisplay = heiferDisplay.filter(function(current){
            if(current.x > date){
              return current;
            }
          });
          break;
        default:
          currentSteerDisplay = steerDisplay;
          currentHeiferDisplay = heiferDisplay;
      }

      switch(displayType) {
        case 'steer':
          return currentSteerDisplay;
        case 'heifer':
          return currentHeiferDisplay;
        default:
          return currentSteerDisplay;
      }
  });

  /*
   * @param type should be 'Steers' or 'Heifers'
   */
  getDataForType(auctionDataArray: any[], type, weightLowerBound){
    let typeData = [];
    auctionDataArray.forEach(function(current){
      if(current._class == type && (current.avg_weight <= (weightLowerBound+100) && current.avg_weight >= weightLowerBound)){
        typeData.push(current);
      }
    });
    return typeData;
  }


  loadChart(){

    const timeFormat = 'MM/DD/YYYY';

    this.lineChart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: "Price",
            fill: false,
            data: [],
            backgroundColor: "rgba(75,192,192, 1)",
            pointRadius: 1
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Average Price'
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              parser: timeFormat
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Average Price (Cwt)'
            }
          }]
        }
      }
    });

    this.auctionChartData$.filter(datasets => !isEmpty(datasets)).subscribe(datasets => {
      const ci = this.lineChart;
      ci.data.datasets[0].data = datasets;
      ci.update();
    });

  }

  changeRecordSort(sort){
    this.recordSort$.next(sort);
  }

  recordSorter(sortKey, recordArray: any[]){
    let sortedArray = [];
    if(sortKey == '_class' || sortKey == 'muscle_grade'){
      sortedArray = recordArray.sort(function (a, b) {
        if(a[sortKey] < b[sortKey]){
          return -1;
        }
        if(a[sortKey] > b[sortKey]){
          return 1;
        }
        return 0;
      });
    } else {
      sortedArray = recordArray.sort(function (a, b) {
        return a[sortKey] - b[sortKey];
      });
    }
    return sortedArray;

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

  changeDisplayTime(time){
    this.displayTime$.next(time);
  }

  changeWeightBound(weight){
    this.weightBound$.next(weight);
  }

  setTimeInfoForFiltering(currentDate){
    let date = currentDate;
    let displayTime = '';
    this.displayTime$.subscribe(time => displayTime = time);
    switch(displayTime){
      case 'all':
        //date.setFullYear(1970);
        break;
      case '1y':
        let year = currentDate.getFullYear();
        date.setFullYear(year-1);
        break;
      case '6m':
        let month = date.getMonth();
        month = month - 6;
        if(month<0){
          month = 12+month;
        }
        date.setMonth(month);
        break;
      case '1m':
        month = date.getMonth();
        month = month - 1;
        if(month<0){
          month = 12+month;
        }
        date.setMonth(month);
        break;
    }
  }

  presentTimePrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Time');

    alert.addInput({
      type: 'radio',
      label: '1 Month',
      value: '1m'
    });

    alert.addInput({
      type: 'radio',
      label: '6 Months',
      value: '6m'
    });

    alert.addInput({
      type: 'radio',
      label: '1 Year',
      value: '1y'
    });

    alert.addInput({
      type: 'radio',
      label: 'All',
      value: 'all'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
        this.changeDisplayTime(data);
      }
    });

    alert.present();
  }

  presentWeightPrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Weight');

    alert.addInput({
      type: 'radio',
      label: '300-400',
      value: '300'
    });

    alert.addInput({
      type: 'radio',
      label: '400-500',
      value: '400'
    });

    alert.addInput({
      type: 'radio',
      label: '500-600',
      value: '500'
    });

    alert.addInput({
      type: 'radio',
      label: '600-700',
      value: '600'
    });

    alert.addInput({
      type: 'radio',
      label: 'All',
      value: 'all'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
        this.changeWeightBound(+data);
      }
    });

    alert.present();
  }

  presentTypePrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Time');

    alert.addInput({
      type: 'radio',
      label: 'Feeder',
      value: 'feeder',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Steers',
      value: 'steers'
    });

    alert.addInput({
      type: 'radio',
      label: 'Heifers',
      value: 'heifer'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
      }
    });

    alert.present();
  }

}

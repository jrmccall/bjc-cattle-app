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


  auction: any;
  lineChart: any;
  iconType: string = "md-female";

  slug_id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private _libraryActions: LibraryActions) {
    this.slug_id = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuctionPage');

    this.loadChart();
  }

  auctionInfo$: Observable<any> = this.auctionTableData$.map((auctionTable: any) => {
    if(auctionTable == null){
      return null;
    }
    return auctionTable[this.slug_id];
  });

  /* todo: develop an organized way of organizing historical data for all the desired groupings */

  /* This is to separate the raw aucton data into two groups: steers and heifers */

  steerData$: Observable<any[]> = this.auctionData$.map(
    (auctionData: any) => {
      if(auctionData == null){
        return [];
      }
      let steers = [];
      if(auctionData.hasOwnProperty(this.slug_id)){
        let currentAuctionData = auctionData[this.slug_id].results;
        steers = this.getDataForType(currentAuctionData, 'Steers');
      } else {
        return [];
      }

      return steers;
  });

  heiferData$: Observable<any[]> = this.auctionData$.map(
    (auctionData: any) => {
      if(auctionData == null){
        return [];
      }
      let heifers = [];
      if(auctionData.hasOwnProperty(this.slug_id)){
        let currentAuctionData = auctionData[this.slug_id].results;
        heifers = this.getDataForType(currentAuctionData, 'Heifers');
      } else {
        return [];
      }

      return heifers;
    });

  /* This is to the data for the steers and heifers individually to display on the chart
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
    (steerDisplay: any[], heiferDisplay: any[], displayType: string) => {
      if(isEmpty(steerDisplay) || isEmpty(heiferDisplay)){
        return [];
      }

      switch(displayType) {
        case 'steer':
          return steerDisplay;
        case 'heifer':
          return heiferDisplay;
        default:
          return steerDisplay;
      }
  });

  /*
   * @param type should be 'Steers' or 'Heifers'
   */
  getDataForType(auctionDataArray: any[], type){
    let typeData = [];
    auctionDataArray.forEach(function(current){
      if(current._class == type){
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

  presentTimePrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Time');

    alert.addInput({
      type: 'radio',
      label: '1 Day',
      value: '1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: '1 Week',
      value: '2'
    });

    alert.addInput({
      type: 'radio',
      label: '1 Month',
      value: '1 month'
    });

    alert.addInput({
      type: 'radio',
      label: '6 Months',
      value: '6 months'
    });

    alert.addInput({
      type: 'radio',
      label: '1 Year',
      value: '1 year'
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

  presentTestPrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Time');

    alert.addInput({
      type: 'radio',
      label: '1',
      value: '1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: '2',
      value: '2'
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

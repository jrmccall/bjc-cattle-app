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

  //@ViewChild('chartCanvas') chartCanvas;

  @select(['library', 'togglecurrency']) togglecurrency$: Observable<string>;
  @select(['library', 'auctionTableData']) auctionTableData$: Observable<any>;


  auction: any;
  lineChart: any;
  dataset1: any = {
    'data': [
      {
        'x': 1534716265,
        'y': 1
      },
      {
        'x': 1534802665,
        'y': 9
      }
    ]
  };
  dataset2: any = {
    "data": [
      {
        'x': 1534802665,
        'y': 9
      },
      {
        'x': 1534716265,
        'y': 2
      }
    ]
  };

  dataset: any;
  slug_id: string;

  data$: BehaviorSubject<ChartTest[]> = new BehaviorSubject<ChartTest[]>(this.dataset1);

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private _libraryActions: LibraryActions) {
    this.slug_id = this.navParams.data;
  }

  auctionInfo$: Observable<any> = this.auctionTableData$.map((auctionTable: any) => {
    if(auctionTable == null){
      return null;
    }
    return auctionTable[this.slug_id];
  });

  datasetO$: Observable<ChartTest[]> = this.getDataSet();

  dataset$: Observable<ChartTest[]> = this.data$.map((dataset: ChartTest[]) => {
    if(isEmpty(dataset)){
      return [];
    }
    return dataset;
  });


  ionViewDidLoad() {
    console.log('ionViewDidLoad AuctionPage');

    this.loadChart();
  }


  loadChart(){

    // const timeFormat = 'MM/DD/YYYY HH:mm';
    //
    // this.lineChart = new Chart(this.chartCanvas.nativeElement, {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {
    //         label: "Price",
    //         fill: false,
    //         data: this.dataset1.data,
    //         backgroundColor: "rgba(75,192,192, 1)",
    //         pointRadius: 1
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         time: {
    //           parser: timeFormat
    //         }
    //       }]
    //     }
    //   }
    // });

    // this.dataset$.filter(datasets => !isEmpty(datasets)).subscribe(datasets => {
    //   const ci = this.lineChart;
    //   ci.data.datasets[0].data = datasets;
    //   ci.update();
    // });

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
        this.getFakeData(data);
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
        //this.testRadioOpen = false;
        //this.testRadioResult = data;
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
        this.getFakeData(data);
        //this.testRadioOpen = false;
        //this.testRadioResult = data;
      }
    });

    alert.present();
  }

  getFakeData(code: number){
    console.log(code);
    if(code == 1){
      //1 day
      this.data$.next(this.dataset1);
      this.lineChart.update();
    } else if(code == 2){
      //1 week
      this.dataset1 = this.dataset2;
      this.loadChart();
      this.data$.next(this.dataset2);
      //this.lineChart.update();
      console.log(this.datasetO$);
      console.log(this.dataset$);
      console.log(this.data$);
    }
  }

  getDataSet(): Observable<ChartTest[]> {
    console.log(this.dataset1);
    return Observable.of(this.dataset1.data);
  }

}

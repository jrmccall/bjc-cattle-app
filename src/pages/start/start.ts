import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Rx";
import {select} from "@angular-redux/store";
import {LibraryActions} from "../../library/library.actions";
import {HomePage} from "../home/home";
import {isEmpty} from "ramda";
import {MarsAllReports} from "../../library/mars-all-reports.model";
import {AuctionDataUtility} from "../../utility/auctionDataUtility";

/**
 * todo: Clean up removal of auction info table provider
 * todo: Work with transportation json data
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  @select(['library', 'isLoading']) isLoading$: Observable<any>;
  @select(['library', 'sequenceNumber']) sequenceNumber$: Observable<any>;
  @select(['library', 'MARSData']) MARSData$: Observable<any>;
  @ select(['library', 'auctionTableData']) auctionTable$: Observable<any>;

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private _libraryActions: LibraryActions, public auctionUtility: AuctionDataUtility) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
    /* Use sequence number to define states for the retrieval of data
      * Initial state: loadAll has not returned and it may or may not have been dispatched yet
      * State 1: loadAll has returned successfully -> the auction data can be retrieved using the results of the loadAll
      * State 2: the retrieved data is being processed for use in the app
      * State 3: auctionData has been processed -> the app can process the state data (auction data is needed to process state data)
      * State 4: state data has been processed -> the app can move on to the home page
    */
    this.sequenceNumber$.distinctUntilChanged().subscribe(sequenceNumber => {
      if(sequenceNumber == 0){
        console.log("initial state --> loadAll has not yet returned");
      } else if(sequenceNumber == 1){
        console.log("State 1 --> loadAll has returned, time to get the auction data");
        this.executeGetJSONData();
        this.executeGetAuctionData();
      } else if(sequenceNumber == 2){
        console.log("State 2 --> auctionData has returned, time to process the data");
        this.executeDataProcessing();
      } else if(sequenceNumber==3){
        console.log("State 3 --> globalAuctionData processed, time to process the statedata");
        this.executeStateDataProcessing();
      } else if(sequenceNumber == 4){
        console.log("Auction data processed and stored successfully");
        this.setRootHomePage();
      }
    });
  }

  auctionList$: Observable<MarsAllReports[]> = this.MARSData$.map((reports: MarsAllReports[]) => {
    if(isEmpty(reports)){
      return null;
    }
    return reports.filter(function(currentReport, index, reportList) {
      if(currentReport.market_types.findIndex(
          function(currentMarketType, index, marketTypeList) {
            return currentMarketType =='Live Auction'
          }) != -1) {
        return currentReport;
      }
    });
  });

  auctionInfoList$: Observable<any[]> = Observable.combineLatest(
    this.auctionList$,
    this.auctionTable$,
    (auctions: MarsAllReports[], auctionTable: any) => {
      if(isEmpty(auctions)){
        return null;
      }
      let auctionFinalList = auctions.map(function(current, index, list){
        let auctionInfo = auctionTable[current.slug_id];
        console.log(current.slug_id);
        console.log(auctionInfo);
        return auctionInfo;
      }).sort(function(a,b){
        if(a.state > b.state){
          return 1;
        } else if(a.state < b.state){
          return -1;
        } else{
          return 0;
        }
      });
      return auctionFinalList;
    });



  executeGetAuctionData(){
    console.log("execute");
    let slugList = this.makeSlugList();
    this._libraryActions.getAuctionData(slugList)
  }

  executeDataProcessing(){
    let processedAuctionData: Observable<any> = this.auctionUtility.executeAuctionDataProcessing();
    let processed = null;
    processedAuctionData.subscribe(data => {
      console.log(data);
      processed = data;
    });
    this._libraryActions.setGlobalAuctionData(processed);
  }

  executeStateDataProcessing(){
    let stateData$: Observable<any> = this.auctionUtility.executeStateGroupingProcessing();
    let stateData = null;
    stateData$.subscribe(data => {
      console.log(data);
      stateData = data;
    });
    this._libraryActions.setStateData(stateData);
  }

  executeGetJSONData(){

  }

  setRootHomePage(){
    this.navCtrl.setRoot(HomePage);
  }

  makeSlugList(){
    let auctions = [];
    this.auctionList$.subscribe(data => auctions = data);
    console.log(auctions);
    return auctions.map(function(current){
      return current.slug_id;
    });
  }

}

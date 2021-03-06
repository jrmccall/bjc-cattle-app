
import {select} from "@angular-redux/store";
import {Observable} from "rxjs/Rx";
import {isEmpty} from "ramda";

export class AuctionDataUtility {

  @select(['library', 'auctionData']) rawAuctionData$: Observable<any>;
  @select(['library', 'auctionTableData']) auctionTable$: Observable<any>;
  @select(['library', 'globalAuctionData']) globalAuctionData$: Observable<any>;

  constructor(){

  }

  /* TODO: Begin formatting the data
    *
    *[*] 1) Filter out everything but heifers and steers -> use _class field
    *[*] 2) Get global data for each exchange
    *[*] 3) Maybe get global data for each state
    *[*] 4) Data needs to be posted to library
    *
  */

  /*The idea here is that we want only heifers and steers, so drop all records of anything else*/

  executeAuctionDataProcessing(){
    let filteredAuctionData$ = this.filterForCommodity();
    let globalAuctionData$ = this.getGlobalData(filteredAuctionData$);

    return globalAuctionData$;
  }

  executeStateGroupingProcessing(){
    let stateData$ = this.organizeByState();
    return stateData$;
  }

  filterForCommodity(){
    let filteredAuctionData$: Observable<any> = this.rawAuctionData$.map((auctionData: any) => {
      if(auctionData == null){
        return null;
      }

      let key = '';
      let filteredMap = {};
      for(key in auctionData){
        let results = auctionData[key].results;
        let filteredList = results.filter(function (current) {
          if(current._class == 'Steers' || current._class == 'Heifers'){
            return current;
          }
        });
        //console.log(filteredList);
        let auctionDataMap = {};
        auctionDataMap['results'] = filteredList;
        if(!isEmpty(filteredList)){
          filteredMap[key] = auctionDataMap;
        }

      }
      return filteredMap;
    });
    return filteredAuctionData$;
  }

  getGlobalData(auctionData$: Observable<any>){
    let globalAuctionData$: Observable<any> = auctionData$.map((auctionData: any) => {
      if(auctionData == null){
        return null;
      }

      let auctionGlobalMap = {};
      let key = '';
      for(key in auctionData){
        let steerAverage = 0;
        let heiferAverage = 0;
        let steerMedian = 0;
        let heiferMedian = 0;
        let steerArr = [];
        let heiferArr = [];

        let steerMinPrice = 1000000000;
        let steerMaxPrice = 0;
        let steerMinWeight = 1000000000;
        let steerMaxWeight = 0;

        let heiferMinPrice = 100000000;
        let heiferMaxPrice = 0;
        let heiferMinWeight = 1000000000;
        let heiferMaxWeight = 0;

        let results = auctionData[key].results;
        let lastReportDate = results[0].report_date;
        //let priceUnitArr = [];  /* todo: develop a more dynamic system that will make sure there are no other price units */
        results.forEach(function (current) {
          switch(current._class){
            case 'Steers':
              if(current.report_date==lastReportDate){

                if(+current.avg_weight <= 500 && +current.avg_weight >= 400){
                  steerArr.push(+current.avg_price);

                  if(steerMinPrice > +current.avg_price){
                    steerMinPrice = +current.avg_price;
                  }
                  if(steerMaxPrice < +current.avg_price){
                    steerMaxPrice = +current.avg_price;
                  }

                  if(steerMinWeight > +current.avg_weight){
                    steerMinWeight = +current.avg_weight;
                  }
                  if(steerMaxWeight < +current.avg_weight){
                    steerMaxWeight = +current.avg_weight;
                  }
                }
              }
              break;

            case 'Heifers':
              if(current.report_date==lastReportDate){


                if(+current.avg_weight <= 500 && +current.avg_weight >= 400){
                  heiferArr.push(+current.avg_price);

                  if(heiferMinPrice > +current.avg_price){
                    heiferMinPrice = +current.avg_price;
                  }
                  if(heiferMaxPrice < +current.avg_price){
                    heiferMaxPrice = +current.avg_price;
                  }

                  if(heiferMinWeight > +current.avg_weight){
                    heiferMinWeight = +current.avg_weight;
                  }
                  if(heiferMaxWeight < +current.avg_weight){
                    heiferMaxWeight = +current.avg_weight;
                  }
                }
              }
              break;
          }
        });
        steerAverage = this.calculateMean(steerArr);
        steerMedian = this.calculateMedian(steerArr);
        heiferAverage = this.calculateMean(heiferArr);
        heiferMedian = this.calculateMedian(heiferArr);

        let auctionDataMap = {
          results: results,
          steerAvgPrice: steerAverage,
          heiferAvgPrice: heiferAverage,
          steerMedPrice: steerMedian,
          heiferMedPrice: heiferMedian,
          heiferCount: heiferArr.length,
          steerCount: steerArr.length,
          lastReportDate: lastReportDate,
          priceUnit: auctionData[key].price_unit,
          steerMinPrice: steerMinPrice,
          steerMaxPrice: steerMaxPrice,
          steerMinWeight: steerMinWeight,
          steerMaxWeight: steerMaxWeight,
          heiferMinPrice: heiferMinPrice,
          heiferMaxPrice: heiferMaxPrice,
          heiferMinWeight: heiferMinWeight,
          heiferMaxWeight: heiferMaxWeight
        };
        auctionGlobalMap[key] = auctionDataMap;
      }
      return auctionGlobalMap;
    });
    return globalAuctionData$;
  }

  calculateMedian(array: number[]){
    if(isEmpty(array)){
      return 0;
    }
    array.sort(function(a,b){
      return a-b;
    });
    let median = 0;
    let middle = array.length/2;
    console.log(middle);
    if(middle%1 != 0){  /* If the result is a fraction due to an odd number of elements --> the middle element is then 0.5 higher than the value of middle */
      middle -= 0.5;
      median = array[middle];
    } else {  /* If the result is a not a fraction due to an even number of elements */
      let m1 = array[middle];
      let m2 = array[middle-1];
      median = (m1+m2)/2;
    }
    return median;
  }

  calculateMean(array: number[]){
    if(isEmpty(array)){
      return 0;
    }
    let mean = 0;
    let numberOfElements = array.length;
    array.forEach(function (current) {
      mean += current;
    });
    mean = mean/numberOfElements;
    return mean;
  }

  /* ---------------------- State Data Stuff ------------------------------ */

  organizeByState(){
    let stateOrg$: Observable<any> = Observable.combineLatest(
      this.globalAuctionData$,
      this.auctionTable$,
      (auctionData: any, auctionTable: any) => {
        if(auctionData == null || auctionTable == null){
          return null;
        }

        let stateMap = {};
        let key = '';
        for(key in auctionData){
          if(auctionData.hasOwnProperty(key) && auctionTable.hasOwnProperty(key)) {
            let stateCode = auctionTable[key].state;
            if(!stateMap.hasOwnProperty(stateCode)){
              let stateList = [];
              stateList.push(auctionTable[key]);
              stateMap[stateCode] = {
                auctions: stateList,
                steerAvgPrice: 0,
                heiferAvgPrice: 0,
                count: 0,
                steerMedian: 0,
                heiferMedian: 0,
                name: stateCode
              }
            } else {
              stateMap[stateCode].auctions.push(auctionTable[key]);
            }
          }
        }
        let stateKey = '';
        for(stateKey in stateMap){
          if(stateMap.hasOwnProperty(stateKey)){
            this.getStateAvgAndMedian(stateMap[stateKey], auctionData);
          }
        }
        console.log(stateMap);
        return stateMap;
    });
    return stateOrg$;
  }

  getStateAvgAndMedian(state: any, auctionData: any){
    let steerAvgsForState = [];
    let heiferAvgsForState = [];
    state.auctions.forEach(function(current){
      steerAvgsForState.push(auctionData[current.slug_id].steerAvgPrice);
      heiferAvgsForState.push(auctionData[current.slug_id].heiferAvgPrice);
    });
    state.steerAvgPrice = this.calculateMean(steerAvgsForState);
    state.heiferAvgPrice = this.calculateMean(heiferAvgsForState);
    state.steerMedian = this.calculateMedian(steerAvgsForState);
    state.heiferMedian = this.calculateMedian(heiferAvgsForState);
    state.count = state.auctions.length;

  }

  findAverageOfState(state: any, auctionData: any){
    console.log(state);
    let steerAverage = 0;
    let heiferAverage = 0;
    let auctionNumber = 0;
    state.auctions.forEach(function(current){
      if(isNaN(auctionData[current.slug_id].steerAvgPrice)){

      }
      steerAverage += auctionData[current.slug_id].steerAvgPrice;
      heiferAverage += auctionData[current.slug_id].heiferAvgPrice;
      auctionNumber++;
    });

    steerAverage = steerAverage/auctionNumber;
    heiferAverage = heiferAverage/auctionNumber;

    state.steerAvgPrice = steerAverage;
    state.heiferAvgPrice = heiferAverage;

  }



}

import { Injectable } from '@angular/core';
import { LoadingController } from "ionic-angular";
import {AuctionTableRecord} from "../library/auction-table-record.model";
import {select} from "@angular-redux/store";
import {Observable} from "rxjs/Rx";


@Injectable()
export class AuctionInfoTableProvider {

  constructor() {

  }

  private makeTable(){
    let auctionTable = {};
    let auctionList = this.makeAuctionTableRecords();
    auctionList.forEach(function(currentAuction, index, auctionList){
      auctionTable[currentAuction.slug_id] = currentAuction;
    });
    console.log(auctionTable);
    return auctionTable;
  }

  private makeAuctionTableRecords(){
    let auctionList = [];

    let auction1214: AuctionTableRecord = {
      slug_id: "1214",
      name: "Unionville Livestock Market, Inc Market",
      address: "28598 US Highway 136",
      city: "Unionville",
      state: "MO",
      zip: "63565"
    };
    auctionList.push(auction1214);

    let auction1237: AuctionTableRecord = {
      slug_id: "1237",
      name: "Unionville Livestock Market, Inc Market",
      address: "28598 US Highway, 136",
      city: "Unionville",
      state: "MO",
      zip: "63565"
    };
    auctionList.push(auction1237);

    let auction1215: AuctionTableRecord = {
      slug_id: "1215",
      name: "Springfield Livestock Marketing Center Market",
      address: "5914, 6821 W Independence Dr",
      city: "Springfield",
      state: "MO",
      zip: "65802"
    };
    auctionList.push(auction1215);

    let auction1255: AuctionTableRecord = {
      slug_id: "1255",
      name: "Springfield Livestock Marketing Center Market",
      address: "5914, 6821 W Independence Dr",
      city: "Springfield",
      state: "MO",
      zip: "65802"
    };
    auctionList.push(auction1255);

    let auction1221: AuctionTableRecord = {
      slug_id: "1221",
      name: "New Cambria Livestock Auction Market",
      address: "29262 MO-149",
      city: "New Cambria",
      state: "MO",
      zip: "63558"
    };
    auctionList.push(auction1221);

    let auction1235: AuctionTableRecord = {
      slug_id: "1235",
      name: "New Cambria Livestock Auction Market",
      address: "29262 MO-149",
      city: "New Cambria",
      state: "MO",
      zip: "63558"
    };
    auctionList.push(auction1235);

    let auction1248: AuctionTableRecord = {
      slug_id: "1248",
      name: "New Cambria Livestock Auction Market",
      address: "29262 MO-149",
      city: "New Cambria",
      state: "MO",
      zip: "63558"
    };
    auctionList.push(auction1248);

    let auction1226: AuctionTableRecord = {
      slug_id: "1226",
      name: "Joplin Regional Stockyards Market",
      address: "10131 Cimarron Rd",
      city: "Carthage",
      state: "MO",
      zip: "64836"
    };
    auctionList.push(auction1226);

    let auction1245: AuctionTableRecord = {
      slug_id: "1245",
      name: "Joplin Regional Stockyards Market",
      address: "10131 Cimarron Rd",
      city: "Carthage",
      state: "MO",
      zip: "64836"
    };
    auctionList.push(auction1245);

    let auction1229: AuctionTableRecord = {
      slug_id: "1229",
      name: "Ozarks Regional Stockyards Market",
      address: "3292 US Hwy 63",
      city: "West Plains",
      state: "MO",
      zip: "65775"
    };
    auctionList.push(auction1229);

    let auction1249: AuctionTableRecord = {
      slug_id: "1249",
      name: "Ozarks Regional Stockyards Market",
      address: "3292 US Hwy 63",
      city: "West Plains",
      state: "MO",
      zip: "65775"
    };
    auctionList.push(auction1249);

    let auction1651: AuctionTableRecord = {
      slug_id: "1651",
      name: "Ozarks Regional Stockyards Market",
      address: "3292 US Hwy 63",
      city: "West Plains",
      state: "MO",
      zip: "65775"
    };
    auctionList.push(auction1651);

    let auction1231: AuctionTableRecord = {
      slug_id: "1231",
      name: "Green City Livestock Auction Market",
      address: "19037 MO-129",
      city: "Green City",
      state: "MO",
      zip: "64545"
    };
    auctionList.push(auction1231);

    let auction1234: AuctionTableRecord = {
      slug_id: "1234",
      name: "Green City Livestock Auction Market",
      address: "19037 MO-129",
      city: "Green City",
      state: "MO",
      zip: "64545"
    };
    auctionList.push(auction1234);

    let auction1254: AuctionTableRecord = {
      slug_id: "1254",
      name: "Green City Livestock Auction Market",
      address: "19037 MO-129",
      city: "Green City",
      state: "MO",
      zip: "64545"
    };
    auctionList.push(auction1254);

    let auction1276: AuctionTableRecord = {
      slug_id: "1276",
      name: "OKC West Market",
      address: "7200 Rte 66",
      city: "El Reno",
      state: "OK",
      zip: "73036"
    };
    auctionList.push(auction1276);

    let auction1278: AuctionTableRecord = {
      slug_id: "1278",
      name: "OKC West Market",
      address: "7200 Rte 66",
      city: "El Reno",
      state: "OK",
      zip: "73036"
    };
    auctionList.push(auction1278);

    let auction1280: AuctionTableRecord = {
      slug_id: "1280",
      name: "OKC West Market",
      address: "7200 Rte 66",
      city: "El Reno",
      state: "OK",
      zip: "73036"
    };
    auctionList.push(auction1280);

    let auction1281: AuctionTableRecord = {
      slug_id: "1281",
      name: "OKC West Market",
      address: "7200 Rte 66",
      city: "El Reno",
      state: "OK",
      zip: "73036"
    };
    auctionList.push(auction1281);

    // let auction1276: AuctionTableRecord = {
    //   slug_id: "1276",
    //   name: "Oklahoma National Stockyards Market",
    //   address: "2501 Exchange Ave",
    //   city: "Oklahoma City",
    //   state: "OK",
    //   zip: "73108"
    // };
    // auctionList.push(auction1276);
    //
    // let auction1278: AuctionTableRecord = {
    //   slug_id: "1278",
    //   name: "Oklahoma National Stockyards Market",
    //   address: "2501 Exchange Ave",
    //   city: "Oklahoma City",
    //   state: "OK",
    //   zip: "73108"
    // };
    // auctionList.push(auction1278);
    //
    // let auction1280: AuctionTableRecord = {
    //   slug_id: "1280",
    //   name: "Oklahoma National Stockyards Market",
    //   address: "2501 Exchange Ave",
    //   city: "Oklahoma City",
    //   state: "OK",
    //   zip: "73108"
    // };
    // auctionList.push(auction1280);

    let auction1290: AuctionTableRecord = {
      slug_id: "1290",
      name: "Santa Teresa Livestock Auction",
      address: "107 Cattlemens Dr, 8808",
      city: "Santa Teresa",
      state: "NM",
      zip: "88008"
    };
    auctionList.push(auction1290);

    let auction1418: AuctionTableRecord = {
      slug_id: "1418",
      name: "Columbia Livestock Market",
      address: "4557 US-441",
      city: "Lake City",
      state: "FL",
      zip: "32025"
    };
    auctionList.push(auction1418);

    let auction1420: AuctionTableRecord = {
      slug_id: "1420",
      name: "Townsend Livestock Market",
      address: "387 Southeast Bandit Street",
      city: "Madison",
      state: "FL",
      zip: "32340"
    };
    auctionList.push(auction1420);

    let auction1419: AuctionTableRecord = {
      slug_id: "1419",
      name: "Okeechobee Market",
      address: "1055 US-98",
      city: "Okeechobee",
      state: "FL",
      zip: "34972"
    };
    auctionList.push(auction1419);

    let auction1608: AuctionTableRecord = {
      slug_id: "1608",
      name: "Okeechobee Livestock Auction (Mon)",
      address: "1055 US-98",
      city: "Okeechobee",
      state: "FL",
      zip: "34972"
    };
    auctionList.push(auction1608);

    let auction1421: AuctionTableRecord = {
      slug_id: "1421",
      name: "Sumter County Farmers Market",
      address: "524 N Market Blvd",
      city: "Webster",
      state: "FL",
      zip: "33597"
    };
    auctionList.push(auction1421);

    let auction1422: AuctionTableRecord = {
      slug_id: "1422",
      name: "Arcadia Market",
      address: "2719 Earnest St",
      city: "Arcadia",
      state: "FL",
      zip: "34266"
    };
    auctionList.push(auction1422);

    let auction1609: AuctionTableRecord = {
      slug_id: "1609",
      name: "Arcadia Market",
      address: "2719 Earnest St",
      city: "Arcadia",
      state: "FL",
      zip: "34266"
    };
    auctionList.push(auction1609);

    let auction1423: AuctionTableRecord = {
      slug_id: "1423",
      name: "North Florida Livestock Market",
      address: "12171 US-441",
      city: "Lake City",
      state: "FL",
      zip: "32025"
    };
    auctionList.push(auction1423);

    let auction1424: AuctionTableRecord = {
      slug_id: "1424",
      name: "Ocala Livetock Market",
      address: "9100 NW Highway 25A",
      city: "Ocala",
      state: "FL",
      zip: "34482"
    };
    auctionList.push(auction1424);

    let auction1510: AuctionTableRecord = {
      slug_id: "1510",
      name: "St Joseph Stockyards Market",
      address: "4603 Packers Ave",
      city: "St Joseph",
      state: "MO",
      zip: "64504"
    };
    auctionList.push(auction1510);

    let auction1511: AuctionTableRecord = {
      slug_id: "1511",
      name: "St Joseph Stockyards Market",
      address: "4603 Packers Ave",
      city: "St Joseph",
      state: "MO",
      zip: "64504"
    };
    auctionList.push(auction1511);

    let auction1512: AuctionTableRecord = {
      slug_id: "1512",
      name: "St Joseph Stockyards Market",
      address: "4603 Packers Ave",
      city: "St Joseph",
      state: "MO",
      zip: "64504"
    };
    auctionList.push(auction1512);

    let auction1607: AuctionTableRecord = {
      slug_id: "1607",
      name: "Lakeland Market",
      address: "200 N Kentucky Ave",
      city: "Lakeland",
      state: "FL",
      zip: "33801"
    };
    auctionList.push(auction1607);

    let auction1621: AuctionTableRecord = {
      slug_id: "1621",
      name: "Windsor Livestock Auction",
      address: "1173 MO-52",
      city: "Windsor",
      state: "MO",
      zip: "65360"
    };
    auctionList.push(auction1621);

    let auction1622: AuctionTableRecord = {
      slug_id: "1622",
      name: "Windsor Livestock Auction",
      address: "1173 MO-52",
      city: "Windsor",
      state: "MO",
      zip: "65360"
    };
    auctionList.push(auction1622);

    return auctionList;
  }

  public getAuctionTable(){
    console.log("getAuctionTable");
    return this.makeTable();
  }


}

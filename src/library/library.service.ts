import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {IGlobalData} from "./global-data.model";
import {MarsAllReports} from "./mars-all-reports.model";

const mars_api_url = 'https://marsapi.ams.usda.gov/services/v1/reports';
const mars_api_key = 'YEULfkcsaG9Mgs7aV4KDgcHUKUQuOxD4';
const mars_test_key = 'mars_test_343343';
const password = '';
declare const coins_api_url;

@Injectable()
export class LibraryService {

  constructor(private httpClient: HttpClient) {
  }

  getMARSData(): Observable<MarsAllReports[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(mars_api_key + ':' + password),
        'cache-control': 'no-cache'
      })
    };
    return this.httpClient.get<any>(mars_api_url, httpOptions);
  }

  getTransportationJSON(){
    let json = this.httpClient.get('../../assets/json/transportation-cost.json');
    json.subscribe(data => {
      console.log(data);
    });
    return json;

  }

  getAuctionTable(){
    let json = this.httpClient.get('../../assets/json/auction-table.json');
    json.subscribe(data => {
      console.log(data);
    });
    return json;
  }

  getUserConfig(){
    let json = this.httpClient.get('../../assets/json/user-config.json');
    json.subscribe(data => {
      console.log(data);
    });
    return json;
  }

  getAuctionData(slugIds){
    console.log("get auction data");
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(mars_api_key + ':' + password),
        'cache-control': 'no-cache'
      })
    };
    let responses = [];
    let urls = [];
    slugIds.forEach(function(current){
      urls.push(mars_api_url+'/'+current);
    });
    let httpClient = this.httpClient;

    /* Try 2 - put observables in a list and then forkJoin them IT WORKS WOOHOO PTL */
    urls.forEach(function(current){
      responses.push(httpClient.get(current, httpOptions));
    });
    //console.log(responses);
    let testResponses = [];
    for(let i=0; i<5; i++){
      testResponses.push(responses[i]);
    }

    let responses$ = Observable.forkJoin(testResponses).map((data: any[]) => {
      let responseTable = {};
      console.log(data);
      data.forEach(function(current, index) {
        responseTable[slugIds[index]] = current;
      });
      return responseTable;
    });

    responses$.subscribe(
      values => {
        console.log(values);
      }
    );
    return responses$;
  }


}

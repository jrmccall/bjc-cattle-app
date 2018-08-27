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

  getGlobalData(): Observable<IGlobalData> {
    return this.httpClient.get<IGlobalData>('https://api.coinmarketcap.com/v1/global/'); //.map((response: Response) => response.json());
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
}

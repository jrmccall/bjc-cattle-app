import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../store/root.reducer';
import {AjaxTrio} from '../shared/ajaxTrio.class';
import {ChartTest} from "./chart-test.model";
import {AuctionInfoTableProvider} from "../providers/auction-info-table-provider";


@Injectable()
export class LibraryActions {

  static readonly LOAD_ALL = new AjaxTrio(
    'LOAD_ALL',
    'Loading library...',
    'Failed to load library'
  );

  static readonly GET_AUCTION_DATA = new AjaxTrio(
    'GET_AUCTION_DATA',
    'Loading auction data...',
    'Failed to load auction data'
  );

  static readonly SET_GLOBAL_AUCTION_DATA =
    'SET_GLOBAL_AUCTION_DATA';

  static readonly SET_STATE_DATA =
    'SET_STATE_DATA';

  static readonly SET_AUCTION_TABLE =
    'SET_AUCTION_TABLE';

  static readonly SET_USER_CONFIG =
    'SET_USER_CONFIG';


  constructor(private _ngRedux: NgRedux<IAppState>, private auctionInfo: AuctionInfoTableProvider) {
  }

  loadAll() {
    AjaxTrio.dispatchRequestAction(
      this._ngRedux, LibraryActions.LOAD_ALL, {});
  }

  getAuctionData(slugIds: string[]){
    AjaxTrio.dispatchRequestAction(
      this._ngRedux, LibraryActions.GET_AUCTION_DATA, {slugIds});
  }

  setGlobalAuctionData(globalAuctionData: any){

    this._ngRedux.dispatch({
      type: LibraryActions.SET_GLOBAL_AUCTION_DATA,
      payload: {globalAuctionData}
    });

  }

  setStateData(stateData: any){

    this._ngRedux.dispatch({
      type: LibraryActions.SET_STATE_DATA,
      payload: {stateData}
    });

  }

  setUserConfig(userConfig: any){

    this._ngRedux.dispatch({
      type: LibraryActions.SET_USER_CONFIG,
      payload: {userConfig}
    });

  }

}

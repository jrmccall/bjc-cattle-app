import {IAction} from '../store/root.reducer';
import {LibraryActions} from './library.actions';
import {ChartTest} from "./chart-test.model";
import {IGlobalData} from "./global-data.model";
import {MarsAllReports} from "./mars-all-reports.model";

export interface ILibraryState {
  error: any;
  isLoading: boolean;
  sequenceNumber: number;
  MARSData: MarsAllReports[];
  auctionTableData: any;
  auctionData: any;
  globalAuctionData: any;
  stateData: any;
  transportationData: any;
  userConfig: any;
}

export const INITIAL_STATE: ILibraryState = {
  error: null,
  isLoading: false,
  sequenceNumber: 0,
  MARSData: [],
  auctionTableData: null,
  auctionData: null,
  globalAuctionData: null,
  stateData: null,
  transportationData: null,
  userConfig: null
};

export const libraryReducer = (state: ILibraryState = INITIAL_STATE, action: IAction): ILibraryState => {
  console.log("LibraryReducer");
  switch (action.type) {
    case LibraryActions.LOAD_ALL.SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        sequenceNumber: 1,
        MARSData: action.payload.MARSData,
        transportationData: action.payload.transportationData,
        auctionTableData: action.payload.auctionTable,
        userConfig: action.payload.userConfig
      };
    case LibraryActions.LOAD_ALL.REQUEST:
      return {...state, error: null, isLoading: true};
    case LibraryActions.LOAD_ALL.ERROR:
      return {...state, error: action.payload.error, isLoading: false};
    case LibraryActions.GET_AUCTION_DATA.SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        sequenceNumber: 2,
        auctionData: action.payload.auctionData
      };
    case LibraryActions.GET_AUCTION_DATA.REQUEST:
      return {...state, error: null, isLoading: true};
    case LibraryActions.GET_AUCTION_DATA.ERROR:
      return {...state, error: action.payload.error, isLoading: false};
    case LibraryActions.SET_AUCTION_TABLE:
      return {...state, auctionTableData: action.payload.auctionTableData, isLoading: false};
    case LibraryActions.SET_GLOBAL_AUCTION_DATA:
      return {...state, globalAuctionData: action.payload.globalAuctionData, isLoading: false, sequenceNumber: 3};
    case LibraryActions.SET_STATE_DATA:
      return {...state, stateData: action.payload.stateData, sequenceNumber: 4};
    default:
      return state;
  }
};

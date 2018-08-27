import {IAction} from '../store/root.reducer';
import {LibraryActions} from './library.actions';
import {ChartTest} from "./chart-test.model";
import {IGlobalData} from "./global-data.model";
import {MarsAllReports} from "./mars-all-reports.model";

export interface ILibraryState {
  error: any;
  isLoading: boolean;
  datasetTest: ChartTest[];
  globalData: IGlobalData;
  MARSData: MarsAllReports[];
}

export const INITIAL_STATE: ILibraryState = {
  error: null,
  isLoading: false,
  datasetTest: [],
  globalData: null,
  MARSData: []
};

export const libraryReducer = (state: ILibraryState = INITIAL_STATE, action: IAction): ILibraryState => {
  console.log("LibraryReducer");
  switch (action.type) {
    case LibraryActions.LOAD_ALL.SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        globalData: action.payload.globalData,
        MARSData: action.payload.MARSData
      };
    case LibraryActions.LOAD_ALL.REQUEST:
      return {...state, error: null, isLoading: true};
    case LibraryActions.LOAD_ALL.ERROR:
      return {...state, error: action.payload.error, isLoading: false};
    case LibraryActions.SET_DATASETTEST:
      return {...state, datasetTest: action.payload.datasetTest, isLoading: false};
    default:
      return state;
  }
};

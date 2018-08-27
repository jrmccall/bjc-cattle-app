import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../store/root.reducer';
import {AjaxTrio} from '../shared/ajaxTrio.class';
import {ChartTest} from "./chart-test.model";


@Injectable()
export class LibraryActions {

  static readonly LOAD_ALL = new AjaxTrio(
    'LOAD_ALL',
    'Loading library...',
    'Failed to load library'
  );

  static readonly SET_DATASETTEST =
    'SET_DATASETTEST';


  constructor(private _ngRedux: NgRedux<IAppState>) {
  }

  loadAll() {
    AjaxTrio.dispatchRequestAction(
      this._ngRedux, LibraryActions.LOAD_ALL, {});
  }

  setDatasetTest(datasetTest: ChartTest[]){

    this._ngRedux.dispatch({
      type: LibraryActions.SET_DATASETTEST,
      payload: {datasetTest}
    });

  }

}

import {Injectable} from '@angular/core';
import {AjaxTrio} from '../shared/ajaxTrio.class';
import {IAction} from '../store/root.reducer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/switchMap';
import {LibraryService} from './library.service';
import 'rxjs/add/observable/forkJoin';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LibraryEpics {

  constructor(private _service: LibraryService) {
  }

  loadAll(ajaxTrio: AjaxTrio) {
    return action$ => action$
      .ofType(ajaxTrio.REQUEST)
      .switchMap((a: IAction) =>
        Observable.forkJoin(
          this._service.getMARSData(),
          this._service.getTransportationJSON(),
          this._service.getAuctionTable(),
          this._service.getUserConfig()
        )
          .map((data: any[]) => AjaxTrio.getSuccessAction(
            ajaxTrio,
            {
              MARSData: data[0],
              transportationData: data[1],
              auctionTable: data[2],
              userConfig: data[3]
            }
          ))
          .catch(response => [AjaxTrio.getErrorAction(ajaxTrio, response.status)])
      );
  }

  getAuctionData(ajaxTrio: AjaxTrio) {
    return action$ => action$
      .ofType(ajaxTrio.REQUEST)
      .switchMap((a: IAction) => this._service.getAuctionData(a.payload.slugIds)
        .map((auctionData: any[]) => AjaxTrio.getSuccessAction(ajaxTrio, {auctionData}))
        .catch(response => [AjaxTrio.getErrorAction(ajaxTrio, response.status)])
      );
  }

}

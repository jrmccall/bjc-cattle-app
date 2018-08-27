import {NgRedux} from '@angular-redux/store';
//import {any, merge, isNil} from 'ramda';

import {IAppState, IAction} from '../store/root.reducer';

/**
 * Helper class to manage the 3 possible phases of an ajax request:
 * 1. the request has been made
 * 2. the request returned successfully
 * 3. the request failed and returned an error
 */
export class AjaxTrio {

  // the action type
  // (e.g., 'LOAD_SAILORS')
  private _actionType: string;
  get actionType(): string {
    return this._actionType;
  }

  // the action type string to indicate that the request has been made
  // (e.g., 'LOAD_SAILORS_REQUEST')
  private _REQUEST: string;
  get REQUEST(): string {
    return this._REQUEST;
  }

  // the action type string to indicate that the request returned successfully
  // (e.g., 'LOAD_SAILORS_SUCCESS')
  private _SUCCESS: string;
  get SUCCESS(): string {
    return this._SUCCESS;
  }

  // the action type string to indicate that the request failed
  // (e.g., 'LOAD_SAILORS_ERROR')
  private _ERROR: string;
  get ERROR(): string {
    return this._ERROR;
  }

  // message to display when the request is started
  // (e.g., 'Loading sailors...')
  private _requestMessage: string;
  get requestMessage(): string {
    return this._requestMessage;
  }

  // message to display when the request returns successfully
  // (e.g., 'Successfully loaded sailors')
  // Note, may be null, which indicates no success message should be displayed (i.e., quiet success)
  private _successMessage: string;
  get successMessage(): string {
    return this._successMessage;
  }

  // message to display when the request fails
  // (e.g., 'Could not load sailors')
  private _errorMessage: string;
  get errorMessage(): string {
    return this._errorMessage;
  }

  /**
   * Dispatches a web-service request
   * @param state Redux state
   * @param dispatch Redux store dispatch function
   * @param ajaxTrio
   * @returns {boolean}
   */
  static dispatchRequestAction(ngRedux: NgRedux<IAppState>, ajaxTrio: AjaxTrio, payload: any = {}) {

    // const state: IAppState = ngRedux.getState();
    //
    // // if there is already a pending request, don't re-request
    // const isSameActionType: (a: Alert) => boolean = (a: Alert) => a.id === ajaxTrio.actionType;
    // const isInfoAlert: (a: Alert) => boolean = (a: Alert) => a.type === AlertType.info;
    // const alertAlreadyExists: (a: Alert) => boolean = (a: Alert) => isSameActionType(a) && isInfoAlert(a);
    // if (any(alertAlreadyExists)(state.alerts)) {
    //   return;
    // }

    ngRedux.dispatch({
      type: ajaxTrio.REQUEST,
      payload
    });
  }

  /**
   * Returns an action representing successful return from a web-service request
   * @param ajaxTrio
   * @param payload Payload to send, usually data from server
   */
  static getSuccessAction(ajaxTrio: AjaxTrio, payload: any): IAction {
    return {
      type: ajaxTrio.SUCCESS,
      payload
    };
  }

  /**
   * Returns an action representing an error returned from a web-service request
   * @param ajaxTrio
   * @param err Additional error message from server (i.e., details of the failure beyond 'Could not load sailors')
   */
  static getErrorAction(ajaxTrio: AjaxTrio, err: string): IAction {
    return {
      type: ajaxTrio.ERROR,
      payload: {
        error: `${ajaxTrio.errorMessage}: ${err}`
      }
    };
  }

  /**
   * Constructor
   * @param actionType The action type (e.g., 'LOAD_SAILORS')
   * @param requestMessage Message to display when the request is made (e.g., 'Loading sailors...')
   * @param successMessage Message to display when the request returns successfully (e.g., 'Successfully loaded sailors')
   * @param errorMessage Message to display when the request fails (e.g., 'Could not get sailors')
   */
  constructor(actionType: string, requestMessage: string, errorMessage: string, successMessage: string = null) {

    this._actionType = actionType;
    this._requestMessage = requestMessage;
    this._successMessage = successMessage;
    this._errorMessage = errorMessage;

    // capitalize actionType
    const PREFIX: string = actionType.toUpperCase();

    // create the REQUEST, SUCCESS, and ERROR action type strings
    this._REQUEST = `${PREFIX}_REQUEST`;
    this._SUCCESS = `${PREFIX}_SUCCESS`;
    this._ERROR = `${PREFIX}_ERROR`;
  }
}

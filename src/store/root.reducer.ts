import {combineReducers, Reducer} from 'redux';
import {ILibraryState, libraryReducer} from '../library/library.reducer';

export interface IAction {
  type: string;
  payload?: any;
}

export interface IAppState{
  library?: ILibraryState;
}

/**
 * Root reducer for redux store
 * @type {Reducer<IAppState>}
 */
export const rootReducer: Reducer<IAppState> = combineReducers<IAppState>({
  library: libraryReducer
});


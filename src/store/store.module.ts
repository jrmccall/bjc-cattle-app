import { NgModule } from '@angular/core';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';

// Redux ecosystem stuff.
import { createLogger } from 'redux-logger';
import { createEpicMiddleware} from 'redux-observable';
import { applyMiddleware, createStore, compose} from "redux";

// The top-level reducers and epics that make up our app's logic.
import { rootReducer, IAppState } from './root.reducer';
import { RootEpics } from './root.epics';

@NgModule({
  imports: [NgReduxModule],
  providers: [RootEpics],
})
export class StoreModule {
  constructor(
    public store: NgRedux<IAppState>,
    devTools: DevToolsExtension,
    rootEpics: RootEpics) {

    const epicMiddleware = createEpicMiddleware();
    const appliedMiddleware = applyMiddleware(epicMiddleware);

    //Testing some things
    // const reduxStore = createStore(rootReducer, {}, createLogger());
    //epicMiddleware.run(rootEpics.combineEpics());
    //store.provideStore(reduxStore);

    store.configureStore(
      rootReducer,
      {},
      [
        createLogger(),
        epicMiddleware
      ],
      [devTools.isEnabled() ? devTools.enhancer() : f => f]
    );
    console.log("Back from configuring store");
    epicMiddleware.run(rootEpics.combineEpics());
  }
}

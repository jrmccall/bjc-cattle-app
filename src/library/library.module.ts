import {NgModule} from '@angular/core';
import {LibraryActions} from './library.actions';
import {LibraryService} from './library.service';
import {LibraryEpics} from './library.epics';

@NgModule({
  providers: [LibraryActions, LibraryService, LibraryEpics],
})
export class LibraryModule {
}

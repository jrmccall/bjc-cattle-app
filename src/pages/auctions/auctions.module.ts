import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuctionsPage } from './auctions';

@NgModule({
  declarations: [
    AuctionsPage,
  ],
  imports: [
    IonicPageModule.forChild(AuctionsPage),
  ],
})
export class AuctionsPageModule {}

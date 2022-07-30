import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LateralEntryPageRoutingModule } from './lateral-entry-routing.module';
import { LateralEntryPage } from './lateral-entry.page';

 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LateralEntryPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LateralEntryPage]
})
export class LateralEntryPageModule {}

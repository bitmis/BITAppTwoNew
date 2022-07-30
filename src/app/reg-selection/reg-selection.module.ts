import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegSelectionPageRoutingModule } from './reg-selection-routing.module';

import { RegSelectionPage } from './reg-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegSelectionPageRoutingModule
  ],
  declarations: [RegSelectionPage]
})
export class RegSelectionPageModule {}

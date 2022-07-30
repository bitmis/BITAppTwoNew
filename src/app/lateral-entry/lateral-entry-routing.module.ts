import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LateralEntryPage } from './lateral-entry.page';

const routes: Routes = [
  {
    path: '',
    component: LateralEntryPage
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LateralEntryPageRoutingModule {}

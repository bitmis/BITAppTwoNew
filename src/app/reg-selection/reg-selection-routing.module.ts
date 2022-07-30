import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegSelectionPage } from './reg-selection.page';

const routes: Routes = [
  {
    path: '',
    component: RegSelectionPage
  },
  {
    path: 'lateral-entry',
    loadChildren: () => import('../lateral-entry/lateral-entry.module').then( m => m.LateralEntryPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegSelectionPageRoutingModule {}

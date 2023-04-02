import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEnterprisePage } from './modal-enterprise.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEnterprisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEnterprisePageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from "./list/list.component";
import { DetailsComponent } from "./details/details.component";
import { CreateComponent } from "./create/create.component";
import { BonDetailsComponent } from './bon-details/bon-details.component';
import { BonStatusComponent } from './bon-status/bon-status.component';
import { OrdersComponent } from './listeBonstatus/orders.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: "details/:id",
    component: DetailsComponent
  },
  {
    path: "bondetails/:id",
    component: BonDetailsComponent
  },
  {
    path: "modifier/:id",
    component: CreateComponent
  },
  {
    path: "create",
    component: CreateComponent
  },
  {
    path: "status/:id",
    component: BonStatusComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonRoutingModule {

}

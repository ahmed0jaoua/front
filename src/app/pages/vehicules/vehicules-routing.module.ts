import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages

import { ListjsComponent } from './Liste/list.component'; 

const routes: Routes = [

  {
    path: "list",
    component: ListjsComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class VehiculesRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages

import { SiegeComponent } from './list/siege.component'; 

const routes: Routes = [

  {
    path: "list",
    component: SiegeComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SiegesRoutingModule { }

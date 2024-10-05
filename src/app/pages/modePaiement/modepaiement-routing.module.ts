import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModePaiementComponent } from './create/modepaiement.component'; 
const routes: Routes = [


  {
    path: 'list',
    component: ModePaiementComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModePaiementRoutingModule { }


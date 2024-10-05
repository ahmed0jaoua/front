import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypePaiementComponent } from './create/typepaiment.component';
const routes: Routes = [


  {
    path: 'list',
    component: TypePaiementComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypePaiementRoutingModule { }


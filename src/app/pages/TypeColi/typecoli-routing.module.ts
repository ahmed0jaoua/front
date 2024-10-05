import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeColiComponent } from './create/typecoli.component';
const routes: Routes = [


  {
    path: 'list',
    component: TypeColiComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateurRoutingModule { }

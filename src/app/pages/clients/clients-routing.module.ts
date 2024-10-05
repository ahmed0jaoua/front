import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './liste/clients.component';
import { DetailsComponent } from './details/details.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [


  {
    path: "listeClients",
    component: CustomersComponent
  },

  {
    path: "clientProfile",
    component: DetailsComponent
  },
  {
    path: "clientProfile/:id",
    component: DetailsComponent
  },
  {
    path: "edit/:id",
    component: SettingsComponent,
  },
  {
    path: "ajouter",
    component: SettingsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { ListesComponent } from "./Listes/listes.component";
import { DetailsComponent } from './details/details.component';
import { CreateComponent } from './createPaiement/create.component';
import { ListesEntrantsComponent } from './ListesEntrant/listesEntrants.component';
import { BonStatusComponent } from './bon-status/bon-status.component';
import { StatutFicheSortantComponent } from './statutFicheSortant/statutfichesortant.component';

const routes: Routes = [


  {

    path: "listes",
    component: ListesComponent
  },

  {

    path: "listesEntrants",
    component: ListesEntrantsComponent
  },

  {

    path: "create",
    component: CreateComponent
  },
  {
    path: "details/:id",
    component: DetailsComponent
  },
  {
    path: "statusArticles/:id",
    component: BonStatusComponent
  },
  {
    path: "statusficheSortant/:id",
    component: StatutFicheSortantComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages

import { ChauffeurComponent } from './list/chauffeur.component';
import { SettingsComponent } from './settings/settings.component';
import { UpdateComponent } from './update/update.component';
import { TeamComponent } from './team/team.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
   
  // {
  //   path: "list",
  //   component: ChauffeurComponent
  // },
  {
    path: "details/:id",
    component: DetailsComponent
  },
  {
    path: "list",
    component: TeamComponent
  }, {
    path: "ajouter",
    component: SettingsComponent
  }, {
    path: "edit/:id",
    component: UpdateComponent
  }
  , {
    path: "liste",
    component: TeamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ChauffeursRoutingModule { }

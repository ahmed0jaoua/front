import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";


const routes: Routes = [
  {
    path: "",
    component: DashboardComponent
  },
  {
    path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
  },
  {
    path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  },
  {
    path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)
  },
  {
    path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
  },
  {
    path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
  },
  {
    path: 'typecoli', loadChildren: () => import('./TypeColi/typecoli.module').then(m => m.TypeColiModule)
  },
  {
    path: 'typepaiment', loadChildren: () => import('./typePaiement/typepaiment.module').then(m => m.TypePaimentModule)
  },
  {
    path: 'modepaiment', loadChildren: () => import('./modePaiement/modepaiement.module').then(m => m.ModePaimentModule)
  },
  {
    path: 'facture', loadChildren: () => import('./Facture/facture.module').then(m => m.FactureModule)
  },
  {
    path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule)
  },
  {
    path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule)
  },
  {
    path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule)
  },
  {
    path: 'suiviColis', loadChildren: () => import('./suiviColis/suivicolis.module').then(m => m.SuiviColisModule)
  },
  {
    path: 'paiement', loadChildren: () => import('./Paiement/paiement.module').then(m => m.PaiementModule)
  },
  {
    path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
  },
  {
    path: 'pages', loadChildren: () => import('./extrapages/extraspages.module').then(m => m.ExtraspagesModule)
  },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  {
    path: 'advance-ui', loadChildren: () => import('./advance-ui/advance-ui.module').then(m => m.AdvanceUiModule)
  },
  {
    path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule)
  },
  {
    path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
  },
  {
    path: 'utilisateur', loadChildren: () => import('./utilisateur/utilisateur.module').then(m => m.UtilisateurModule)
  },

  {
    path: 'sieges', loadChildren: () => import('./siege/sieges.module').then(m => m.SiegesModule)
  },
  {
    path: 'vehicules', loadChildren: () => import('./vehicules/vehicules.module').then(m => m.VehiculesModule)
  },

  {
    path: 'chauffeurs', loadChildren: () => import('./chauffeur/chauffeurs.module').then(m => m.ChauffeursModule)
  },
  {
    path: 'clients', loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
  },

  {
    path: 'bon', loadChildren: () => import('./bonLivraison/bon.module').then(m => m.BonModule)
  },
  {
    path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
  },
  {
    path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
  },
  {
    path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
  },
  {
    path: 'marletplace', loadChildren: () => import('./nft-marketplace/nft-marketplace.module').then(m => m.NftMarketplaceModule)
  },
  {
    path: 'fichederoute', loadChildren: () => import('./fichederoute/ficheroute.module').then(m => m.FicherouteModule)
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

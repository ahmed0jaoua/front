import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ExtraPagesRoutingModule } from '../extrapages/extrapages-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPipesModule } from 'ngx-pipes';
import { SettingsComponent } from '../clients/settings/settings.component';
import { DetailsComponent } from '../clients/details/details.component';
import { CountUpModule } from 'ngx-countup';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { BonRoutingModule } from '../bonLivraison/bon-routing.module';
import { NgxPrintModule } from 'ngx-print';



@NgModule({
  declarations: [
    SettingsComponent, DetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, NgbPaginationModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbTooltipModule,
    SlickCarouselModule,
    NgSelectModule,
    FlatpickrModule,
    ExtraPagesRoutingModule,
    SharedModule,
    NgPipesModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    CountUpModule,
    FeatherModule.pick(allIcons),
    BonRoutingModule,
   
    
   
   NgxPrintModule
  ]
})
export class ProfileClientModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Ng Search 
import { NgPipesModule } from 'ngx-pipes';

// Load Icon
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Component pages
import { ChauffeursRoutingModule } from './chauffeurs-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { ChauffeurComponent } from './list/chauffeur.component';

// Sorting page
import { NgbdListSortableHeader } from './list/list-sortable.directive'
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExtraPagesRoutingModule } from '../extrapages/extrapages-routing.module';
import { CountUpModule } from 'ngx-countup';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { BonRoutingModule } from '../bonLivraison/bon-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { DetailsComponent } from './details/details.component';
import { UpdateComponent } from './update/update.component';
import { TeamComponent } from './team/team.component';

@NgModule({
  declarations: [

    ChauffeurComponent,
    NgbdListSortableHeader, SettingsComponent, DetailsComponent, UpdateComponent,TeamComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule,
    ChauffeursRoutingModule,
    SharedModule,
    SimplebarAngularModule,
    NgPipesModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbTooltipModule,
    SlickCarouselModule,
    NgSelectModule,
    ExtraPagesRoutingModule,
    CountUpModule,
    FeatherModule.pick(allIcons),
    BonRoutingModule,], providers: [provideHttpClient(withInterceptorsFromDi()),DecimalPipe]

})





export class ChauffeursModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}

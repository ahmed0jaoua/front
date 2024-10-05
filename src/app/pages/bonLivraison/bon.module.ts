import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbNavModule, NgbAccordionModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Counter
import { CountUpModule } from 'ngx-countup';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Component pages
import { BonRoutingModule } from './bon-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DetailsComponent } from './details/details.component';
import { CreateComponent } from './create/create.component';

import { NgbNavModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BonDetailsComponent } from './bon-details/bon-details.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ExtraPagesRoutingModule } from '../extrapages/extrapages-routing.module';
import { BonStatusComponent } from './bon-status/bon-status.component';
import { NgxPrintModule } from 'ngx-print';
import { OrdersComponent } from './listeBonstatus/orders.component';

@NgModule({
  declarations: [
    DetailsComponent,
    ListComponent,
    CreateComponent,BonDetailsComponent,BonStatusComponent,OrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    CountUpModule, NgbAccordionModule,
    FlatpickrModule,
    FeatherModule.pick(allIcons),
    BonRoutingModule,
    SharedModule, NgbNavModule, NgSelectModule,
    NgbTooltipModule,
    SlickCarouselModule,
    ExtraPagesRoutingModule,NgxPrintModule
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BonModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}

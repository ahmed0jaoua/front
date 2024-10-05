import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dA } from '@fullcalendar/core/internal-common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';
import { FactureService } from 'src/app/core/services/facture.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';

@Component({
  selector: 'app-details',

  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})


export class DetailsComponent {


  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder, private BonlivraisonService: BonlivraisonService,
    public service: PaginationService, private route: ActivatedRoute,
    private store: Store<{ data: RootReducerState }>, private FactureService: FactureService) {
  }
  facture: any = {};
  client: any = {};


  defaultSiege: any;

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.defaultSiege = currentUser.sitepardefaut;

    this.FactureService.getFactureById(id).subscribe((data: any) => {
      this.facture = data;
      this.client = data.client;

    });

    // this.BonlivraisonService.getficheDeRoutebyId(id).subscribe((data: any) => {
    //   this.ficheDeRoute = data;
    // });

  }
  cl() {
    console.log(this.facture);
  }
}

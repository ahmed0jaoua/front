import { Component, OnInit, ViewChild } from '@angular/core';

// Swiper Slider
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

import { document, projectList } from 'src/app/core/data';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { projectListModel, documentModel } from './details.model';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/core/services/client.service'; 
import { InvoiceListModel } from 'src/app/store/Invoice/invoice_model';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';
import { cloneDeep } from 'lodash';
import Swal from 'sweetalert2';
import { FactureService } from 'src/app/core/services/facture.service';
import { DecimalPipe } from '@angular/common';
import { OrdersService } from './client.service';
import { ListJsModel } from './client.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [OrdersService, DecimalPipe, FactureService]
})

/**
 * Profile Component
 */

export class DetailsComponent implements OnInit {

  projectList!: projectListModel[];
  document!: documentModel[];
  userData: any;
  allprojectList: any;
  breadCrumbItems!: Array<{}>;
  CustomersData!: InvoiceListModel[];
  masterSelected!: boolean;
  checkedList: any;
  // Api Data
  content?: any;
  econtent?: any;
  invoices?: any;
  allinvoices: any;
  searchResults: any;
  searchTerm: any;
  date: any;
  status: any = '';
  commandes: any[] = [];
  bons: any[] = [];
  allCommandes: any[] = [];
  originalbons: any[] = [];
  listeFactures: any[] = [];
  pageBon: any[] = [];
  static: any;
  totalRecords: number = 0;
  listJsData: any[] = [];
  ListJsDatas: any;
  ListJsList!: Observable<ListJsModel[]>;
  total: Observable<number>;
  page: any = 1;
  pageSize: any = 3;
  startIndex: number = 0;
  endIndex: number = 3;
  paginationDatas: any;
  etatFilter: string = '';
  constructor(private formBuilder: UntypedFormBuilder, private BonlivraisonService: BonlivraisonService, private ClientService: ClientService,
    private route: ActivatedRoute, public servicef: OrdersService, private modalService: NgbModal, private TokenStorageService: TokenStorageService, public service: PaginationService, private FactureService: FactureService) {
    this.ListJsList = servicef.countries$;
    this.total = servicef.total$;

    this.servicef.countries$.subscribe(data => {
      this.listeFactures = data;
      this.totalRecords = data.length;
      this.updatePagination();
    });
    
  }
   client :any ; 
  ngOnInit(): void {
    this.servicef.setEtatFilter(this.etatFilter); 
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.userData = currentUser;
    /**
     * Fetches the data
     */

    this.ClientService.getClient(id).subscribe((data: any) => {
    this.client = data;
    });

    this.fetchData();
    this.updatePagination();
    this.servicef.getFactures();

    this.FactureService.getFactureByIdClient(id).subscribe((data: any) => {
    this.listeFactures = data;
    });

    
    this.BonlivraisonService.findLivraisonByIdClient(id).subscribe((data: any) => {
      this.bons = data.ListLivraison;
      this.allinvoices = cloneDeep(data.ListLivraison);
      this.bons = this.service.changePage(this.allinvoices)
    });


    this.BonlivraisonService.getStatistiques().subscribe((data: any) => {
      this.static = data;

    });

    this.paginationDatas = this.listeFactures
    this.totalRecords = this.paginationDatas.length

    this.startIndex = (this.page - 1) * this.pageSize + 1;
    this.endIndex = (this.page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.paginationDatas = this.listeFactures.slice(this.startIndex - 1, this.endIndex);

  }


  // Trigger the search when the filter value changes
  triggerSearch() {
    this.servicef.setEtatFilter(this.etatFilter); // Pass the filter to your service
  }

  updatePagination() {
    this.startIndex = (this.page - 1) * this.pageSize;
    this.endIndex = this.page * this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.paginationDatas = this.listeFactures.slice(this.startIndex, this.endIndex);
  }

  getBadgeClassesc(statut: string): string {
    switch (statut) {
      case '0': return 'badge bg-danger-subtle text-danger';
      case '1': return 'badge bg-success-subtle text-success';
      default: return 'badge bg-danger-subtle text-danger'; 
    }
  }

  getStatusTextc(statut: number | string): string {
    const statusNumber = typeof statut === 'string' ? parseInt(statut, 10) : statut;


    switch (statusNumber) {
      case 0: return 'non Payé';
      case 1: return 'payé';  
      default: return 'N/A';
    }
  }
  getBadgeClassesca(statut: string): string {
    switch (statut) {
      case '0': return 'danger';
      case '1': return 'success';
      default: return 'danger';
    }
  }



  /**
   * Fetches the data
   */
  private fetchData() {
    this.document = document;
    this.projectList = projectList;
    this.allprojectList = projectList;
  }

  /**
   * Swiper setting
   */
  config = {
    slidesPerView: 3,
    initialSlide: 0,
    spaceBetween: 25,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      }
    }
  };

  // Pagination
  // changePage() {
  //   this.projectList = this.service.changePage(this.allprojectList)
  // }

  /**
   * Confirmation mail model
   */
  // deleteId: any;
  // confirm(content: any, id: any) {
  //   this.deleteId = id;
  //   this.modalService.open(content, { centered: true });
  // }

  // Delete Data
  // deleteData(id: any) {
  //   this.document.slice(id, 1)
  //   this.modalService.dismissAll()
  // }
  // deleteId: any;
  // confirm(content: any, id: any) {
  //   this.deleteId = id;
  //   this.modalService.open(content, { centered: true });
  // }


  // deleteData(id: any) {
  //   if (id) {
  //     this.store.dispatch(deleteInvoice({ id: this.deleteId.toString() }));
  //   } else {
  //     this.store.dispatch(deleteInvoice({ id: this.checkedValGet.toString() }));
  //   }

  //   this.deleteId = '';
  //   this.masterSelected = false;
  // }

  onDateChange() {
    // Ensure the date range is valid and contains both start and end dates

    console.log(this.bons)
    this.filterBonsByDateRange(this.date.from, this.date.to);

  }

  filterBonsByDateRange(from: Date | null, to: Date | null) {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    this.bons = this.allinvoices.filter((bon: any) => {
      const dateLivraison = new Date(bon.dateLivraison);

      if (fromDate && toDate) {


        return dateLivraison >= fromDate && dateLivraison <= toDate;
      } else if (fromDate) {


        return dateLivraison >= fromDate;
      } else if (toDate) {


        return dateLivraison <= toDate;
      } else {
               
        return  this.BonlivraisonService.getLivraisons().subscribe((data: any) => {
          this.bons = data;
          this.allinvoices = cloneDeep(data);
          this.bons = this.service.changePage(this.allinvoices)
        });
      }
    });

    console.log(this.bons);
  }


  /**
  * Multiple Delete
  */
  checkedValGet: any[] = [];
  // deleteMultiple(content: any) {
  //   var checkboxes: any = document.getElementsByName('checkAll');
  //   var result
  //   var checkedVal: any[] = [];
  //   for (var i = 0; i < checkboxes.length; i++) {
  //     if (checkboxes[i].checked) {
  //       result = checkboxes[i].value;
  //       checkedVal.push(result);
  //     }
  //   }
  //   if (checkedVal.length > 0) {
  //     this.modalService.open(content, { centered: true });
  //   }
  //   else {
  //     Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#299cdb', });
  //   }
  //   this.checkedValGet = checkedVal;
  // }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    /* this.bons.forEach((x: { id: any; }) => x.id = ev.target.checked)
     var checkedVal: any[] = [];
     var result
     for (var i = 0; i < this.invoices.length; i++) {
       if (this.invoices[i].state == true) {
         result = this.invoices[i];
         checkedVal.push(result);
       }
     }
     this.checkedValGet = checkedVal
     checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  */

  }

  // Select Checkbox value Get
  // onCheckboxChange(e: any) {
  //   var checkedVal: any[] = [];
  //   var result
  //   for (var i = 0; i < this.invoices.length; i++) {
  //     if (this.invoices[i].state == true) {
  //       result = this.invoices[i];
  //       checkedVal.push(result);
  //     }
  //   }
  //   this.checkedValGet = checkedVal
  //   checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  // }


  // Sort Data
  onSort(column: any) {
    this.bons = this.service.onSort(column, this.bons)
  }

  statusFilter() {
    if (this.status != '') {
      this.invoices = this.allinvoices.filter((invoice: any) => invoice.status == this.status);
    } else {
      this.invoices = this.allinvoices
    }
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    // this.orderes = this.allorderes.filter(country => country.status == status);

    if (changeEvent.nextId === 1) {

    }
    if (changeEvent.nextId === 2) {
      // this.orderes = this.allorderes.filter((order: any) => order.status == 'Delivered');
    }
    if (changeEvent.nextId === 3) {

    }
    if (changeEvent.nextId === 4) {

    }
    if (changeEvent.nextId === 5) {

    }
  }
  performSearch(): void {
    this.searchResults = this.allinvoices.filter((item: any) => {
      return (
        item.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.dateCreation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.utilisateur.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.expediteur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.adresseExpediteur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.adresseDestinataire.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.Destinataire.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.bons = this.service.changePage(this.searchResults)
  }

  changePage() {
    this.bons = this.service.changePage(this.allinvoices);
  }


  getStatusText(statut: number | string): string {
    const statusNumber = typeof statut === 'string' ? parseInt(statut, 10) : statut;


    switch (statusNumber) {
      case 0: return 'Créé';
      case 1: return 'En Cours';  // ou tout autre texte approprié
      case 2: return 'Livré';
      case 3: return 'Clôturé ';   // ou tout autre texte approprié
      default: return 'N/A';
    }
  }


  getBadgeClasses(statut: string): string {
    switch (statut) {
      case '0': return 'badge bg-danger-subtle text-danger';
      case '1': return 'badge bg-warning-subtle text-warning';
      case '2': return 'badge bg-success-subtle text-success';
      case '3': return 'badge bg-secondary-subtle text-secondary';
      default: return 'badge bg-secondary-subtle text-secondary'; // Valeur par défaut
    }
  }
}

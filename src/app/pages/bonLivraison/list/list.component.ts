import { Component, QueryList, ViewChildren } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';
// Sweet Alert
import Swal from 'sweetalert2';


import { restApiService } from "../../../core/services/rest-api.service";
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { deleteInvoice, fetchInvoiceListData } from 'src/app/store/Invoice/invoice_action';
import { selectInvoiceData, selectInvoiceLoading } from 'src/app/store/Invoice/invoice_selector';
import { cloneDeep } from 'lodash';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { InvoiceListModel } from 'src/app/store/Invoice/invoice_model';
import { ModePaiementService } from 'src/app/core/services/mode-paiement.service';
import { PaiementService } from 'src/app/core/services/paiement.service';
import { SiegeService } from 'src/app/core/services/siege.service';
import { number } from 'echarts';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

/**
 * List Component
 */
export class ListComponent {

  // bread crumb items
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
  listeMode: any[] = [];
  pageBon: any[] = [];
  static: any;
  datep: any;
  isEditMode: boolean = false;
  montant: number = 0;
  selectedsiege: any;
  selectedMode: any;
  listSiges: any;

  constructor(private modalService: NgbModal, public service: PaginationService,
    private formBuilder: UntypedFormBuilder, private restApiService: restApiService,
    private store: Store<{ data: RootReducerState }>, private datePipe: DatePipe,
    private ModePaiementService: ModePaiementService,
    private BonlivraisonService: BonlivraisonService,
    private SiegeService: SiegeService,
    private PaiementService: PaiementService) {
  }


  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Bon Livraison ' },
      { label: 'List', active: true }
    ];

    /**
     * fetches data
     */

    this.BonlivraisonService.getLivraisons().subscribe((data: any) => {
      this.bons = data.ListLivraison;
      this.allinvoices = cloneDeep(data.ListLivraison);
      this.bons = this.service.changePage(this.allinvoices);
      this.originalbons = data.ListLivraison;
    });




    this.BonlivraisonService.getStatistiques().subscribe((data: any) => {
      this.static = data;

    });

    this.ModePaiementService.getModePaiement().subscribe(data => {
      this.listeMode = data;

    });

    this.SiegeService.getSieges().subscribe((data: any[]) => {
      this.listSiges = data;
    });

  }
  getPaiementParLiv(id: any) {

    this.PaiementService.getPaiements(id).subscribe((data: any) => {
      this.totalPaiement = Number(data.totalMontant);
    });
  }
  ajoutpaiement() {

    const paiementData = {
      montant: this.montant,
      idMode: this.selectedMode.id,
      datep: this.datep,
      idLivraison: this.idlivP,
      idSiege: this.selectedsiege.id
    }

    this.PaiementService.ajouterpaiment(paiementData).subscribe(response => {
      Swal.fire({
        title: 'succés',
        text: 'paiement crée avec succés ',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.closeModal();
      this.BonlivraisonService.getLivraisons().subscribe((data: any) => {
        this.bons = data.ListLivraison;
        this.allinvoices = cloneDeep(data.ListLivraison);
        this.bons = this.service.changePage(this.allinvoices);
        this.originalbons = data.ListLivraison;
      });
    }, error => {
      console.error('Error saving data', error);

      Swal.fire({
        title: 'Erreur!',
        text: error.status,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });


  }
  closeModal() {
    this.modalService.dismissAll();
    this.selectedMode = null;
    this.montant = 0;
    this.selectedsiege = null;
    this.datep = '';
  }
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };

  /**
   * Confirmation mail model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  idlivP: any;
  totalPaiement: number = 0;
  totalfrais: number = 0;
  openModal(content: any, id: any, totalfrais: any) {
    this.idlivP = id;
    this.modalService.open(content, { centered: true });
    this.getPaiementParLiv(id);
    this.totalfrais = totalfrais;
  }
  montantInvalid: boolean = false;

  validateMontant() {
    console.log((Number(this.totalfrais) - Number(this.totalPaiement)));
    if (Number(this.montant) > (Number(this.totalfrais) - Number(this.totalPaiement))) {
      this.montantInvalid = true;
      console.log('true');
    } else {
      this.montantInvalid = false;
      console.log('false');
    }
  }
  deleteData(id: any) {
    if (id) {
      this.store.dispatch(deleteInvoice({ id: this.deleteId.toString() }));
    } else {
      this.store.dispatch(deleteInvoice({ id: this.checkedValGet.toString() }));
    }

    this.deleteId = '';
    this.masterSelected = false;
  }

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

        return this.BonlivraisonService.getLivraisons().subscribe((data: any) => {
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
  deleteMultiple(content: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    var result
    var checkedVal: any[] = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    if (checkedVal.length > 0) {
      this.modalService.open(content, { centered: true });
    }
    else {
      Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#299cdb', });
    }
    this.checkedValGet = checkedVal;
  }

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
  onCheckboxChange(e: any) {
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
  }


  // Sort Data
  onSort(column: any) {
    this.bons = this.service.onSort(column, this.bons)
  }
  filteredbons: any;
  statusFilter() {
    let filteredBOns = this.allinvoices;
    if (this.status !== '') {
      filteredBOns = this.allinvoices.filter((bon: any) => bon.statut == this.status);
    } else {
      filteredBOns = this.allinvoices;
    }
    this.bons = filteredBOns;
    // Reset to the first page when filtering

    this.bons = this.service.changePage(this.bons);
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
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();

      // Filter the invoices based on search term
      this.searchResults = this.allinvoices.filter((item: any) => {
        return (
          (item.reference?.toLowerCase().includes(searchLower) || '') ||
          (item.dateCreation?.toLowerCase().includes(searchLower) || '') ||
          (item.utilisateur?.prenom?.toLowerCase().includes(searchLower) || '') ||
          (item.expediteur?.toLowerCase().includes(searchLower) || '') ||
          (item.adresseExpediteur?.toLowerCase().includes(searchLower) || '') ||
          (item.adresseDestinataire?.toLowerCase().includes(searchLower) || '') ||
          (item.Destinataire?.toLowerCase().includes(searchLower) || '')
        );
      });

      // Update the bons array with search results and apply pagination
      this.bons = this.service.changePage(this.searchResults);
      this.allinvoices = cloneDeep(this.searchResults);
 // Check the length of the filtered and paginated list
    } else {
      // If no search term, reset the bons to the original list and apply pagination
      this.bons = this.service.changePage(this.originalbons);
      this.allinvoices = cloneDeep(this.originalbons);
      console.log(this.originalbons); // Ensure the length is back to the original data size
    }
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

  getStatusTextP(statut: number | string): string {
    const statusNumber = typeof statut === 'string' ? parseInt(statut, 10) : statut;


    switch (statusNumber) {
      case 0: return 'non payée';
      case 2: return 'payée';  
      case 1: return 'en progression';  
      default: return 'N/A';
    }
  }

  getBadgeClassesP(statut: string): string {
    switch (statut) {
      case '0': return 'badge bg-danger-subtle text-danger';
      case '1': return 'badge bg-warning-subtle text-warning';
      case '2': return 'badge bg-success-subtle text-success';
      default: return 'badge bg-secondary-subtle text-secondary'; // Valeur par défaut
    }
  }
}

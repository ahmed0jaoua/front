import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

// Csv File Export
import { ngxCsv } from 'ngx-csv/ngx-csv';
// Rest Api Service
import { restApiService } from "../../../core/services/rest-api.service";
import { addOrder, deleteOrder, fetchorderListData, updateOrder } from 'src/app/store/Ecommerce/ecommerce_action';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { selectDataLoading, selectOrderData } from 'src/app/store/Ecommerce/ecommerce_selector';
import { cloneDeep } from 'lodash';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';
import { FactureService } from 'src/app/core/services/facture.service';
import { SiegeService } from 'src/app/core/services/siege.service';
import { PaiementService } from 'src/app/core/services/paiement.service';
import { ModePaiementService } from 'src/app/core/services/mode-paiement.service';

@Component({
  selector: 'app-orders',
  templateUrl: './listes.component.html',
  styleUrls: ['./listes.component.scss'],
  providers: [DecimalPipe]
})

/**
 * Orders Component
 */
export class ListesComponent {

  
  breadCrumbItems!: Array<{}>;
  ordersForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;
  checkedList: any;
  customerName?: any;

  Pending = 'Pending';
  Inprogress = 'Inprogress';
  Cancelled = 'Cancelled';
  Pickups = 'Pickups';
  Returns = 'Returns';
  Delivered = 'Delivered';
  payment: any = '';
  date: any;
  status: any = '';

  // Api Data
  content?: any;
  econtent?: any;
  orderes?: any;
  page: any = 1;
  pageSize: any = 8;

  allorderes: any;
  searchResults: any;
  searchTerm: any;
  defaultSiege: any;
  currentUser: any;
  listSiges: any; 
  montant: any;
  datep: any;
  selectedMode: any;
  selectedsiege: any;
  listeMode: any; 
  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder,
    private BonlivraisonService: BonlivraisonService,
    private ModePaiementService: ModePaiementService,
    private PaiementService: PaiementService, 
    public service: PaginationService,
    private FactureService: FactureService, 
    private SiegeService: SiegeService ,
    private store: Store<{ data: RootReducerState }>) {
  }
  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'facture' },
      { label: 'liste', active: true }
    ];

    /**
     * Form Validation
     */
    this.ordersForm = this.formBuilder.group({
      orderId: "#VZ2101",
      ids: [''],
      customer: ['', [Validators.required]],
      product: ['', [Validators.required]],
      orderDate: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      payment: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
    this.ModePaiementService.getModePaiement().subscribe(data => {
      this.listeMode = data;

    });
    // Fetch Data
    this.store.dispatch(fetchorderListData());
    this.store.select(selectDataLoading).subscribe((data) => {
      if (data == false) {
        document.getElementById('elmLoader')?.classList.add('d-none');
      }
    });

    this.store.select(selectOrderData).subscribe((data) => {
      this.orderes = data;
      this.allorderes = cloneDeep(data);
      this.orderes = this.service.changePage(this.allorderes)
    });
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.currentUser = currentUser;
    this.defaultSiege = currentUser.sitepardefaut;
    // this.BonlivraisonService.getFicheDeRoute(this.defaultSiege.id).subscribe((data: any) => {

    //   this.orderes = data.ListFiches;
    //   this.allorderes = cloneDeep(data.ListFiches);
    //   this.orderes = this.service.changePage(this.allorderes)
    // });

    this.SiegeService.getSieges().subscribe((data: any[]) => {
      this.listSiges = data;
    });
    this.FactureService.getAllFactures().subscribe((data: any) => {
      this.orderes = data;
      this.allorderes = cloneDeep(data);
      this.orderes = this.service.changePage(this.allorderes)
    });
  }
  closeModal() {
    this.modalService.dismissAll();
    this.selectedMode = null;
    this.montant = 0;
    this.selectedsiege = null;
    this.datep = '';
  }
  idFac: any; 
  openModal(content: any, id: any, totalfrais: any) {
    this.idFac = id;
    this.modalService.open(content, { size: 'lg', centered: true });
    //this.getPaiementParLiv(id);    , totalfrais: any
   // this.totalfrais = totalfrais;
  }
  totalPaiement: number = 0;
  totalfrais: number = 0;
  getPaiementParLiv(id: any) {

    this.PaiementService.getPaiements(id).subscribe((data: any) => {
      this.totalPaiement = Number(data.totalMontant);
    });
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

  getStatusTextP(statut: number | string): string {
    const statusNumber = typeof statut === 'string' ? parseInt(statut, 10) : statut;


    switch (statusNumber) {
      case 0: return 'non payée';
      case 2: return 'payée';
      case 1: return 'en progression';
      default: return 'N/A';
    }
  }

  getBadgeClassesP(statut: number): string {
    switch (statut) {
      case 0: return 'badge bg-danger-subtle text-danger';
      case 1: return 'badge bg-warning-subtle text-warning';
      case 2: return 'badge bg-success-subtle text-success';
      default: return 'badge bg-secondary-subtle text-secondary'; // Valeur par défaut
    }
  }
  ajoutpaiement() {

    const paiementData = {
      montant: this.montant,
      idMode: this.selectedMode.id,
      datep: this.datep,
      idFac: this.idFac,
      idSiege: this.selectedsiege.id
    }

    this.PaiementService.ajouterpaimentFacture(paiementData).subscribe(response => {
      Swal.fire({
        title: 'succés',
        text: 'paiement crée avec succés ',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    
      this.closeModal();
      this.FactureService.getAllFactures().subscribe((data: any) => {
        this.orderes = data;
        this.allorderes = cloneDeep(data);
        this.orderes = this.service.changePage(this.allorderes)
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
  test() {
    console.log(this.orderes);
  }
  changePage() {
    this.orderes = this.service.changePage(this.allorderes)
  }

  onSort(column: any) {
    this.orderes = this.service.onSort(column, this.orderes)
  }

  // Search Data
  performSearch(): void {
    this.searchResults = this.allorderes.filter((item: any) => {
      return (
        item.client.code?.toString().includes(this.searchTerm.toLowerCase()?? '') || // Convert fiche_id to string for comparison
        item.numeroFacture?.toLowerCase().includes(this.searchTerm.toLowerCase() ??'' ) // Convert fiche_id to string for comparison

      );
    });
  

    this.orderes = this.service.changePage(this.searchResults);
  }

  /**
    * change navigation
    */
  onNavChange(changeEvent: NgbNavChangeEvent) {
    // this.orderes = this.allorderes.filter(country => country.status == status);

    if (changeEvent.nextId === 1) {
      this.orderes = this.allorderes ;
    }
    if (changeEvent.nextId === 2) {
      this.orderes = this.allorderes.filter((fiche: any) => fiche.etat == '1');
    }
    if (changeEvent.nextId === 3) {
      this.orderes = this.allorderes.filter((fiche: any) => fiche.etat == '2');
    }
    if (changeEvent.nextId === 4) {
      this.orderes = this.allorderes.filter((fiche: any) => fiche.etat == '3');
    }
  
  }

  /**
 * Delete Model Open
 */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
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
      Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#239eba', });
    }
    this.checkedValGet = checkedVal;
  }

  // Delete Data
  deleteData (){
    this.BonlivraisonService.deleteFicheDEroute(this.deleteId).subscribe({
      next: () => {
       
        console.log('utilisateur deleted successfully');
        this.BonlivraisonService.getFicheDeRoute(this.defaultSiege.id).subscribe((data: any) => {
          this.orderes = data.ListFiches;
          this.allorderes = cloneDeep(data.ListFiches);
          this.orderes = this.service.changePage(this.allorderes)
        });
        let timerInterval: any;
        Swal.fire({
          title: 'fiche de route supprimer avec succes!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('Alert closed by the timer');
          }
        });

        setTimeout(() => {
        
        }, 2000);
      },
      error: (error: any) => {
        console.error('Error supprisoion fiche:', error);
      }
    });

    this.submitted = true;


  }


  /**
   * Open modal
   * @param content modal content
   */
  // openModal(content: any) {
  //   this.submitted = false;
  //   this.modalService.open(content, { size: 'md', centered: true });
  // }

  /**
  * Form data get
  */
  get form() {
    return this.ordersForm.controls;
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Order';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.econtent = this.allorderes[id];
    this.ordersForm.controls['customer'].setValue(this.econtent.customer);
    this.ordersForm.controls['product'].setValue(this.econtent.product);
    this.ordersForm.controls['orderDate'].setValue(this.econtent.orderDate);
    this.ordersForm.controls['amount'].setValue(this.econtent.amount);
    this.ordersForm.controls['payment'].setValue(this.econtent.payment);
    this.ordersForm.controls['status'].setValue(this.econtent.status);
    this.ordersForm.controls['orderId'].setValue(this.econtent.orderId);

  }

  /**
 * Save user
 */
  saveUser() {
    if (this.ordersForm.valid) {
      if (this.ordersForm.get('orderId')?.value) {
        const updatedData = this.ordersForm.value;
        this.store.dispatch(updateOrder({ updatedData }));
        this.modalService.dismissAll();
      }
      else {
        const orderId = (this.allorderes.length + 1).toString();
        this.ordersForm.controls['orderId'].setValue(orderId);
        const newData = this.ordersForm.value;
        this.store.dispatch(addOrder({ newData }));
        this.modalService.dismissAll();
        let timerInterval: any;
        Swal.fire({
          title: 'Order inserted successfully!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        });
      }
    }
    this.ordersForm.reset();
    this.submitted = true
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.orderes.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.orderes.length; i++) {
      if (this.orderes[i].state == true) {
        result = this.orderes[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }


  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.orderes.length; i++) {
      if (this.orderes[i].state == true) {
        result = this.orderes[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }


  // Csv File Export
  csvFileExport() {
    var orders = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Order Data',
      useBom: true,
      noDownload: false,
      headers: ["id", "order Id", "customer", "product", "orderDate", "amount", "payment", "status"]
    };
    new ngxCsv(this.content, "orders", orders);
  }
  /**
  * Sort table data
  * @param param0 sort the column
  *
  */

  PaymentFiletr() {
    if (this.payment != '') {
      this.orderes = this.allorderes.filter((order: any) => order.payment == this.payment);
    } else {
      this.orderes = this.service.changePage(this.allorderes)
    }
  }

  filterStatus() {
    if (this.status != '') {
      this.orderes = this.allorderes.filter((order: any) => order.status == this.status);
    } else {
      this.orderes = this.service.changePage(this.allorderes)
    }
  }
}

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
import { ChauffeurService } from 'src/app/core/services/chauffeur.service';
import { Router } from '@angular/router';
import { VehiculeService } from 'src/app/core/services/vehicule.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [DecimalPipe]
})

/**
 * Orders Component
 */
export class creationfichederoute {

  // bread crumb items
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
  sieges: any;
  // Api Data
  content?: any;
  econtent?: any;
  orderes?: any;
  page: any = 1;
  pageSize: any = 8;
  selectedSieges: any;
  allorderes: any;
  searchResults: any;
  searchTerm: any;
  selectedTrajet: any;
  activeNav: any
  listeVehicule: any;
  selectedVehicule: any;
  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder, private BonlivraisonService: BonlivraisonService,
    public service: PaginationService, private ChauffeurService: ChauffeurService, private router: Router, private VehiculeService: VehiculeService,
    private store: Store<{ data: RootReducerState }>) {
  }
  isFormInvalid: any
  saveFicheDeRoute() {
    this.isFormInvalid = false;



    const livraisonData = {
      listeTrajets: this?.checkedList,
      chauffeur: this?.selectedTrajet,
      vehicule: this?.selectedVehicule,
      dateSortie: this?.date,
      idsite: this.defaultSiege.id
    };

    // Validate if all necessary fields are filled
    if (!this.selectedTrajet || !this.selectedVehicule || !this.date || !this.checkedList) {
      this.isFormInvalid = true;

      // Display alert when checkedList is empty or other fields are missing
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez sélectionner au moins un trajet, un chauffeur, un véhicule et une date.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

      return;
    }
    // Call service to create the fiche de route
    this.BonlivraisonService.createFicheDeRoute(livraisonData).subscribe(response => {
      console.log('fiche de route saved successfully', response);

      // Refresh orders list after successful save
      this.BonlivraisonService.getLivraisonBysite(this.defaultSiege.id).subscribe((data: any) => {
        this.orderes = data.ListLivraison;
        this.allorderes = cloneDeep(data.ListLivraison);
        this.orderes = this.service.changePage(this.allorderes);
      });

      // Show success notification
      let timerInterval: any;
      Swal.fire({
        title: 'Succès',
        text: 'Fiche de route créée avec succès.',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          clearInterval(timerInterval);
        }
      });
    }, error => {
      // Log and notify of any errors during saving
      console.error('Error saving data', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la sauvegarde.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    });
  }


  cl() {
    console.log(this.selectedVehicule);

  }
  defaultSiege: any;
  currentUser: any;
  livraisonEntrantBySite: any[] = [];
  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'fiche de route sortant' },
      { label: 'creation', active: true }
    ];
    const currentDate = new Date();
    this.date = currentDate.toISOString().substring(0, 10);
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



    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.currentUser = currentUser;
    this.defaultSiege = currentUser.sitepardefaut;



    // Fetch Data
    this.store.dispatch(fetchorderListData());
    this.store.select(selectDataLoading).subscribe((data) => {
      if (data == false) {
        document.getElementById('elmLoader')?.classList.add('d-none');
      }
    });
    const status = {
      statut: "1"
    }

    this.ChauffeurService.getChauffeurs().subscribe((data: any[]) => {

      this.listeChauffeurs = data.map(item => ({
        ...item,
        type: 'Chauffeur',
        label: item.nom + ' ' + item.prenom
      }));

    });
    this.VehiculeService.getVehicules().subscribe((data: any[]) => {
      this.listeVehicule = data;
    });



    this.getLivraisonsparsiege();

  }

  getLivraisonsparsiege() {

    this.BonlivraisonService.getLivraisonBysite(this.defaultSiege.id).subscribe((data: any) => {
      this.orderes = data.ListLivraison;
      this.allorderes = cloneDeep(data.ListLivraison);
      this.orderes = this.service.changePage(this.allorderes)

    });
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
        item.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.expediteur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.adresse_expediteur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.destinataire.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.prenom_chauffeur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.adresse_destinataire.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });

    this.orderes = this.service.changePage(this.searchResults)

  }

  /**
    * change navigation
    */
  allLivraisonBysite: any
  onNavChange(changeEvent: NgbNavChangeEvent) {
    // this.orderes = this.allorderes.filter(country => country.status == status);

    if (changeEvent.nextId === 1) {

      this.orderes = this.allorderes
      this.activeNav = 1;
    }
    if (changeEvent.nextId === 2) {
      this.orderes = this.allorderes.filter((order: any) => order.status == 'Delivered');
    }
    if (changeEvent.nextId === 3) {
      this.activeNav = 3;


    }
    if (changeEvent.nextId === 4) {
      this.orderes = this.allorderes.filter((order: any) => order.status == 'Returns');
    }
    if (changeEvent.nextId === 5) {
      this.orderes = this.allorderes.filter((order: any) => order.status == 'Cancelled');
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
  deleteData(id: any) {
    if (id) {
      this.store.dispatch(deleteOrder({ id: this.deleteId.toString() }));
    } else {
      this.store.dispatch(deleteOrder({ id: this.checkedValGet.toString() }));
    }
    this.deleteId = ''
    this.masterSelected = false
  }
  listeChauffeurs: any[] = [];


  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

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
    this.orderes.forEach((x: { selected: boolean; }) => x.selected = ev.target.checked);
    this.updateCheckedList();
    console.log(this.checkedList);
  }

  onCheckboxChange(e: any) {
    const idTrajet = e.target.value; // Changed variable name
    const selected = e.target.checked;
    const index = this.orderes.findIndex((order: any) => order.id_trajet === idTrajet); // Updated key name
    if (index !== -1) {
      this.orderes[index].selected = selected;
    }
    this.updateCheckedList();
    console.log(this.checkedList);
  }

  updateCheckedList() {
    // Map to use 'id_trajet' instead of 'id'
    this.checkedList = this.orderes
      .filter((order: any) => order.selected)
      .map((order: any) => ({ id_trajet: order.id_trajet })); // Updated key name
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
  filteredListe: any[] = [];
  filterChauffeur() {
    // Reset the orders list based on the original data
    let filteredOrders = this.allorderes;

    // Apply the filter for chauffeur if selected
    if (this.selectedTrajet) {
      filteredOrders = filteredOrders.filter((order: any) =>
        order?.prenom_chauffeur === this.selectedTrajet?.prenom
      );
    }

    // Apply the filter for vehicle if selected
    if (this.selectedVehicule) {
      filteredOrders = filteredOrders.filter((order: any) =>
        order?.matricule_vehicule === this.selectedVehicule?.matricule
      );
    }

    // Update the orders list based on the filtered data
    this.orderes = filteredOrders;

    // Apply pagination to the filtered results
    this.orderes = this.service.changePage(this.orderes);
  }



}

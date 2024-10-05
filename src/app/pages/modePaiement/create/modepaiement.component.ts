import { Component, } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators, NgForm } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

// Date Format
import { DatePipe } from '@angular/common';

// Csv File Export
import { ngxCsv } from 'ngx-csv/ngx-csv';
// Rest Api Service
import { restApiService } from 'src/app/core/services/rest-api.service';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import { addCustomer, deleteCustomer, fetchCustomerListData, updateCustomer } from 'src/app/store/Ecommerce/ecommerce_action';
import { selectCustomerData, selectDataLoading } from 'src/app/store/Ecommerce/ecommerce_selector';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { cloneDeep } from 'lodash';

import { Router } from '@angular/router';
import { SiteService } from 'src/app/core/services/site.service';
import { UtilisateurService } from 'src/app/core/services/utilisateur.service';
import { SiegeService } from 'src/app/core/services/siege.service';
import { TypeColisService } from 'src/app/core/services/type-colis-service.service';
import { TypePaiementService } from 'src/app/core/services/type-paiement.service';
import { ModePaiementService } from 'src/app/core/services/mode-paiement.service';
@Component({
  selector: 'app-utilisateur',
  templateUrl: './modepaiement.component.html',
  styleUrls: ['./modepaiement.component.scss']
})

/**
 * Customers Component
 */
export class ModePaiementComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  customerForm!: UntypedFormGroup;
  masterSelected!: boolean;
  checkedList: any;
  content?: any;
  customers?: any;
  uts: any[] = [];
  // Table data
  customerList: any;
  searchTerm: any;
  filterDate: any;
  status: any = '';
  searchResults: any;
  newCustomer: any;
  originalUtilisateur: any;
  allinvoices: any;

  code: string = "";
  type: string = "";

  email: string = "";
  password: string = "";
  adresse: string = "";
  roles: string = "";
  telephone: string = "";
  sites: string = "";
  sieges: any[] = [];
  selectedSieges: any[] = [];
  selectedUtilisateur: any = null;
  isEditMode: boolean = false;
  constructor(private modalService: NgbModal, public service: PaginationService,
    private formBuilder: UntypedFormBuilder, public datePipe: DatePipe, private router: Router, private SiegeService: SiegeService,
    private restApiService: restApiService
    , private store: Store<{ data: RootReducerState }>
    , private UtilisateurService: UtilisateurService
    , private SiteService: SiteService
    , private TypeColisService: TypeColisService
    , private ModePaiementService: ModePaiementService

  ) {
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'mode paiement' },
      { label: 'list', active: true }
    ];
    this.getTypePaiment();

    /**
    * Form Validation
    */

    // Fetch Data
    this.store.dispatch(fetchCustomerListData());
    this.store.select(selectDataLoading).subscribe((data) => {
      if (data == true) {
        document.getElementById('elmLoader')?.classList.add('d-none');
      }
    });

    this.store.select(selectCustomerData).subscribe((data) => {
      this.customers = data;
      this.customerList = cloneDeep(data);
      this.customers = this.service.changePage(this.customerList)
    });
  }
  goToClientDetails(clientId: string) {
    // Navigate to another route with the client ID
    this.router.navigate(['invoices/create/', clientId]);
  }

  getTypePaiment() {
    this.ModePaiementService.getModePaiement().subscribe(data => {
      this.uts = data;
      this.originalUtilisateur = cloneDeep(data);
      this.uts = this.service.changePage(this.originalUtilisateur)
    });


   

  }

  defaultSiege: any;
  openEditModal(content: any, utilisateur: any) {

    this.selectedUtilisateur = utilisateur;
    this.code = utilisateur.id;
    this.type = utilisateur.libelle;
    this.isEditMode = true;
    this.modalService.open(content, { size: 'md', centered: true });


  }


  updatetype() {
    const updatedutilisateur = {
      email: this.email,
      libelle: this.type,

    }

    this.ModePaiementService.update(this.selectedUtilisateur.id, updatedutilisateur).subscribe({
      next: (data) => {
       
       
        
        this.getTypePaiment();
        this.modalService.dismissAll();
        this.resetUtilisateurForm();
        let timerInterval: any;
        Swal.fire({
          title: 'type updated successfully!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
       
          }
        });

        setTimeout(() => {

        }, 2000);
      },
      error: (error) => {
        console.error('Error creating mode:', error);
      }
    });

    this.submitted = true;
  }
  findUtilisateurById(id: number) {
    // this.modalService.open( {  size: 'md', centered: true });

    const uti = this.uts.find(utilisateur => utilisateur.id === id);

    this.email = uti.email
    this.type = uti.type


  }

  deletetype() {
    this.ModePaiementService.delete(this.deleteId).subscribe({
      next: (data) => {
        this.uts = data;
        console.log('type supprimer avec succés ');
        this.getTypePaiment();
        this.modalService.dismissAll();
        this.resetUtilisateurForm();
        let timerInterval: any;
        Swal.fire({
          title: 'type supprimer avec succés!',
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
      error: (error) => {
        const errorTitle = error.error?.title || 'An error occurred';
        const errorDetail = error.error?.detail || 'Something went wrong';
        const errorStatus = error.error?.status || '500';

        // Display the error in SweetAlert
        Swal.fire({
          title: `Error ${errorStatus}: ${errorTitle}`,
          text: errorDetail,
          icon: 'error',
          confirmButtonText: 'Close'
        });
      }
    });

    this.submitted = true;


  }
  isFormInvalid: any;
  createtypecoli() {

    const type = {

      libelle: this.type,

    }
    this.isFormInvalid = true;
    if (!this.type) {
      this.isFormInvalid = true;


      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs ',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

      return;
    }
    this.ModePaiementService.add(type).subscribe({
      next: (data) => {
    
        console.log('type cree avec succes');
        this.getTypePaiment();
        this.modalService.dismissAll();
        this.resetUtilisateurForm();
        let timerInterval: any;
        Swal.fire({
          title: 'type cree avec succes',
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
          type;
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating mode paiements:', error);
      }
    });

    this.submitted = true;
  }

  resetUtilisateurForm() {

    this.type = '';

  }

  changePage() {
    this.uts = this.service.changePage(this.originalUtilisateur)
  }

  onSort(column: any) {
    // resetting other headers
    this.uts = this.service.onSort(column, this.uts)
  }

  // Search Data
  performSearch1(): void {
    this.searchResults = this.uts.filter((item: any) => {
      return (

        item.code.toLowerCase().includes(this.searchTerm.toLowerCase())

      );
    });
    this.uts = this.service.changePage(this.searchResults)
  }
  performSearch(): void {
    this.searchResults = this.originalUtilisateur.filter((item: any) => {
      return (
        item.libelle.toLowerCase().includes(this.searchTerm.toLowerCase())

      );
    });
    this.uts = this.service.changePage(this.searchResults)
  }

  dateFilter() {
    // this.customers = this.customerList.filter((customer: any) => new Date(customer.date) >= new Date(Object.values(this.dateFilter)[0]) && new Date(customer.date) <= new Date(Object.values(this.dateFilter)[1]));
  }

  statusFilter() {
    /* if (this.status != '') {
       this.customers = this.customerList.filter((customer: any) => customer.status == this.status);
     } else {
       this.customers = this.customerList
     }
 */
  }

  /**
  * Open modal
  * @param content modal content
  */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    this.isEditMode = false;

  }

  /**
   * Form data get
   */
  get form() {
    return this.customerForm.controls;
  }

  /**
 * Save user
 */
  closeModal() {
    this.modalService.dismissAll();
    this.resetUtilisateurForm();

  }
  saveUser() {
    if (this.customerForm.valid) {
      if (this.customerForm.get('_id')?.value) {
        const updatedData = this.customerForm.value;
        this.store.dispatch(updateCustomer({ updatedData }));
        this.modalService.dismissAll();
      }
      else {
        const custId = (this.customerList.length + 1).toString();
        this.customerForm.controls['_id'].setValue(custId);
        const newData = this.customerForm.value;
        this.store.dispatch(addCustomer({ newData }));
        this.modalService.dismissAll();
        let timerInterval: any;
        Swal.fire({
          title: 'Customers inserted successfully!',
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
    setTimeout(() => {
      this.customerForm.reset();
    }, 2000);
    this.submitted = true
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.customers.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.customers.length; i++) {
      if (this.customers[i].state == true) {
        result = this.customers[i];
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
    for (var i = 0; i < this.customers.length; i++) {
      if (this.customers[i].state == true) {
        result = this.customers[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }

  /**
    * Open Edit modal
    * @param content modal content
    */
  econtent?: any;
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });

    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Customer';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.econtent = this.customerList[id];
    this.customerForm.controls['customer'].setValue(this.econtent.customer);
    this.customerForm.controls['email'].setValue(this.econtent.email);
    this.customerForm.controls['phone'].setValue(this.econtent.phone);
    this.customerForm.controls['date'].setValue(this.econtent.date);
    this.customerForm.controls['status'].setValue(this.econtent.status);
    this.customerForm.controls['_id'].setValue(this.econtent._id);

  }


  /**
* Confirmation mail model
*/


  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    if (id) {
      this.store.dispatch(deleteCustomer({ id: this.deleteId.toString() }));
    } else {
      this.store.dispatch(deleteCustomer({ id: this.checkedValGet.toString() }));
    }
    this.deleteId = ''
    this.masterSelected = false
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

  // Filtering
  SearchData() {
    var status = document.getElementById("idStatus") as HTMLInputElement;
    var date = document.getElementById("isDate") as HTMLInputElement;
    var dateVal = date.value ? this.datePipe.transform(new Date(date.value), "yyyy-MM-dd") : '';
    if (status.value != 'all' && status.value != '' || dateVal != '') {
      this.customers = this.content.filter((customer: any) => {
        return this.datePipe.transform(new Date(customer.date), "yyyy-MM-dd") == dateVal || customer.status === status.value;
      });
    }
    else {
      this.customers = this.content
    }
  }

  // Csv File Export
  csvFileExport() {
    var customer = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Customer Data',
      useBom: true,
      noDownload: false,
      headers: ["id", "customer Id", "customer", "email", "phone", "date", "status"]
    };
    new ngxCsv(this.content, "customers", customer);
  }
  submitForm(form: NgForm) {

    if (form.invalid) {
      return; // prevent submission if form is invalid
    }
    if (this.isEditMode) {
      this.updatetype();
    } else {
      this.createtypecoli();
    }
  }
}

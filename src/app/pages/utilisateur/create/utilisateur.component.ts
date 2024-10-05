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
@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})

/**
 * Customers Component
 */
export class UtilisateurComponent {

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
  nom: string = "";
  prenom: string = "";
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
  constructor(private modalService: NgbModal,public service: PaginationService,
    private formBuilder: UntypedFormBuilder, public datePipe: DatePipe, private router: Router,private SiegeService:SiegeService,
    private restApiService: restApiService, private store: Store<{ data: RootReducerState }>, private UtilisateurService: UtilisateurService, private SiteService: SiteService) {
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'utilisateurs' },
      { label: 'list', active: true }
    ];
    this.getUtilisateurs();

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

  getUtilisateurs() {
    this.UtilisateurService.getAllUtil().subscribe(data => {
      this.uts = data;
      this.originalUtilisateur = cloneDeep(data);
      this.uts = this.service.changePage(this.originalUtilisateur)
    });


    this.SiegeService. getSieges().subscribe(data => {
      this.sieges = data;

    });
    this.UtilisateurService.getAllUtil().subscribe(data => {
    });

    console.log(this.uts)
  }

  defaultSiege: any;
  openEditModal(content: any, utilisateur: any) {
    
    this.selectedUtilisateur = utilisateur;
    this.code = utilisateur.code;
    this.nom = utilisateur.nom;
    this.prenom = utilisateur.prenom;
    this.email = utilisateur.email;
    this.telephone = utilisateur.telephone;
    this.adresse = utilisateur.adresse;
    this.roles = utilisateur.role;
    this.selectedSieges = utilisateur.siteUtilisateurs.map((sus: any) => sus.site);
    this.isEditMode = true;
    this.defaultSiege=utilisateur.sitepardefaut;
    this.modalService.open(content, { size: 'md', centered: true });

    
  }  


  updateutilisateur(){
    const updatedutilisateur = {
      email: this.email,
      nom: this.nom,
      prenom: this.prenom,
      telephone: this.telephone,
      adresse: this.adresse,
      code: this.code,
      password: this.password,
      sites: this.selectedSieges,
      role:this.roles,
      sitepardefaut :this.defaultSiege,
    }
    
    this.UtilisateurService.updateUtilisateur(updatedutilisateur,this.selectedUtilisateur.id).subscribe({
      next: (data) => {
   
        console.log('utilisateur updated successfully');
        this.getUtilisateurs();
        this.modalService.dismissAll();
        this.resetUtilisateurForm();
        let timerInterval: any;
        Swal.fire({
          title: 'utilisateur updated successfully!',
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
        console.error('Error creating utilisteur:', error);
      }
    });

    this.submitted = true;
  }
   findUtilisateurById(id :number) {
   // this.modalService.open( {  size: 'md', centered: true });
    
    const uti  =  this.uts.find(utilisateur => utilisateur.id === id);
       console.log(uti ) ; 
     this.email =uti.email
     this.nom= uti.nom
     this.prenom=uti.prenom
     this.telephone=uti.telephone
     this.adresse=uti.adresse
     this.code=uti.code
     this.password=uti.password
 
  }

  deleteUtilisateur (){
    this.UtilisateurService.deleteUtilisateur(this.deleteId).subscribe({
      next: (data) => {
        this.uts = data;
        console.log('utilisateur deleted successfully');
        this.getUtilisateurs();
        this.modalService.dismissAll();
        this.resetUtilisateurForm();
        let timerInterval: any;
        Swal.fire({
          title: 'utilisateur deleted successfully!',
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
        console.error('Error creating client:', error);
      }
    });

    this.submitted = true;


  }
  isFormInvalid:any;
  createUtilisateur() {
  
    const utilisateur = {
      email: this.email,
      nom: this.nom,
      prenom: this.prenom,
      telephone: this.telephone,
      adresse: this.adresse,
      code: this.code,
      password: this.password,
      sites: this.selectedSieges,
      role:this.roles,
      sitepardefaut :this.defaultSiege,
    }
    this.isFormInvalid = true;
    if (!this.email || !this.nom || !this.prenom || !this.telephone ||!this.adresse || !this.code || !this.password || !this.selectedSieges ) {
      this.isFormInvalid = true;
                      
      
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs ',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

      return;
    }
    this.UtilisateurService.createUtilisateur(utilisateur).subscribe({
      next: (data) => {

        console.log('utilisateur created successfully');
        this.getUtilisateurs();
        this.modalService.dismissAll();
        this.resetUtilisateurForm();
        let timerInterval: any;
        Swal.fire({
          title: 'utilisateur created successfully!',
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
          utilisateur;
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating client:', error);
      }
    });

    this.submitted = true;
  }

  resetUtilisateurForm() {
    this.email = '';
    this.nom = '';
    this.prenom = '';
    this.telephone = '';
    this.adresse = '';
    this.code = '';
    this.password = '';
    this.roles='';
    this.sites = '';
    this.selectedSieges = [];
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
        item.code.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.telephone.toLowerCase().includes(this.searchTerm.toLowerCase())
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
closeModal(){
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
      this.updateutilisateur();
    } else {
      this.createUtilisateur();
    }
  }
}

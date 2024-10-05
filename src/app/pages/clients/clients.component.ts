import { Component, } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

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
import { ClientService } from './client.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./clients.component.scss']
})

/**
 * Customers Component
 */
export class CustomersComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  customerForm!: UntypedFormGroup;
  masterSelected!: boolean;
  checkedList: any;
  content?: any;
  customers?: any;
  clients: any[] = [];
  clientId : number=0;
  // Table data
  customerList: any;
  searchTerm: any;
  filterDate: any;
  status: any = '';
  searchResults: any;
  newCustomer: any;
  originalClients: any[] = [];
  pageClients: any[] = [];
  isEditMode: boolean = false;
  constructor(private modalService: NgbModal, private clientService: ClientService, public service: PaginationService,
    private formBuilder: UntypedFormBuilder, public datePipe: DatePipe,  private router: Router ,
    private restApiService: restApiService, private store: Store<{ data: RootReducerState }>) {
  }
 
  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Clients' },
      { label: 'list', active: true }
    ];
    this.getclients();

    /**
    * Form Validation
    */
    this.customerForm = this.formBuilder.group({

      raisonSocial: ['', [Validators.required]],
      code: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      matriculeFiscale: ['', [Validators.required]],
      activite: ['', [Validators.required]],
      adresse: ['', [Validators.required]],

    });
    const newCustomer = {
      raisonSocial: this.customerForm.value.raisonSocial,
      code: this.customerForm.value.code,
      nom: this.customerForm.value.nom,
      email: this.customerForm.value.email,
      phone: this.customerForm.value.phone,
      matriculeFiscale: this.customerForm.value.matriculeFiscale,
      activite: this.customerForm.value.activite,
      adresse: this.customerForm.value.adresse,
    };



    // Fetch Data
    this.store.dispatch(fetchCustomerListData());
    this.store.select(selectDataLoading).subscribe((data) => {
      if (data == false) {
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
    this.router.navigate(['invoices/create', clientId]);
  }
  
  getclients() {
    this.clientService.getClients().subscribe(data => {
      this.clients = data;
      this.originalClients = [...data]; 
      this.pageClients = [...data]; 
      this.changePage();
      this.performSearch1();
      console.log(this.clients.length)
    });
  }
  createClient() {
    if (this.customerForm.invalid) {
      console.log('Form is invalid');
      return;
    }
  
   
    this.clientService.createClient(this.customerForm.value).subscribe({
      next: (data) => {
        this.clients = data;
        console.log('Client created successfully');
        this.getclients();
        this.modalService.dismissAll();
  
        let timerInterval: any;
        Swal.fire({
          title: 'Client created successfully!',
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
          this.customerForm.reset();
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating client:', error);
      }
    });
  
    this.submitted = true;
  }

  updateClient() {
    if (this.customerForm.invalid) {
      console.log('Form is invalid');
      return;
    }
  
    console.log(this.customerForm.value);
    this.clientService.updateClient(this.clientId,this.customerForm.value).subscribe({
      next: (data) => {
        this.clients = data;

        console.log('Client updated successfully');
        this.getclients();
        this.modalService.dismissAll();
  
        let timerInterval: any;
        Swal.fire({
          title: 'Client updated successfully!',
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
          this.customerForm.reset();
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating client:', error);
      }
    });
  
    this.submitted = true;
  }


  changePage() {
    this.clients = this.service.changePage(this.pageClients)
  }

  onSort(column: any) {
    
    this.clients = this.service.onSort(column, this.clients)

  }
   onclose(){

    this.customerForm.reset();
    this.modalService.dismissAll();
   }
   
  performSearch1(): void {
    this.searchResults = this.clients.filter((item: any) => {
      return (

        item?.code?.includes(this.searchTerm)||
        item?.email?.toLowerCase()?.includes(this.searchTerm.toLowerCase())||
        item?.adresse?.toLowerCase()?.includes(this.searchTerm.toLowerCase())||
        item?.nom?.toLowerCase()?.includes(this.searchTerm.toLowerCase())
      );
    });
    this.clients = this.service.changePage(this.searchResults)
  }
  performSearch(): void {
    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset to the original clients list
    this.changePage();
    } else {
      // Perform the search and update the clients list
      this.searchResults = this.originalClients.filter((item: any) => {
        return item.code.toLowerCase().includes(this.searchTerm.toLowerCase())  ||
        item.phone.toLowerCase().includes(this.searchTerm.toLowerCase())  ||
        item.email.toLowerCase().includes(this.searchTerm.toLowerCase())  ||
        item.adresse.toLowerCase().includes(this.searchTerm.toLowerCase()) ;
      });
      this.clients = this.service.changePage(this.searchResults);
    }
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

    console.log(this.isEditMode);
  }

 
  get form() {
    return this.customerForm.controls;
  }

  /**
 * Save user
 */
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
  deleteId: number=0;
  confirm(content: any, id: number) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
   
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
  openEditModal(content: any, client: any) {
    // Populate the form fields with the selected user's data
    this.customerForm.setValue({
      raisonSocial: client.raisonSocial || '',
      code: client.code || '',
      nom: client.nom || '',
      email: client.email || '',
      phone: client.phone || '',
      matriculeFiscale: client.matriculeFiscale || '',
      activite: client.activite || '',
      adresse: client.adresse || ''
    });
  
    this.isEditMode = true;
    
    this.clientId=client.id; 
    this.modalService.open(content, { size: 'md', centered: true });

    console.log(this.isEditMode)
  }

  submitForm(): void {
    this.submitted = true;
    if (this.customerForm.valid) {
      if (this.isEditMode) {
        this.updateClient();
      } else {
        this.createClient();
      }
      console.log(this.isEditMode);
    } else {
      console.log('Form is invalid');
    }
  }

  onDeleteClient(): void {
    console.log(this.deleteId);
    this.clientService.deleteClient(this.deleteId).subscribe({
      next: () => {
        console.log(`Client with id ${this.deleteId} deleted successfully.`);
        this.modalService.dismissAll();
  
        let timerInterval: any;
        Swal.fire({
          title: 'Client deleted successfully!',
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
          this.customerForm.reset();
        }, 2000);
      },
      error: (err) => {
        console.error('Error deleting client:', err);
      }
    });
  }
  
}

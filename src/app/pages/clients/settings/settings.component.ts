import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TokenStorageService } from 'src/app/core/services/token-storage.service'; 
import Swal from 'sweetalert2';
import { ClientService } from '../client.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

/**
 * Profile Settings Component
 */
export class SettingsComponent implements OnInit {

  userData:any;
  breadCrumbItems!: Array<{}>;
  submitted = false;
  customerForm!: UntypedFormGroup;
  masterSelected!: boolean;
  checkedList: any;
  content?: any;
  customers?: any;
  clients: any[] = [];
  clientId: number = 0;
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
  facture: boolean = false;
  isFacture: boolean = false;
  isMonthly: boolean = false;
  constructor(private TokenStorageService : TokenStorageService,private modalService: NgbModal, private clientService: ClientService, public service: PaginationService,
    private formBuilder: UntypedFormBuilder, public datePipe: DatePipe, private router: Router,
    private restApiService: restApiService, private store: Store<{ data: RootReducerState }>, private route: ActivatedRoute) {
  }
idClient :any ; 
  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Clients' },
      { label: 'list', active: true }
    ];

    const idParam = this.route.snapshot.paramMap.get('id');
    this.idClient = idParam ? +idParam : null;
    
    this.userData =  this.TokenStorageService.getUser(); 
    /**
    * Form Validation
    */
    this.getclients();
    this.customerForm = this.formBuilder.group({

      raisonSocial: ['', [Validators.required]],
      code: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      matriculeFiscale: ['', [Validators.required]],
      activite: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      facture: [false, [Validators.required]],
      typefacture: [false, [Validators.required]],

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

  }
    
 
  goToClientDetails(clientId: string) {
    // Navigate to another route with the client ID
    this.router.navigate(['invoices/create', clientId]);
  }

  getclients() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idClient = idParam ? +idParam : null;
    
    this.clientService.getClient(this.idClient).subscribe(data => {
  
      if (data ) {
        this.isEditMode=true;
        const client = data// Assuming you want to fill the form with the first client's data
        this.customerForm.patchValue({
          raisonSocial: client.raisonSocial || '',
          code: client.code || '',
          nom: client.nom || '',
          email: client.email || '',
          phone: client.phone || '',
          matriculeFiscale: client.matriculeFiscale || '',
          activite: client.activite || '',
          adresse: client.adresse || '',
          facture: client.facture || false,
          typefacture: client.typefacture || false,
        });
      }
    });
  }
  
  client :any ; 
  getclient() {
    this.clientService.getClient(this.idClient).subscribe(data => {
      this.client = data;
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
      
        this.getclients();
       

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
         window.location.reload();
        setTimeout(() => {
     
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
    this.clientService.updateClient(this.idClient, this.customerForm.value).subscribe({
      next: (data) => {
     

        console.log('Client updated successfully');
        this.getclients();
      

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
       
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating client:', error);
      }
    });

    this.submitted = true;
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
  /**
  * Multiple Default Select2
  */
   selectValue = ['Illustrator', 'Photoshop', 'CSS', 'HTML', 'Javascript', 'Python', 'PHP'];

}

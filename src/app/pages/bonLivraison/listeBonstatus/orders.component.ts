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

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [DecimalPipe]
})

/**
 * Orders Component
 */
export class OrdersComponent {

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

  // Api Data
  content?: any;
  econtent?: any;
  orderes?: any;
  page: any = 1;
  pageSize: any = 8;

  allorderes: any;
  searchResults: any;
  searchTerm: any;

  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder, private BonlivraisonService: BonlivraisonService,
    public service: PaginationService,
    private store: Store<{ data: RootReducerState }>) {
  }

  saveFicheDeRoute() {

    const livraisonData = {
      listeTrajets: this.checkedList,

    }

    this.BonlivraisonService.createFicheDeRoute(livraisonData).subscribe(response => {
      console.log('fiche de route saved successfully', response);

    }, error => {
      console.error('Error saving data', error);
    });


  }

  defaultSiege: any;
  currentUser: any;
  livraisonEntrantBySite: any[] = [];
  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Orders', active: true }
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

    this.getLivraisons();

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


  }

  getLivraisons() {


    this.BonlivraisonService.getLivraisons().subscribe((data: any) => {
      this.orderes = data;
      this.allorderes = cloneDeep(data);
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
        item.customer.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.orderDate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.payment.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    // this.orderes = this.searchResults.slice(0, 10);
    this.orderes = this.service.changePage(this.searchResults)
    // if (this.searchResults.length == 0) {
    //   (document.querySelector('.noresult') as HTMLElement).style.display = 'block'
    // } else {
    //   (document.querySelector('.noresult') as HTMLElement).style.display = 'none'
    // }
  }

  /**
    * change navigation
    */
  allLivraisonBysite: any
  onNavChange(changeEvent: NgbNavChangeEvent) {
    // this.orderes = this.allorderes.filter(country => country.status == status);

    if (changeEvent.nextId === 1) {
      this.getLivraisons();
      this.orderes = this.allorderes
    }
    if (changeEvent.nextId === 2) {
      this.orderes = this.allorderes.filter((order: any) => order.status == 'Delivered');
    }
    if (changeEvent.nextId === 3) {
      this.BonlivraisonService.getLivraisonBysite(this.defaultSiege.id).subscribe((data: any) => {
        this.orderes = data.livraisons;
        this.allorderes = cloneDeep(data.livraisons);
        this.orderes = this.service.changePage(this.allorderes)

      });

      console.log('changed');

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

  filterStatus() {
    if (this.status != '') {
      this.orderes = this.allorderes.filter((order: any) => order.status == this.status);
    } else {
      this.orderes = this.service.changePage(this.allorderes)
    }
  }
}

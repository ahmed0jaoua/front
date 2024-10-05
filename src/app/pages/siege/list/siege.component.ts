import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { SiegeService } from 'src/app/core/services/siege.service';
import { HttpClient } from '@angular/common/http';

// Sweet Alert


import { ListJsModel, paginationModel } from './siege.model';
import { OrdersService } from './siege.service';
import { NgbdListSortableHeader, listSortEvent } from './list-sortable.directive';
import { paginationlist } from 'src/app/core/data';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-listjs',
  templateUrl: './siege.component.html',
  styleUrls: ['./siege.component.scss'],
  providers: [OrdersService, DecimalPipe,SiegeService]

})

/**
 * Listjs table Component
 */
export class SiegeComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  listJsForm!: UntypedFormGroup;
  ListJsData!: ListJsModel[];
  checkedList: any;
  masterSelected!: boolean;
  ListJsDatas: any;
  ListSiegeDates: any[] = [];

  page: any = 1;
  pageSize: any = 3;
  startIndex: number = 0;
  endIndex: number = 3;
  totalRecords: number = 0;

  paginationDatas: any;
  

  existingTerm: any;

  dataterm: any;
  term: any;
  listJsData: any[] = [];

  // Table data
  ListJsList!: Observable<ListJsModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;


  showErrorAlert: boolean = false;
  errorMessage: string = '';
  closeAlert() {
    this.showErrorAlert = false;
  }

  constructor(private modalService: NgbModal, public service: OrdersService, private formBuilder: UntypedFormBuilder,public SiegeService:SiegeService) {
    this.ListJsList = service.countries$;
    this.total = service.total$;

    this.service.countries$.subscribe(data => {
      this.ListSiegeDates = data;
      this.totalRecords = data.length;
      this.updatePagination();
    });


  
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
   
   
    this.updatePagination();
    this.service.getSiege();

   
    this.breadCrumbItems = [
      { label: 'siege' },
      { label: 'Liste', active: true }
    ];

    /**
     * Form Validation
     */
    this.listJsForm = this.formBuilder.group({
      ids: [''],
      code: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      adresse: ['', [Validators.required]]
    });


    /**
    * fetches data
    */
    this.ListJsList.subscribe(x => {
      this.ListJsDatas = Object.assign([], x);
    });

  
  
  

    this.paginationDatas = this.ListSiegeDates
    this.totalRecords = this.paginationDatas.length

    this.startIndex = (this.page - 1) * this.pageSize + 1;
    this.endIndex = (this.page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.paginationDatas = paginationlist.slice(this.startIndex - 1, this.endIndex);
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    console.log(this.ListSiegeDates); 
  }

  /**
   * Form data get
   */
  get form() {
    return this.listJsForm.controls;
  }
 
 


  /**
* Pagination
*/


updatePagination() {
  this.startIndex = (this.page - 1) * this.pageSize;
  this.endIndex = this.page * this.pageSize;
  if (this.endIndex > this.totalRecords) {
    this.endIndex = this.totalRecords;
  }
  this.paginationDatas = this.ListSiegeDates.slice(this.startIndex, this.endIndex);
}
  loadPage() {
    this.updatePagination();
  }

  /**
  * Save saveListJs
  */
  saveListJs() {
    if (this.listJsForm.valid) {
      if (this.listJsForm.get('ids')?.value) {
        const formValue = this.listJsForm.value;

         this.SiegeService.updateSiege(formValue.ids, formValue).subscribe(
          response => {
            console.log('Siège mis à jour', response);
            this.modalService.dismissAll();
            this.listJsForm.reset();
            this.submitted = true;
            this.service.getSiege();
          },
          error => {
            console.error('Erreur lors de la mise à jour du siège', error);
          }
        );

       

        





        this.ListJsDatas = this.ListJsDatas.map((data: { id: any; }) => data.id === this.listJsForm.get('ids')?.value ? { ...data, ...this.listJsForm.value } : data)
      } else {
        const code = this.listJsForm.get('code')?.value;
        const nom = this.listJsForm.get('nom')?.value;
        const telephone = this.listJsForm.get('telephone')?.value;
        const adresse = this.listJsForm.get('adresse')?.value;
       

        const SiegeData = {
          code,
          nom,
          telephone,
          adresse
          
        };
        this.SiegeService.createSiege(SiegeData).subscribe(
          response => {
            console.log('Siège ajouté avec succès', response);
            // Réinitialiser le formulaire ou naviguer vers une autre page si nécessaire
            this.service.getSiege();
          },
          error => {
            console.error('Erreur lors de l\'ajout du Siège', error);
          }
        );
    
        



        this.ListJsDatas.push({
          code,
          nom,
          telephone,
          adresse
        });



        this.modalService.dismissAll()
      }
    }
    this.modalService.dismissAll();
    setTimeout(() => {
      this.listJsForm.reset();
    }, 2000);
    this.submitted = true
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.ListJsDatas.forEach((x: { state: any; }) => x.state = ev.target.checked)
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

      this.SiegeService.deleteSiege(id).subscribe(
        () => {
          console.log(`Siège avec l'ID ${id} supprimé avec succès.`);
          const element = document.getElementById('lj_' + id);
          if (element) {
            element.remove();
          }
        },
        (error) => {
          console.log('ttttt');
       //   console.log(error.error);
        
          
        //  console.error(`Erreur lors de la suppression du siège avec l'ID ${id}.`, error);
         this.showErrorAlert = true;
       this.errorMessage = error.error?.error ||`Une erreur est survenue lors de la suppression du siège. Veuillez réessayer.`;
          
        }
      );




     // document.getElementById('lj_' + id)?.remove();
      //console.log('tetstdelete');
    }
    else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();



      });
    }
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

  /**
  * Open modal
  * @param content modal content
  */
  editModal(content: any, id: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var listData = this.ListJsDatas.filter((data: { id: any; }) => data.id === id);
    var updatebtn = document.getElementById('add-btn') as HTMLElement
    updatebtn.innerHTML = 'Modifier'
    this.listJsForm.controls['code'].setValue(listData[0].code);
    this.listJsForm.controls['nom'].setValue(listData[0].nom);
    this.listJsForm.controls['telephone'].setValue(listData[0].telephone);
    this.listJsForm.controls['adresse'].setValue(listData[0].adresse);
    this.listJsForm.controls['ids'].setValue(listData[0].id);
  }
  /**
  * Sort table data
  * @param param0 sort the column
  *
  */
  onSort({ column, direction }: listSortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.listsortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}

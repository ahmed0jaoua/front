import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { HttpClient } from '@angular/common/http';

// Sweet Alert
import Swal from 'sweetalert2';

import { ListJsModel, paginationModel} from './list.model';
import { OrdersService } from './list.service';
import { NgbdListSortableHeader, listSortEvent } from './list-sortable.directive';
import { paginationlist } from 'src/app/core/data';

@Component({
  selector: 'app-listjs',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [OrdersService, DecimalPipe,VehiculeService]

})

/**
 * Listjs table Component
 */
export class ListjsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  listJsForm!: UntypedFormGroup;
  ListJsData!: ListJsModel[];
  checkedList: any;
  masterSelected!: boolean;
  ListJsDatas: any;
  ListVehiculeDates: any[] = [];

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

  constructor(private modalService: NgbModal, public service: OrdersService, private formBuilder: UntypedFormBuilder,public VehiculeService:VehiculeService) {
    this.ListJsList = service.countries$;
    this.total = service.total$;

    this.service.countries$.subscribe(data => {
      this.ListVehiculeDates = data;
      this.totalRecords = data.length;
      this.updatePagination();
    });


  
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
   
   /** this.VehiculeService.getVehicules().subscribe(data => {
      this.ListVehiculeDates = data;
    });*/
    this.updatePagination();
    this.service.getVehicule();
   

   
    this.breadCrumbItems = [
      { label: 'vehicule' },
      { label: 'list', active: true }
    ];

    /**
     * Form Validation
     */
    this.listJsForm = this.formBuilder.group({
      ids: [''],
      nom: ['', [Validators.required]],
      proprietaire: ['', [Validators.required]],
      type: ['', [Validators.required]],
      marque: [''],
      modele: [''],
      matricule: [''],
      datefabrication: [''],
      dateenregistrement: [''],
      kilometrage: [''],
      status: ['', [Validators.required]]
    });


    /**
    * fetches data
    */
    this.ListJsList.subscribe(x => {
      this.ListJsDatas = Object.assign([], x);
    });

  
  
  

    this.paginationDatas = this.ListVehiculeDates
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
    this.listJsForm.reset();
    this.modalService.open(content, { size: 'md', centered: true });
    console.log(this.ListVehiculeDates); 
  }

  /**
   * Form data get
   */
  get form() {
    return this.listJsForm.controls;
  }
 
  getStatusText(status: number | string): string {
    const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;

    
    switch(statusNumber) {

      case 1: return 'En Attente';  // ou tout autre texte approprié
      case 2: return 'En Livraison';
      case 3: return 'En Réparation';
      case 3: return 'Hors Service';   // ou tout autre texte approprié
      default: return 'Hors Service';
    }
  }


  getBadgeClasses(status: string): string {
    switch (status) {
      case '1': return 'badge bg-success-subtle text-success';
      case '2': return 'badge bg-danger-subtle text-danger';
      case '3': return 'badge bg-warning-subtle text-warning';
      case '4': return 'badge bg-secondary-subtle text-secondary';
      default: return 'badge bg-secondary-subtle text-secondary'; // Valeur par défaut
    }
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
  this.paginationDatas = this.ListVehiculeDates.slice(this.startIndex, this.endIndex);
}
  loadPage() {
    this.updatePagination();
  }

  /**
  * Save saveListJs
  */
  saveListJs() {
    if (this.listJsForm.valid) {
      console.log('test');
      if (this.listJsForm.get('ids')?.value) {

        console.log('testUPDATE');       
        const formValue = this.listJsForm.value;

        this.VehiculeService.updateVehicule(formValue.ids, formValue).subscribe(
          response => {
            console.log('Véhicule mis à jour', response);
            this.modalService.dismissAll();
            this.listJsForm.reset();
            this.submitted = true;
            this.service.getVehicule();
            this.listJsForm.reset();
          },
          error => {
            console.error('Erreur lors de la mise à jour du véhicule', error);
          }
      
        );





        this.ListJsDatas = this.ListJsDatas.map((data: { id: any; }) => data.id === this.listJsForm.get('ids')?.value ? { ...data, ...this.listJsForm.value } : data)
      } else {

        
        const nom = this.listJsForm.get('nom')?.value;
        const proprietaire = this.listJsForm.get('proprietaire')?.value;
        const type = this.listJsForm.get('type')?.value;
        const dateenregistrement = this.listJsForm.get('dateenregistrement')?.value;
        //const kilometrage = this.listJsForm.get('kilometrage')?.value;
        const kilometrage = parseFloat(this.listJsForm.get('kilometrage')?.value as any);
        const modele = this.listJsForm.get('modele')?.value;
        const marque = this.listJsForm.get('marque')?.value;
        const matricule = this.listJsForm.get('matricule')?.value;
        const datefabrication = this.listJsForm.get('datefabrication')?.value;
        const status =this.listJsForm.get('status')?.value;

        const vehiculeData = {
          modele,nom,kilometrage,proprietaire,type,dateenregistrement,
          marque,
          matricule,
          datefabrication,
          status
          
        };
        
        this.VehiculeService.createVehicule(vehiculeData).subscribe(
          response => {
            console.log('Véhicule ajouté avec succès', response);
            // Réinitialiser le formulaire ou naviguer vers une autre page si nécessaire
            this.service.getVehicule();
          },
          error => {
            console.error('Erreur lors de l\'ajout du véhicule', error);
          }
        );
        



        this.ListJsDatas.push({
          modele,nom,kilometrage,proprietaire,type,
          marque,
          matricule,
          datefabrication,
          status
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
      document.getElementById('lj_' + id)?.remove();
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
    this.listJsForm.controls['marque'].setValue(listData[0].marque);
    this.listJsForm.controls['nom'].setValue(listData[0].nom);
    this.listJsForm.controls['type'].setValue(listData[0].type);
    this.listJsForm.controls['proprietaire'].setValue(listData[0].proprietaire);
    this.listJsForm.controls['dateenregistrement'].setValue(listData[0].dateenregistrement);
    this.listJsForm.controls['kilometrage'].setValue(listData[0].kilometrage);

    this.listJsForm.controls['modele'].setValue(listData[0].modele);
    this.listJsForm.controls['matricule'].setValue(listData[0].matricule);
    this.listJsForm.controls['datefabrication'].setValue(listData[0].date);
    this.listJsForm.controls['status'].setValue(listData[0].status);
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

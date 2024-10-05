import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { ChauffeurService } from 'src/app/core/services/chauffeur.service';
import { HttpClient } from '@angular/common/http';

// Sweet Alert
import Swal from 'sweetalert2';

import { ListJsModel, paginationModel } from './chauffeur.model';
import { OrdersService } from './chauffeur.service';
import { NgbdListSortableHeader, listSortEvent } from './list-sortable.directive';
import { paginationlist } from 'src/app/core/data';

@Component({
  selector: 'app-listjs',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.scss'],
  providers: [OrdersService, DecimalPipe,ChauffeurService]

})

/**
 * Listjs table Component
 */
export class ChauffeurComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  listJsForm!: UntypedFormGroup;
  ListJsData!: ListJsModel[];
  checkedList: any;
  masterSelected!: boolean;
  ListJsDatas: any;
  ListChauffeurDates: any[] = [];

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

  constructor(private modalService: NgbModal, public service: OrdersService, private formBuilder: UntypedFormBuilder,public ChauffeurService:ChauffeurService) {
    this.ListJsList = service.countries$;
    this.total = service.total$;

    this.service.countries$.subscribe(data => {
      this.ListChauffeurDates = data;
      this.totalRecords = data.length;
      this.updatePagination();
    });


  
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
   
   // this.ChauffeurService.getChauffeurs().subscribe(data => {
     // this.ListChauffeurDates = data;
   // });

    this.updatePagination();
    this.service.getChauffeurs();

   
    this.breadCrumbItems = [
      { label: 'chauffeur' },
      { label: 'Liste', active: true }
    ];

    /**
     * Form Validation
     */
    this.listJsForm = this.formBuilder.group({
      ids: [''],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      adresse: [''],
      statut: ['']
    });


    /**
    * fetches data
    */
    this.ListJsList.subscribe(x => {
      this.ListJsDatas = Object.assign([], x);
    });
  
  
  
  

    this.paginationDatas = this.ListChauffeurDates
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
    console.log(this.ListChauffeurDates); 
  }

  /**
   * Form data get
   */
  get form() {
    return this.listJsForm.controls;
  }
 
  getStatusText(statut: number | string): string {
    const statusNumber = typeof statut === 'string' ? parseInt(statut, 10) : statut;

    
    switch(statusNumber) {

      case 1: return 'Disponible';  // ou tout autre texte approprié
      case 2: return 'En Livraison';
      case 3: return 'Non Disponible';   // ou tout autre texte approprié
      default: return 'Non Disponible';
    }
  }


  getBadgeClasses(statut: string): string {
    switch (statut) {
      case '1': return 'badge bg-success-subtle text-success';
      case '2': return 'badge bg-warning-subtle text-warning';
      case '3': return 'badge bg-danger-subtle text-danger';
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
  this.paginationDatas = this.ListChauffeurDates.slice(this.startIndex, this.endIndex);
}
  loadPage() {
    this.updatePagination();
  }

  /**
  * Save saveListJs
  */
  saveListJs() {
    if (this.listJsForm.valid) {
      const nom = this.listJsForm.get('nom')?.value;
      const prenom = this.listJsForm.get('prenom')?.value;
      const telephone = this.listJsForm.get('telephone')?.value;
      const adresse = this.listJsForm.get('adresse')?.value;
      const statut =this.listJsForm.get('statut')?.value;
      const chauffeurData = {
        nom,
        prenom,
        telephone,
        adresse,
        statut
        
      };

      if (this.listJsForm.get('ids')?.value) {
        const formValue = this.listJsForm.value;

        
        this.ChauffeurService.updateChauffeur(formValue.ids, chauffeurData).subscribe(
          response => {
            console.log('Chauffeur mis à jour', response);
            this.modalService.dismissAll();
            this.listJsForm.reset();
            this.submitted = true;
            this.service.getChauffeurs();
          },
          error => {
            console.error('Erreur lors de la mise à jour du chauffeur', error);
          }
        );





        this.ListJsDatas = this.ListJsDatas.map((data: { id: any; }) => data.id === this.listJsForm.get('ids')?.value ? { ...data, ...this.listJsForm.value } : data)
      } else {
        const nom = this.listJsForm.get('nom')?.value;
        const prenom = this.listJsForm.get('prenom')?.value;
        const telephone = this.listJsForm.get('telephone')?.value;
        const adresse = this.listJsForm.get('adresse')?.value;
        const statut =this.listJsForm.get('statut')?.value;
						  

        const chauffeurData = {
          nom,
          prenom,
          telephone,
          adresse,
          statut
          
        };
        
        this.ChauffeurService.createChauffeur(chauffeurData).subscribe(
          response => {
            console.log('Chauffeur ajouté avec succès', response);
            // Réinitialiser le formulaire ou naviguer vers une autre page si nécessaire
            this.service.getChauffeurs();
          },
          error => {
            console.error('Erreur lors de l\'ajout du chauffeur', error);
          }
        );		 
    
        



        this.ListJsDatas.push({
          nom,
          prenom,
          telephone,
          adresse   ,
          statut     
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
    this.listJsForm.controls['nom'].setValue(listData[0].nom);
    this.listJsForm.controls['prenom'].setValue(listData[0].prenom);
    this.listJsForm.controls['telephone'].setValue(listData[0].telephone);
    this.listJsForm.controls['adresse'].setValue(listData[0].adresse);
    this.listJsForm.controls['statut'].setValue(listData[0].statut);
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

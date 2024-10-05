import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


import { teamModel } from './team.model';
import { Team } from 'src/app/core/data';
import { ChauffeurService } from 'src/app/core/services/chauffeur.service';

import { GlobalComponent } from 'src/app/global-component';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { ListJsModel } from '../list/chauffeur.model';
import { Observable } from 'rxjs';
import { OrdersService } from '../list/chauffeur.service';
import { DecimalPipe } from '@angular/common';
import { paginationlist } from 'src/app/core/data';
const API_URL = GlobalComponent.API_URL;
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
   providers: [OrdersService, DecimalPipe,ChauffeurService]
})

/**
 * Team Component
 */
export class TeamComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  Team!: teamModel[];
  submitted = false;
  teamForm!: UntypedFormGroup;
  term: any;
  ListChauffeur: any; 

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

  listJsData: any[] = [];

  // Table data
  ListJsList!: Observable<ListJsModel[]>;
  total: Observable<number>;
  constructor(private formBuilder: UntypedFormBuilder, private modalService: NgbModal, private offcanvasService: NgbOffcanvas, public ChauffeurService: ChauffeurService, public service: OrdersService) {
    


    this.ListJsList = service.countries$;
    this.total = service.total$;

    this.service.countries$.subscribe(data => {
      this.ListChauffeurDates = data;
      this.totalRecords = data.length;
      this.updatePagination();
    });
}
  backurl =GlobalComponent.img_Url;
  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'chauffeurs', active: true }
    ];
  
    this.updatePagination();
    this.service.getChauffeurs();

  console.log ('not passed')
    /**
     * Form Validation
     */
    this.teamForm = this.formBuilder.group({
      _id: [''],
      name: ['', [Validators.required]],
      jobPosition: ['', [Validators.required]],
      projectCount: ['', [Validators.required]],
          taskCount: ['', [Validators.required]]
    });

    // Chat Data Get Function


    this._fetchData(); 
    

    
    this.paginationDatas = this.ListChauffeurDates
    this.totalRecords = this.paginationDatas.length

    this.startIndex = (this.page - 1) * this.pageSize + 1;
    this.endIndex = (this.page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.paginationDatas = paginationlist.slice(this.startIndex - 1, this.endIndex);
  }
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
  filteredChauffeurs() {
    if (!this.term) {
      return this.ListChauffeurDates;
    }

    return this.ListChauffeurDates.filter((data :any) => {
      return (
        data.nom.toLowerCase().includes(this.term.toLowerCase()) ||
        data.prenom.toLowerCase().includes(this.term.toLowerCase()) ||
        data.telephone.toLowerCase().includes(this.term.toLowerCase())
        // Add more fields if necessary
      );
    });
  }

  // trackBy function for better performance with ngFor
  trackById(index: number, item: any) {
    return item.id;
  }
  // Chat Data Fetch
  private _fetchData() {
    this.Team = Team;
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.teamForm = this.formBuilder.group({
      _id: [''],
      name: [''],
      jobPosition: [''],
      projectCount: [''],
      taskCount: ['']
    });
    this.modalService.open(content, { size: 'md', centered: true });
  }

  /**
  * Form data get
  */
  get form() {
    return this.teamForm.controls;
  }

  /**
  * Save Team
  */
  saveTeam() {
    if (this.teamForm.valid) {
      if (this.teamForm.get('_id')?.value) {
        this.Team = Team.map((order: { id: any; }) => order.id === this.teamForm.get('_id')?.value ? { ...order, ...this.teamForm.value } : order);
        this.modalService.dismissAll();
      } else {
        const id = '10';
        const backgroundImg = 'assets/images/small/img-6.jpg';
        const userImage = null;
        const name = this.teamForm.get('name')?.value;
        const jobPosition = this.teamForm.get('jobPosition')?.value;
        const projectCount = this.teamForm.get('projectCount')?.value;
        const taskCount = this.teamForm.get('taskCount')?.value;
        this.Team.push({
          id,
          backgroundImg,
          userImage,
          name,
          jobPosition,
          projectCount,
          taskCount
        });
        this.modalService.dismissAll()
      }
      this.submitted = true
    }
  }

  // Edit Data
  EditData(content: any, id: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Members';
    var updateBtn = document.getElementById('addNewMember') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    let econtent = this.Team[id];
    this.teamForm.controls['name'].setValue(econtent.name);
    this.teamForm.controls['jobPosition'].setValue(econtent.jobPosition);
    this.teamForm.controls['projectCount'].setValue(econtent.projectCount);
    this.teamForm.controls['taskCount'].setValue(econtent.taskCount);
    this.teamForm.controls['_id'].setValue(econtent.id);
    var coverimg: any = document.getElementById('cover-img');
    coverimg.src = econtent.backgroundImg

    var img: any = document.getElementById('member-img');
    if (econtent.userImage) {
      img.src = econtent.userImage
    } else {
      (document.getElementById("member-img") as HTMLElement).style.display = "block"
    }
  }

  /**
   * Active Toggle navbar
   */
  activeMenu(id: any) {
    document.querySelector('.star_' + id)?.classList.toggle('active');
  }

  /**
  * Delete Model Open
  */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    document.getElementById('t_' + id)?.remove();
  }

  // View Data Get
  viewDataGet(id: any) {
    var teamData = this.Team.filter((team: any) => {
      return team.id === id;
    });
    var profile_img = teamData[0].userImage ?
      `<img src="` + teamData[0].userImage + `" alt="" class="avatar-lg img-thumbnail rounded-circle mx-auto">` :
      `<div class="avatar-lg img-thumbnail rounded-circle flex-shrink-0 mx-auto fs-20">
        <div class="avatar-title bg-danger-subtle text-danger rounded-circle">`+ teamData[0].name[0] + `</div>
      </div>`
    var img_data = (document.querySelector('.profile-offcanvas .team-cover img') as HTMLImageElement);
    img_data.src = teamData[0].backgroundImg;
    var profile = (document.querySelector('.profileImg') as HTMLImageElement);
    profile.innerHTML = profile_img;
    (document.querySelector('.profile-offcanvas .p-3 .mt-3 h5') as HTMLImageElement).innerHTML = teamData[0].name;
    (document.querySelector('.profile-offcanvas .p-3 .mt-3 p') as HTMLImageElement).innerHTML = teamData[0].jobPosition;
    (document.querySelector('.project_count') as HTMLImageElement).innerHTML = teamData[0].projectCount;
    (document.querySelector('.task_count') as HTMLImageElement).innerHTML = teamData[0].taskCount;
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    document.getElementById('')
    this.teamForm.patchValue({
      // image_src: file.name
      image_src: 'avatar-8.jpg'
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      (document.getElementById('member-img') as HTMLImageElement).src = this.imageURL;
    }
    reader.readAsDataURL(file)
  }

  // File Upload
  bgimageURL: string | undefined;
  bgfileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    document.getElementById('')
    this.teamForm.patchValue({
      // image_src: file.name
      image_src: 'avatar-8.jpg'
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.bgimageURL = reader.result as string;
      (document.getElementById('cover-img') as HTMLImageElement).src = this.bgimageURL;
    }
    reader.readAsDataURL(file)
  }

}

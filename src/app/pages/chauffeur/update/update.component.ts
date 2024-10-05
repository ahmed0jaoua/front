import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import Swal from 'sweetalert2';
import { ClientService } from '../../clients/client.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service';
import { ListJsModel } from '../list/chauffeur.model';
import { Observable } from 'rxjs';
import { ChauffeurService } from 'src/app/core/services/chauffeur.service';
import { documentModel } from '../details/details.model';
import { GlobalComponent } from 'src/app/global-component';
@Component({
  selector: 'app-settings',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})

/**
 * Profile Settings Component
 */
export class UpdateComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  submitted = false;
  listJsForm!: UntypedFormGroup;
  ListJsData!: ListJsModel[];
  checkedList: any;
  masterSelected!: boolean;
  ListJsDatas: any;
  ListChauffeurDates: any[] = [];
  isEditMode: boolean = false;
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
  document!: documentModel[];
  documentList: { id: any; file: File, fileType: string, fileSize: string, updatedDate: string, fileName: string }[] = [];
    documentListP: {  id :any ;  file: File, fileType: string, fileSize: string, updatedDate: string, fileName: string }[] = [];
  selectedFile: File | null = null;
  idChauffeur: any; 
   backurl = GlobalComponent.img_Url;
  // Table data
  ListJsList!: Observable<ListJsModel[]>;
  constructor(private TokenStorageService: TokenStorageService, private modalService: NgbModal, private clientService: ClientService, public service: PaginationService,
    private formBuilder: UntypedFormBuilder, public datePipe: DatePipe, private router: Router,
    private restApiService: restApiService, private store: Store<{ data: RootReducerState }>, private route: ActivatedRoute,

    public ChauffeurService: ChauffeurService

  ) {
  }
  idClient: any;
  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Clients' },
      { label: 'list', active: true }
    ];

    const idParam = this.route.snapshot.paramMap.get('id');
    this.idChauffeur = idParam ? +idParam : null;

    this.loadFiles();
    /**
    * Form Validation
    */
    this.getChauffeur();
  this.listJsForm = this.formBuilder.group({
      ids: [''],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      numCin: [''],
      numPermis: [''],
      adresse: [''],
      code: [''],
      dateValiditePermis: [''],
      dateNaissance: [''],
      dateEmbauche: [''],
      statut: ['']
    });


  }


  viewFile(index: number): void {
    const file = this.documentList[index].file;
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    console.log(this.ListChauffeurDates); 
  }
  downloadFile(index: number): void {
    const file = this.documentList[index].file;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    link.click();
  }
  chauffeurPhoto: any; 
onFileSelectedPhoto(event: any): void {
  const file = event.target.files[0];
  if (file) {
    // Generate file metadata for the table
    const fileInfo = {
      id: 0,
      file: file,
      fileType: file.type,
      fileSize: (file.size / 1024).toFixed(2) + ' KB',
      updatedDate: new Date().toLocaleString(),
      fileName: file.name
    };

    this.chauffeurPhoto = fileInfo; // Only one file now
    this.uploadPhoto();
  }
}

uploadPhoto(): void {
  if (this.chauffeurPhoto) {
    const formData = new FormData();
    const doc = this.chauffeurPhoto; // Only handle one file now
    formData.append('file', doc.file, doc.fileName);

    // Upload the file and associate it with the chauffeurId
    this.ChauffeurService.uploadChauffeurPhoto(this.idChauffeur, formData).subscribe(
      (response) => {
        Swal.fire('Success', 'Photo uploaded successfully!', 'success');
        this.responsemessage = response;
        this.getChauffeur();
      },
      (error) => {
        const statusCode = error.status;
        if (statusCode === 409) {
          Swal.fire('Error', 'Photo already exists.', 'error');
        } else {
          Swal.fire('Error', 'An unexpected error occurred.', 'error');
        }
      }
    );
  } else {
    Swal.fire('Warning', 'No file to upload.', 'warning');
  }
}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Generate file metadata for the table
      const fileInfo = {
        id :0 , 
        file: file,
        fileType: file.type,
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        updatedDate: new Date().toLocaleString(),
        fileName: file.name
      };

      this.documentList.push(fileInfo);
   
      Swal.fire('Success', `${file.name} added to the list!`, 'success');
    }
  }

  removeFile(index: number): void {
    this.documentList.splice(index, 1); // Remove the file from the list
    Swal.fire('Deleted!', 'File removed from the list.', 'success');
  }

  deleteFile( fileId: number): void {
    this.ChauffeurService.deleteChauffeurFile(this.idChauffeur, fileId).subscribe(
        response => {
            Swal.fire('Success', response.message, 'success');
            this.loadFiles(); // Reload the files after deletion
        },
        error => {
            console.error('Error deleting file:', error);
            Swal.fire('Error', error.error?.error || 'An unexpected error occurred.', 'error');
        }
    );
}


  idchauffeurCree: any;
  saveListJs() {
    if (this.listJsForm.valid) {
     const nom = this.listJsForm.get('nom')?.value;
        const prenom = this.listJsForm.get('prenom')?.value;
        const telephone = this.listJsForm.get('telephone')?.value;
        const adresse = this.listJsForm.get('adresse')?.value;
        const statut = this.listJsForm.get('statut')?.value;
        const numCin = this.listJsForm.get('numCin')?.value;
        const code = this.listJsForm.get('code')?.value;
        const dateValiditePermis = this.listJsForm.get('dateValiditePermis')?.value;
        const dateNaissance = this.listJsForm.get('dateNaissance')?.value;
        const dateEmbauche = this.listJsForm.get('dateEmbauche')?.value;
        const numPermis = this.listJsForm.get('numPermis')?.value;

        const chauffeurData = {
          nom,
          prenom,
          telephone,
          adresse,
          statut,
          numCin,
          numPermis,dateEmbauche,dateNaissance,dateValiditePermis,code
        };

      if (this.listJsForm.get('ids')?.value) {



        this.ChauffeurService.updateChauffeur(this.idClient, chauffeurData).subscribe(
          response => {
            this.uploadFiles(); 
            let timerInterval: any;
            Swal.fire({
              title: 'chauffeur updated successfully!',
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
            this.submitted = true;

          },
          error => {
            console.error('Erreur lors de la mise à jour du chauffeur', error);
          }
        );






      } else {
      const nom = this.listJsForm.get('nom')?.value;
        const prenom = this.listJsForm.get('prenom')?.value;
        const telephone = this.listJsForm.get('telephone')?.value;
        const adresse = this.listJsForm.get('adresse')?.value;
        const statut = this.listJsForm.get('statut')?.value;
        const numCin = this.listJsForm.get('numCin')?.value;
        const code = this.listJsForm.get('code')?.value;
        const dateValiditePermis = this.listJsForm.get('dateValiditePermis')?.value;
        const dateNaissance = this.listJsForm.get('dateNaissance')?.value;
        const dateEmbauche = this.listJsForm.get('dateEmbauche')?.value;
        const numPermis = this.listJsForm.get('numPermis')?.value;

        const chauffeurData = {
          nom,
          prenom,
          telephone,
          adresse,
          statut,
          numCin,
          numPermis,dateEmbauche,dateNaissance,dateValiditePermis,code
        };

        this.ChauffeurService.createChauffeur(chauffeurData).subscribe(
          response => {
            let timerInterval: any;
            Swal.fire({
              title: 'chauffeur created successfully!',
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
            if (this.documentList.length > 0) {
              this.idchauffeurCree = response.id;  // Assuming `response.id` is the chauffeur's ID
            }
          },
          error => {
            console.error('Erreur lors de l\'ajout du chauffeur', error);
          }
        );

      }
    }

    setTimeout(() => {

    }, 2000);
    this.submitted = true

   
  }
  responsemessage :any ; 
  uploadFiles(): void {
    if (this.documentList.length > 0) {
      const formData = new FormData();
      this.documentList.forEach((doc, index) => {
       formData.append(`files[${index}]`, doc.file, doc.fileName);
        // formData.append(`fileIds[${index}]`, doc.id); 
      });
   
      // Upload files and associate them with the chauffeurId
      this.ChauffeurService.uploadChauffeurFiles(this.idChauffeur, formData).subscribe(
        (response) => {
          Swal.fire('Success', 'Files uploaded successfully!', 'success');
          this.responsemessage=response;
          this.loadFiles();
        },
        (error) => {
          const statusCode = error.status;
          if (statusCode === 409) {
            Swal.fire('Error', 'File already exists.', 'error');
          } else {
            Swal.fire('Error', 'An unexpected error occurred.', 'error');
          }
        }
      );
    } else {
      Swal.fire('Warning', 'No files to upload.', 'warning');
    }
  }
  files: any[] = [];
  loadFiles(): void {
    this.ChauffeurService.getChauffeurFiles(this.idChauffeur).subscribe(
      (response) => {
        this.files = response.files;
      },
      (error) => {
        console.error('Error fetching files:', error);
      }
    );
  }

  downloadFilel(fileName: string): void {
    this.ChauffeurService.downloadFile(fileName).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  goToClientDetails(clientId: string) {
    // Navigate to another route with the client ID
    this.router.navigate(['invoices/create', clientId]);
  }
  imgurl: any; 
  getChauffeur() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idClient = idParam ? +idParam : null;

    this.ChauffeurService.getChauffeur(this.idClient).subscribe(data => {
      if (data) {
         this.isEditMode = true;
        this.imgurl = data.uniquePhotoName;
        // Assuming `data` contains the chauffeur object
      this.listJsForm = this.formBuilder.group({
  ids: [data.id],
  nom: [data.nom, [Validators.required]],
  prenom: [data.prenom, [Validators.required]],
  telephone: [data.telephone, [Validators.required]],
  adresse: [data.adresse || ''], // Use empty string if adresse is null/undefined
  statut: [data.statut || ''], // Use empty string if statut is null/undefined
  numPermis: [data.numPermis || ''], // Use empty string if numPermis is null/undefined
  code: [data.code || ''], // Use empty string if code is null/undefined

  // Safely handle the date fields and convert them to 'YYYY-MM-DD' format
  dateValiditePermis: [
    data.dateValiditePermis
      ? new Date(data.dateValiditePermis).toISOString().split('T')[0]
      : '',
  ],
  dateNaissance: [
    data.dateNaissance
      ? new Date(data.dateNaissance).toISOString().split('T')[0]
      : '',
  ],
  dateEmbauche: [
    data.dateEmbauche
      ? new Date(data.dateEmbauche).toISOString().split('T')[0]
      : '',
  ],

  numCin: [data.numCin || ''], // Use empty string if numCin is null/undefined
});

      }
    });
  }


  client: any;
  getclient() {
    this.clientService.getClient(this.idClient).subscribe(data => {
      this.client = data;

    });
  }




  /**
  * Multiple Default Select2
  */
  selectValue = ['Illustrator', 'Photoshop', 'CSS', 'HTML', 'Javascript', 'Python', 'PHP'];

}

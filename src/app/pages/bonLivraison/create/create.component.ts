import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/core/services/client.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { SiteService } from 'src/app/core/services/site.service';
import { SiegeService } from 'src/app/core/services/siege.service';
import { VehiculeService } from 'src/app/core/services/vehicule.service';
import { ModePaiementService } from 'src/app/core/services/mode-paiement.service';
import { TypePaiementService } from 'src/app/core/services/type-paiement.service';
import { ChauffeurService } from 'src/app/core/services/chauffeur.service';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { UtilisateurService } from 'src/app/core/services/utilisateur.service';
import { TypeColisService } from 'src/app/core/services/type-colis-service.service';
import { et } from '@fullcalendar/core/internal-common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
interface Target {
  id: any;
  site1: any;
  site2: string | any;
  chauffeur: any;
  vehicule: any;
  livraison?: string;
  destfin: string;
  destdebut: string;
  order1: number;
  etat: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {

  isInputVisible: boolean = false; // Variable pour suivre l'état d'affichage de l'input

  ShowInput(event: Event): void {
    const checkbox = event.target as HTMLInputElement; // Obtenir l'élément checkbox
    this.isInputVisible = checkbox.checked; // Mettre à jour l'état en fonction de la case à cocher
  }
  breadCrumbItems!: Array<{}>;
  submitted = false;
  targets: Target[] = [];
  sites: any[] = [];
  sitesWithOther: any[] = [];
  sitesWithOther2: any[] = [];

  clients: any[] = [];
  filteredClients: any[] = [];
  filteredClientscode: any[] = [];
  filteredDes: any[] = [];
  articles: any[] = [];
  listeTrajet: any[] = [];
  livraison: any;
  groupedArticles: { [key: string]: any[] } = {};
  selectedExp: any;
  selectedDes: any;
  // Form fields
  nom1: string = '';
  codel: string = '';
  adresse: string = '';
  phone: string = '';
  activite: string = '';
  codec: string = '';
  raisonSocial: string = '';
  matriculeFiscale: string = '';
  email: string = '';
  selectedUtilisateur: any;


  nom1d: string = '';
  codeld: string = '';
  adressed: string = '';
  phoned: string = '';
  activited: string = '';
  codecd: string = '';
  raisonSociald: string = '';
  matriculeFiscaled: string = '';
  emaild: string = '';


  Groups: any[] = [];
  selectedGroup: any = null;
  listSigesByUser: any[] = [];
  paymentStatus: string = '';
  clientId: number = 0;
  destId: number = 0;
  searchTerm: any;
  originalClients: any[] = [];
  listeVehicule: any[] = [];
  listeModePaiement: any[] = [];
  listeTypePaiement: any[] = [];
  listeTrajetEtLigne: any[] = [];
  listeLigne: any[] = [];
  listeChauffeurs: any[] = [];
  orderList: any[] = [];
  searchResults: any;
  selectedArticles: any[] = [];
  selectedSite: String | null = null;
  selectedSite2: String | null = null;
  currentUser: any;
  activeNav: number = 1;
  idUtilisateur: number = 0;
  desNom: string = '';
  destelephone: string = '';
  nomt: string = '';
  reference: string = '';
  dateCreation: any;
  adresset: string = '';
  phonet: string = '';
  desAdresse: string = '';
  libellearticle: string = '';
  selectedModePaiment: any = null;
  selectedTypePaiment: any = null;
  selectedChauffeurR: any;
  selectedModePaimentCR: any = null;
  selectedTypePaimentCR: any = null;
  selectedTargets = {
    site1: null as string | null,
    site2: null as string | null,
    chauffeur: null,
    vehicule: null,
    customSite1: '',
    customSite2: '', order1: null
  };
  listeArticle: any[] = [];
  selectedDeliveryType: string = '';
  quantite: number = 0;
  selectedArticle: any;
  description: string = '';
  frais: number | null = null;
  MontantCR: number = 0;
  Montant: number | null = null;
  articlePaymentStatus: string = '';
  CR: boolean = false;
  numerocheque: string = '';

  nombanque: string = '';
  datecheque: string = '';
  objetadresse: string = '';
  montantCheque: number | null = null;
  typeColisOptions = [
    { id: 1, name: 'lourd' },
    { id: 2, name: 'fragile' },
    { id: 3, name: 'normal' }
  ];
  showModal = false;
  fraist: any;
  type1: any;
  defaultSiege: any;



  //customer 
 

  customerForm!: UntypedFormGroup;
  masterSelected!: boolean;
  checkedList: any;
  content?: any;
  customers?: any;
  // Table data
  customerList: any;
  filterDate: any;
  status: any = '';
  newCustomer: any;
  pageClients: any[] = [];
  isEditMode: boolean = false;
  facture: boolean = false;
  isFacture: boolean = false;
  isMonthly: boolean = false;
  //@ViewChild('customNav') customNav!: NgbNav;
  ///getActiveId() {
  // return this.customNav.activeId;
  //}

  showValidationErrors: boolean = false;
  
  setActiveTab(tabId: number) {

    this.activeNav = tabId;

  }
  onTabClick(step: number): void {
    if (this.canGoToStep(step)) {
      this.activeNav = step;
    }
  }

  showValidationdesErrors: boolean = false;
  validateAndProceed(): void {
   
  
    if (this.isFormValid()) {

      this.setActiveTab(4);
    } else {
      this.showValidationErrors = true;
    }
  }
  validatedesAndProceed(): void {
    if (this.isFormdesValid()) {
      this.setActiveTab(3);
    } else {
      this.showValidationdesErrors = true;
    }
  }
  showValidationrefDErrors = false;
  validaterefDAndProceed(): void {
    if (this.isFormRefDValid()) {
      this.setActiveTab(2);
    } else {

      this.showValidationrefDErrors = true;
    }
  }

  isFormRefDValid(): boolean {
    return this.reference !== '' ;
  }

  isFormdesValid(): boolean {
    return this.nom1d !== '' && this.adressed !== '' && this.phoned !== '';
  }
  showValidationArticlesErrors: boolean = false;

  isFormArticlesValid(): boolean {
    return this.isValidFloat(this.frais);
  }

  isValidFloat(value: any): boolean {
    return !isNaN(value) && parseFloat(value) == value;
  }
  isDropdownVisible: boolean = false;
  showDropdown(): void {
    this.isDropdownVisible = true;
  }

  // Hide the dropdown with a delay to allow selection click
  hideDropdown(): void {
    setTimeout(() => {
      this.isDropdownVisible = false;
    }, 200);
  }
  // Stop the event from propagating (useful when clicking inside the dropdown)
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }


  isFormValid(): boolean {
    return this.codec !== '' && this.nom1 !== '' && this.phone !== '' && this.adresse !== '';
  }
  // Logic to determine if the step is accessible
  canGoToStep(step: number): boolean {
    // Example logic: Prevent jumping directly to step 5 from step 1
    // You can customize this logic as per your requirements
    return step <= this.activeNav;
  }
  expedidateurstatut = false;





  openModal1(c: any): void {
    this.showModal = true;
    if (c === 0) {
      this.nomt = this.nom1, this.adresset = this.adresse, this.phonet = this.phone
      this.expedidateurstatut = false;
    } else if (c === 1) {
      this.nomt = this.nom1d, this.adresset = this.adressed, this.phonet = this.phoned
      this.expedidateurstatut = true;
    }

  }
  editAdresse() {
    if (this.expedidateurstatut === false) {
      this.nom1 = this.nomt, this.adresse = this.adresset, this.phone = this.phonet
    } else if (this.expedidateurstatut === true) {
      this.nom1d = this.nomt, this.adressed = this.adresset, this.phoned = this.phonet
      this.expedidateurstatut = true;
    }
    this.nomt = '';
    this.adresset = '';
    this.phonet = '';
    this.closeModal();

  }
  closeModal(): void {
    this.showModal = false;
    this.modalService.dismissAll();
    this.resetUtilisateurForm(); 
  }
  counter = 1;
  increment() {
    this.counter++;
  
    this.quantite = this.counter;
  }
  decrement() {
    this.counter--;
    this.quantite = this.counter;
  }


  formDataList: Array<{
    id: number | null, libellearticle: string; typeArticle: string; quantite: number; typeColis: { id: number; libelle: string; country: string } | null; description: string;
    idtypepaiment: number; idmodepaiment: number; frais: any; montant: any; numerocheque: string; montantCheque: number | null, nombanque: string, datecheque: string
    typepaiement: any, modepaiement: any; MontantCR: number, modepaiementCR: null, idmodepaimentCR: number; typepaiementCR: null; idtypepaimentCR: number; idTypeColis: number | null;
    CR: boolean;
  }> = [];

  addEntry(): void {
    if (this.isFormArticlesValid()) {
      const values = {
        id: this.editidligne,
        typeArticle: this.selectedDeliveryType,
        quantite: this.quantite,
        typeColis: this.selectedArticle ? this.selectedArticle : null,
        idTypeColis: this.selectedArticle && this.selectedArticle.id ? this.selectedArticle.id : null,
        description: this.description ? this.description : '',
        libellearticle: this.selectedArticle.libelle && this.selectedArticle.libelle ? this.selectedArticle.libelle : null,
        idtypepaiment: this.selectedTypePaiment ? this.selectedTypePaiment.id : null,
        idmodepaiment: this.selectedModePaiment ? this.selectedModePaiment.id : null,
        idtypepaimentCR: this.selectedTypePaimentCR ? this.selectedTypePaimentCR.id : null,
        idmodepaimentCR: this.selectedModePaimentCR ? this.selectedModePaimentCR.id : null,
        CR: this.CR ? this.CR : false,
        frais: this.frais,
        numerocheque: this.numerocheque,
        montant: this.Montant,
        MontantCR: this.MontantCR,
        nombanque: this.nombanque,
        datecheque: this.datecheque,
        montantCheque: this.montantCheque,
        modepaiement: this.selectedModePaiment,
        typepaiement: this.selectedTypePaiment,
        modepaiementCR: this.selectedModePaimentCR,
        typepaiementCR: this.selectedTypePaimentCR
      };

      if (this.editIndex !== null) {
        this.formDataList[this.editIndex] = values;
        this.editIndex = null;
      } else {
        this.formDataList.push(values);
      }

     

      this.resetForm();
      this.showValidationArticlesErrors = false;

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Article ajouté avec succès',
        showConfirmButton: false,
        timer: 1500
      });

    } else {
      this.showValidationArticlesErrors = true;

      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir correctement le formulaire avant de continuer.',
        confirmButtonText: 'OK'
      });
    }
  }


  resetForm(): void {
    this.selectedDeliveryType = '';
    this.quantite = 1;
    this.counter = 1;
    this.selectedArticle = null;
    this.description = '';

    this.libellearticle = '';
    this.nombanque = '';
    this.numerocheque = '';
    this.montantCheque = null;
    this.datecheque = '';
    this.frais = null;
    this.MontantCR = 0;
    this.CR = false;


  }

  

  /* setActiveTab(tabId: any): void {
   
     this.activeNav = tabId;
   }*/

  selectedDeliveryStatus: string = '';

  constructor(
    private clientService: ClientService,
    private formBuilder: UntypedFormBuilder,

    private http: HttpClient,
    public service: PaginationService,
    private router: Router,
    private BonlivraisonService: BonlivraisonService,
    private modalService: NgbModal,
    private SiteService: SiteService,
    private SiegeService: SiegeService,
    private VehiculeService: VehiculeService,
    private ModePaiementService: ModePaiementService,
    private TypePaiementService: TypePaiementService,
    private TypeColisService: TypeColisService,
    private ChauffeurService: ChauffeurService, private route: ActivatedRoute, private UtilisateurService: UtilisateurService
  ) { }
  siteParDefaut: any;
  uts: any;
  ibBon: any; type: any
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Bon livraison' },
      { label: 'Creation', active: true }
    ];
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
    this.quantite = this.counter;
      const currentDate = new Date();
    this.dateCreation = currentDate.toISOString().substring(0, 10);
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.currentUser = currentUser;
    this.defaultSiege = currentUser.sitepardefaut;

  

    

    this.clientService.getClients().subscribe((data: any[]) => {
      this.clients = data;
      this.originalClients = [...data];
    });
    this.objetadresse = this.adresse;

    this.SiegeService.getSiegesparIdUTilisateur(this.currentUser.id).subscribe((data: any[]) => {
      this.listSigesByUser = data;
    });

  
    this.TypeColisService.getAll().subscribe((data: any[]) => {
      this.listeArticle = data;
    });

    this.ModePaiementService.getModePaiement().subscribe((data: any[]) => {
      this.listeModePaiement = data;
    });
    this.TypePaiementService.getTypePaiement().subscribe((data: any[]) => {
      this.listeTypePaiement = data;
    });
  

    // this.ChauffeurService.getchauffeurparstatut(status).subscribe((data: any[]) => {
    //   this.listeChauffeurs = data;
    // });
    // this.UtilisateurService.getAllUtil().subscribe(data => {
    //   this.uts = data;

    //   });
      this.VehiculeService.getVehiculesparstatus().subscribe((data: any[]) => {
      this.listeVehicule = data;
    });
      const status = {
      statut: "1"
    }
    this.ChauffeurService.getchauffeurparstatut(status).subscribe((data: any[]) => {
      // Add a type property to differentiate between chauffeurs and utilisateurs
      this.listeChauffeurs = data.map(item => ({
        ...item,
        type: 'Chauffeur',
        label: item.nom + ' ' + item.prenom
      }));

      this.UtilisateurService.getAllUtil().subscribe(data => {
        this.uts = data.map(item => ({
          ...item,
          type: 'Utilisateur',
          label: item.nom + ' ' + item.prenom
        }));


        this.Groups = [...this.listeChauffeurs, ...this.uts];
      });
    });


    this.getLivETsesDetails();



    this.SiegeService.getSieges().subscribe((data: any[]) => {
  
      
      this.sites = data;
    });

  }
  getTypeColi() {
    this.TypeColisService.getAll().subscribe(data => {
      this.uts = data;

    });

  }
  
  createClient() {
    if (this.customerForm.invalid) {

      return;
    }

    this.clientService.createClient(this.customerForm.value).subscribe({
      next: (data) => {
       this.codec =data.code; 
       this.nom1=data.nom;
       this.phone=data.phone; 
       this.adresse=data.adresse; 
       this.email= data.email; 
       this.clientId = data.id;
       
        this.clientService.getClients().subscribe((data: any[]) => {
          this.clients = data;
          this.originalClients = [...data];
        });
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
  resetUtilisateurForm() {

    this.type1 =null;
this.fraist=null; 
  }

  selectTypeArticle() {

    this.frais = this.selectedArticle?.frais
   if ( !this.selectedArticle ){
    this.frais= null
   }
  }
  closeArticleModal() {
    

    this.modalService.dismissAll();
    this.resetForm();
  }
  createArticle() {
    const type = {
      frais: this.fraist,
      libelle: this.type1,

    }
    this.isFormInvalid = true;
    if (!this.type1 && !this.fraist) {
      this.isFormInvalid = true;


      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs ',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

      return;
    }
    this.TypeColisService.add(type).subscribe({
      next: (data) => {

        
        this.TypeColisService.getAll().subscribe((data: any[]) => {
          this.listeArticle = data;
        });
        this.modalService.dismissAll();
        this.resetUtilisateurForm();
        let timerInterval: any;
        Swal.fire({
          title: 'Article crée avec succes',
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
          type;
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating type:', error);
      }
    });

    this.submitted = true;
  }
  editIndex: number | null = null;
  editidligne: number = 0;
  editEntry(content: any , index: number, ide: any): void {
    const item = this.formDataList[index];
    this.selectedDeliveryType = item.typeArticle;
    this.quantite = item.quantite;
    this.counter = item.quantite;
    this.selectedArticle = item.typeColis;
    this.description = item.description;
    this.libellearticle = item.libellearticle;
    this.selectedTypePaiment = item.typepaiement;
    this.selectedModePaiment = item.modepaiement;
    this.selectedModePaimentCR = item.modepaiementCR;
    this.selectedTypePaimentCR = item.typepaiementCR;
    this.frais = item.frais;
    this.numerocheque = item.numerocheque;
    this.Montant = item.montant;
    this.MontantCR = item.MontantCR;
    this.CR = item.CR,
      this.nombanque = item.nombanque;
    if (item.datecheque) {
      const date = new Date(item.datecheque);
      this.datecheque = date.toISOString().substring(0, 10);
    }
    //this.datecheque =  item.datecheque.toISOString().substring(0, 10);
    this.montantCheque = item.montantCheque;
    this.editIndex = index;
    this.editidligne = ide;



    this.modalService.open(content, { size: 'md', centered: true });
  }

  getLivETsesDetails() {

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    this.ibBon = id;
    if (id !== null) {
      this.BonlivraisonService.findListLigneAndtrajetParIdLivraison(id).subscribe((data: any) => {
        this.listeTrajetEtLigne = data;

        if (data.ligneLivraisons) {
          this.listeLigne = data.ligneLivraisons;
          this.formDataList = data.ligneLivraisons;
        }

        if (data.trajets) {
          this.listeTrajet = data.trajets;
          this.targets = data.trajets;
          this.targets.sort((a, b) => a.order1 - b.order1);
          this.orderList = this.targets.map(trajet => trajet.order1);
        }

   
      });
    } else {
      console.error('ID parameter is missing or invalid');
    }
    if (id !== null) {
      this.BonlivraisonService.findLivraisonById(id).subscribe((data: any) => {
        this.livraison = data;
        this.reference = data.reference;
        if (data.dateLivraison) {
          const date = new Date(data.dateLivraison);
          this.dateCreation = date.toISOString().substring(0, 10);
        }
        this.nom1 = data.expediteur;
        this.adresse = data.adresseExpediteur;
        this.phone = data.telephoneExpediteur;
        this.codecd = data.codedes;
        this.codec = data.client.code;
        this.email = data.emailExpediteur;
        this.nom1d = data.Destinataire;
        this.adressed = data.adresseDestinataire;
        this.phoned = data.telephoneDestinataire;
        this.emaild = data.emailDestinataire;
        this.clientId = data.client.id;
        this.selectedTypePaiment = data.TypePaiement;
        this.selectedModePaiment = data.ModePaiement; 
        // this.selectedChauffeurR = data.chauffeurRamassage;
        // this.selectedUtilisateur = data.utilisateur;


        // Logic for handling chauffeurRamassage or utilisateurRamassage
        if (data.chauffeurRamassage === null) {
          // If chauffeurRamassage is null, select utilisateurRamassage
          this.selectedGroup = {
            ...data.utilisateurRamassage,
            type: 'Utilisateur',
            label: data.utilisateurRamassage.nom + ' ' + data.utilisateurRamassage.prenom
          };
        } else {
          // If chauffeurRamassage exists, select it
          this.selectedGroup = {
            ...data.chauffeurRamassage,
            type: 'Chauffeur',
            label: data.chauffeurRamassage.nom + ' ' + data.chauffeurRamassage.prenom
          };
        }

      });
    }
  }
  // Delete Entry
  deleteEntry(index: number): void {
    this.formDataList.splice(index, 1);
  }

  openModal2(content: any, modalType: string) {
    this.submitted = false;

    // Decide which modal to open based on modalType
    if (modalType === 'firstModal') {
      this.modalService.open(content, { size: 'md', centered: true });
    }
  }
  trajetStatus = false;
  openModal(content: any) {
    this.trajetStatus = false;
      this.VehiculeService.getVehiculesparstatus().subscribe((data: any[]) => {
      this.listeVehicule = data;
    });
      const status = {
      statut: "1"
    }
 this.ChauffeurService.getchauffeurparstatut(status).subscribe((data: any[]) => {
      // Add a type property to differentiate between chauffeurs and utilisateurs
      this.listeChauffeurs = data.map(item => ({
        ...item,
        type: 'Chauffeur',
        label: item.nom + ' ' + item.prenom
      }));

      this.UtilisateurService.getAllUtil().subscribe(data => {
        this.uts = data.map(item => ({
          ...item,
          type: 'Utilisateur',
          label: item.nom + ' ' + item.prenom
        }));


        this.Groups = [...this.listeChauffeurs, ...this.uts];
      });
    });

    

    this.selectedTargets.site1 = this.defaultSiege;
    if (this.targets.length > 0) { this.selectedTargets.site1 = this.targets[this.targets.length - 1].site2 }

    this.SiegeService.getSieges().subscribe((data: any[]) => {
  
      this.sites = data;
      this.sitesWithOther = [
        ...this.sites,
        { id: 'other', adresse: 'Other', nom: this.adresse }
      ];

      this.sitesWithOther2 = [
        ...this.sites,
        { id: 'other', adresse: 'Other', nom: this.adressed }
      ];
    });

    this.siteParDefaut
    this.objetadresse = this.adresse;
   
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });

    const highestOrder = this.orderList.length > 0 ? Math.max(...this.orderList) : 0;
    this.order1 = highestOrder + 1;


  }
  getTotalQuantite(): number {
    return this.formDataList.reduce((total, item) => {
      const quantite = item.quantite || 0; // Convert to number
      return total + quantite;
    }, 0);
  }

  getFrais(): number {
    return this.formDataList.reduce((total, item) => {
      const Lfrais = item.quantite * item.frais; // Convert to number
      return Lfrais;
    }, 0);
  }

  getTotalFrais(): number {
    return this.formDataList.reduce((total, item) => {
      const frais = item.quantite * item.frais; // Convert to number

      return Math.floor(total + frais);
    }, 0);
  }

  getTotalFraisbl(): number {
    return this.listeLigne.reduce((total, ligne) => total + (ligne.frais * ligne.quantite || 0), 0);
  }

  getTotalWithTVA(): number {
    const totalFrais = this.getTotalFraisbl();
    const tvaRate = 0.19; // TVA de 19%
    return totalFrais * tvaRate;
  }

  getTotalTTC(): number {
    const totalFrais = this.getTotalFraisbl();
    const totaltva = this.getTotalWithTVA();

    return totalFrais + totaltva;
  }


  getTotalCR(): number {
    return this.formDataList.reduce((total, item) => {
      const MontantCR = item.MontantCR;
      return Math.floor(total + MontantCR);
    }, 0);
  }











  order1: any;
  addTarget() {
    const site1Value = this.selectedTargets.site1 === 'other' ? this.selectedTargets.customSite1 : this.selectedTargets.site1;
    const site2Value = this.selectedTargets.site2 === 'other' ? this.selectedTargets.customSite2 : this.selectedTargets.site2;

    if (this.order1 <= 0) {
      // If the order is 0 or less, trigger SweetAlert
      Swal.fire({
        icon: 'warning',
        title: 'Ordre invalide',
        text: `L'ordre ${this.order1} doit être supérieur à 0.`,
        confirmButtonText: 'OK'
      });
    } else if (this.orderList.includes(this.order1)) {
      // If the order already exists, trigger SweetAlert
      Swal.fire({
        icon: 'warning',
        title: 'Ordre existe déjà',
        text: `L'ordre ${this.order1} existe déjà dans la liste.`,
        confirmButtonText: 'OK'
      });
    } else {
      // If the order is valid and does not exist in the list, add to targets
      this.targets.push({
        id: null,
        site1: site1Value,
        site2: site2Value,
        chauffeur: this.selectedTargets.chauffeur,
        vehicule: this.selectedTargets.vehicule,
        livraison: this.selectedDeliveryStatus,
        destfin: this.adressed,
        destdebut: this.adresse,
        order1: this.order1,
        etat: '',
      });
    }
    this.orderList = this.targets.map(trajet => trajet.order1);


    this.targets.sort((a, b) => a.order1 - b.order1);
    // Reset the selected targets
    const highestOrder = this.orderList.length > 0 ? Math.max(...this.orderList) : 0;
    this.order1 = highestOrder + 1;

    this.selectedTargets = {
      site1: this.targets[this.targets.length - 1].site2,
      site2: null,
      chauffeur: null,
      vehicule: null,
      customSite1: '',
      customSite2: '',
      order1: null,
    };
    this.selectedDeliveryStatus = '';
    this.modalService.dismissAll;
   
  }
  editIndexT: number | null = null;
  idT: any;
  etatraget: any;
  editTarget(content: any, index: number, idTrajet: any) {
    this.selectedTargets.site1 = this.defaultSiege;
    if (this.targets.length > 0) { this.selectedTargets.site1 = this.targets[this.targets.length - 1].site2 }

    this.idT = idTrajet;
    this.sitesWithOther = [
      ...this.sites,
      { id: 'other', adresse: 'Other', nom: this.adresse }
    ];

    this.sitesWithOther2 = [
      ...this.sites,
      { id: 'other', adresse: 'Other', nom: this.adressed }
    ];


    this.trajetStatus = true;
    const target = this.targets[index];
    this.sitesWithOther2, this.sitesWithOther,
      this.selectedTargets.site1 = target.site1 ?? this.sitesWithOther.find(site => site.nom === target.destdebut);
    this.selectedTargets.site2 = target.site2 ?? this.sitesWithOther2.find(site => site.nom === target.destfin);

 
    this.selectedTargets.chauffeur = target.chauffeur;
    this.selectedTargets.vehicule = target.vehicule;
    this.editIndexT = index;
    this.order1 = target.order1;
    this.etatraget = target.etat;
    this.modalService.open(content, { size: 'md', centered: true });
  }
  updateTarget() {
    if (this.editIndexT !== null) {
      const site1Value = this.selectedTargets.site1 === 'other' ? this.selectedTargets.customSite1 : this.selectedTargets.site1;
      const site2Value = this.selectedTargets.site2 === 'other' ? this.selectedTargets.customSite2 : this.selectedTargets.site2;

      // Update the existing target in the array
      if (this.order1 <= 0) {
        // If the order is 0 or less, trigger SweetAlert
        Swal.fire({
          icon: 'warning',
          title: 'Ordre invalide',
          text: `L'ordre ${this.order1} doit être supérieur à 0.`,
          confirmButtonText: 'OK'
        });
      } else if (this.orderList.includes(this.order1) && this.targets[this.editIndexT].order1 !== this.order1) {
        // If the order already exists, trigger SweetAlert
        Swal.fire({
          icon: 'warning',
          title: 'Ordre existe déjà',
          text: `L'ordre ${this.order1} existe déjà dans la liste.`,
          confirmButtonText: 'OK'
        });
      } else {
        // If the order is valid and does not exist in the list, add to targets
        this.targets[this.editIndexT] = {
          id: this.idT,
          site1: site1Value,
          site2: site2Value,
          chauffeur: this.selectedTargets.chauffeur,
          vehicule: this.selectedTargets.vehicule,
          livraison: this.selectedDeliveryStatus, destfin: this.adressed,
          destdebut: this.adresse,
          order1: this.order1,
          etat: this.etatraget
        };
      }

      this.orderList = this.targets.map(trajet => trajet.order1);

      this.targets.sort((a, b) => a.order1 - b.order1);
      // Reset the edit index
      this.editIndexT = null;


      this.selectedTargets = {
        site1: this.targets.length > 0 ? this.targets[this.targets.length - 1].site2 : null,
        site2: null,
        chauffeur: null,
        vehicule: null,
        customSite1: '',
        customSite2: '', order1: null
      };
      this.selectedDeliveryStatus = '';
    }


    this.modalService.dismissAll();
  }
  deleteTarget(index: number) {
    this.targets.splice(index, 1);
    this.targets.sort((a, b) => a.order1 - b.order1);
    this.orderList = this.targets.map(trajet => trajet.order1);
  }

  isFormInvalid = false;
  submitforme1() {
    this.isFormInvalid = true;
    if (!this.selectedTargets.site1 || !this.selectedTargets.site2 || !this.selectedTargets.chauffeur || !this.selectedTargets.vehicule) {
      this.isFormInvalid = true;


      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs ',
        icon: 'error',
        confirmButtonText: 'Ok'
      });

      return;
    }


    if (this.trajetStatus === false) {
      this.addTarget();

    } else { this.updateTarget(); }

  }

  submitforme2() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (id !== null) {
      this.updatelivraison();
    } else { this.savelivraison() }

  }
  onSite1Change(selectedValue: string) {
    if (selectedValue === 'other') {
      this.selectedTargets.customSite1 = ''; // Reset custom input
    }
    this.displayAddress(selectedValue, 'site1');
  }

  onSite2Change(selectedValue: string) {
    if (selectedValue === 'other') {
      this.selectedTargets.customSite2 = ''; // Reset custom input
    }
    this.displayAddress(selectedValue, 'site2');
  }

  displayAddress(siteId: string, siteField: string) {
    const site = this.sites.find(s => s.id === siteId);
    if (site) {
      if (siteField === 'site1') {
        this.selectedTargets.customSite1 = site.adresse;
      } else {
        this.selectedTargets.customSite2 = site.adresse;
      }
    }
  }



  groupArticlesByCommande(): void {
    this.groupedArticles = this.articles.reduce((groups, article) => {
      const commande = article.commande;
      if (!groups[commande]) {
        groups[commande] = [];
      }
      groups[commande].push(article);
      return groups;
    }, {});
  }

  selectClient(client: any): void {
    this.nom1 = client.nom;
    this.adresse = client.adresse;
    this.phone = client.phone;
    this.activite = client.activite;
    this.codec = client.code;
    this.raisonSocial = client.raisonSocial;
    this.matriculeFiscale = client.matriculeFiscale;
    this.email = client.email;
    this.clientId = client.id;
    this.filteredClients = [];
    this.filteredClientscode = [];

    this.selectedExp = client
  }
  selectDestinateur(client: any): void {
    this.nom1d = client.nom;
    this.adressed = client.adresse;
    this.phoned = client.phone;
    this.activited = client.activite;
    this.codecd = client.code;
    this.raisonSociald = client.raisonSocial;
    this.matriculeFiscaled = client.matriculeFiscale;
    this.emaild = client.email;
    this.destId = client.id;
    this.filteredDes = [];
    this.filteredDesCode = [];
    this.selectedDes = client;
  }
  selectnone() {
    this.filteredDes = []; this.filteredClients = [];
    this.filteredClientscode = [];
    this.filteredDesCode = [];
  }
  onNomChange(value: string): void {
    this.filterClients(value);
  }
  onNomChangecode(value: string): void {
    this.filterClientscode(value);
  }

  onNomChangeDest(value: string): void {
    this.filterDestinateur(value);
  }
  onNomChangeDestCode(value: string): void {
    this.filterDesCode(value);
  }
  filterClients(value: string): void {
    this.filteredClients = this.clients.filter(client =>
      client.nom.toLowerCase().includes(value.toLowerCase())
    );
  }
  filterClientscode(value: string): void {
    this.filteredClientscode = this.clients.filter(client =>
      client.code.toLowerCase().includes(value.toLowerCase())
    );
  }
  filterDestinateur(value: string): void {
    this.filteredDes = this.clients.filter(client =>
      client.nom.toLowerCase().includes(value.toLowerCase())
    );
  }
  filteredDesCode: any[] = [];
  filterDesCode(value: string): void {
    this.filteredDesCode = this.clients.filter(client =>
      client.code.toLowerCase().includes(value.toLowerCase())
    );
  }
  goToClientDetails(clientId: string) {
    this.router.navigate(['invoices/create', clientId]);
  }

  performSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.clients = [...this.originalClients];
    } else {
      this.searchResults = this.originalClients.filter((item: any) => {
        return item.code.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
      this.clients = this.service.changePage(this.searchResults);
    }
  }

  onCheckboxChange(article: any) {
    if (article.selected) {
      this.selectedArticles.push(article);
    } else {
      const index = this.selectedArticles.findIndex(a => a.id === article.id);
      if (index !== -1) {
        this.selectedArticles.splice(index, 1);
      }
    }
  }
  onSort(column: any) {
    this.clients = this.service.onSort(column, this.clients);
  }

  confirm(content: any) {
    this.modalService.open(content, { centered: true });
  }

  idcreatedLivraison: any;
  suivant() {
    this.setActiveTab(6);

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.targets, event.previousIndex, event.currentIndex);
  }
  savelivraison() {

    const livraisonData = {
      reference: this.reference,
      dateLivraison: this.dateCreation,
      expediteur: this.nom1,
      telephoneExpediteur: this.phone,
      adresseExpediteur: this.adresse,
      emailExpediteur: this.email,
      idClient: this.clientId,
      destinataire: this.nom1d,

      
      telephoneDestinataire: this.phoned,
      adresseDestinataire: this.adressed,
      emailDestinataire: this.email,
      idUtilisateur: this.currentUser.id,
      agent: { id: this.selectedGroup ? this.selectedGroup.id : null, type: this.selectedGroup ? this.selectedGroup.type : null },
      listeArticle: this.formDataList,
      frais: this.getTotalFrais(),
      totalCR: this.getTotalCR(),
      quantite: this.getTotalQuantite(),
      listeTrajet: this.targets,
      defaultSiege: this.defaultSiege,
      codecd: this.codecd,
      typePaiment: this.selectedTypePaiment,
      modePaiment: this.selectedModePaiment

    }

    this.BonlivraisonService.createbon(livraisonData).subscribe(response => {

      this.setActiveTab(5);
      this.idcreatedLivraison = response.id;
      this.BonlivraisonService.findLivraisonById(response.id).subscribe((data: any) => {
        this.livraison = data;

      });

      this.BonlivraisonService.findListLigneAndtrajetParIdLivraison(response.id).subscribe((data: any) => {
        this.listeTrajetEtLigne = data;

        if (data.ligneLivraisons) {
          this.listeLigne = data.ligneLivraisons;
          this.formDataList = data.ligneLivraisons;
        }

        if (data.trajets) {
          this.listeTrajet = data.trajets;
          this.targets = data.trajets;
          this.targets.sort((a, b) => a.order1 - b.order1);
          this.orderList = this.targets.map(trajet => trajet.order1);
        }

      });
    }, error => {
      console.error('Error saving data', error);

      Swal.fire({
        title: 'Erreur!',
        text: error.status,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });


  }
  updatelivraison() {

    const livraisonData = {
      reference: this.reference,
      dateLivraison: this.dateCreation,
      expediteur: this.nom1,
      telephoneExpediteur: this.phone,
      adresseExpediteur: this.adresse,
      emailExpediteur: this.email,
      idClient: this.clientId,
      destinataire: this.nom1d,
      telephoneDestinataire: this.phoned,
      adresseDestinataire: this.adressed,
      emailDestinataire: this.email,
      idUtilisateur: this.currentUser.id ?? 0,
      listeArticle: this.formDataList,
      frais: this.getTotalFrais(),
      totalCR: this.getTotalCR(),
      quantite: this.getTotalQuantite(),
      listeTrajet: this.targets,
      defaultSiege: this.defaultSiege,
      codecd: this.codecd,
      typePaiment: this.selectedTypePaiment,
      modePaiment: this.selectedModePaiment,
      //  idc : this.selectedChauffeurR.id,
      agent: { id: this.selectedGroup ? this.selectedGroup.id : null, type: this.selectedGroup ? this.selectedGroup.type : null },
    }
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    this.BonlivraisonService.updateLivraison(livraisonData, id).subscribe(response => {
      console.log('livraison saved successfully');
      this.setActiveTab(5);
      this.getLivETsesDetails();
    }, error => {
      console.error('Error saving data', error);
    });

   
  }
  @ViewChild('printableContent', { static: false }) printableContent!: ElementRef;


}

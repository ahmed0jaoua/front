import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-status.component.html',
  styleUrls: ['./orders-status.component.scss']
})

/**
 * OrdersDetails Component
 */
export class BonStatusComponent implements OnInit {

  listeTrajetEtLigne: any;
  breadCrumbItems!: Array<{}>;
  listeLigne: any[] = [];
  listeTrajet: any[] = [];

  livraison: any;
  listeLivraison: any;
  defaultSiege: any;
  status: any;
  selectedStatut: any;
  ficheRoute: any;
  constructor(private route: ActivatedRoute, private BonlivraisonService: BonlivraisonService) { }
  activeIndex: number | null = null;
  selectedOption: { label: string, icon: string } | null = null;


  // Method to update the selected option
  selectOption(label: string, icon: string) {
    this.selectedOption = { label, icon };
  }
  toggle(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }
  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'fiche de Route Entrant   ' },
      { label: ' status', active: true }
    ];
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.defaultSiege = currentUser.sitepardefaut;

    this.status = [
      { id: 0, name: 'En Attente' },
      { id: 1, name: 'signé' },
      { id: 2, name: 'terminé' },
      { id: 3, name: 'en probleme' },
    
    ];

    this.getLigneLivEtTrajet();
    this.getArticleByFicheDeRoute();


  }

  getFilteredTrajets(livraisonData: any): any[] {

    return livraisonData.trajets.filter((trajet: any) =>
      trajet?.site2?.nom === this.defaultSiege.nom
    );
  }

  getArticleByFicheDeRoute() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (id !== null) {
      this.BonlivraisonService.getArticleByFicheDeRoute(id).subscribe((data: any) => {
        this.listeLivraison = data.livraisons;
        this.ficheRoute = data.ficheRoute;
        this.selectedStatut = Number(this.ficheRoute.etat);
      });
    } else {

      console.error('ID parameter is missing or invalid');
    }
  }


  trajetStatus: any; // Object to hold the status for each trajet
  selectedTrajetId: number = 0; // This should be set according to the selected trajet


  getLigneLivEtTrajet() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (id !== null) {
      this.BonlivraisonService.findListLigneAndtrajetParIdLivraison(id).subscribe((data: any) => {
        this.listeTrajetEtLigne = data;

        if (data.ligneLivraisons) {
          this.listeLigne = data.ligneLivraisons;
        }

        if (data.trajets) {
          this.listeTrajet = data.trajets;
        }

        console.log('Ligne Livraisons:', this.listeLigne);
        console.log('Trajets:', this.listeTrajet);
      });
    } else {
      console.error('ID parameter is missing or invalid');
    }
    if (id !== null) {
      this.BonlivraisonService.findLivraisonById(id).subscribe((data: any) => {
        this.livraison = data;
      });
    }

  }
  // For example, you might have a method to handle when a trajet is selected
  onTrajetSelect(trajetId: number) {
    this.selectedTrajetId = trajetId;
  }

  // Method to handle status changes
  onStatusChange(selectedStatus: string) {
    if (this.selectedTrajetId !== undefined) {
      this.trajetStatus[this.selectedTrajetId] = selectedStatus;
    }
  }

  clic() {
    console.log(this.selectedStatut);

  }

  updateStatusFicheDeRoute() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    const etat = {
      etat: this.selectedStatut
    }
    this.BonlivraisonService.changeEtatDuFicheRoute(id, etat).subscribe(response => {

      this.BonlivraisonService.getArticleByFicheDeRoute(id).subscribe((data: any) => {
        this.listeLivraison = data.livraisons;
        this.ficheRoute = data.ficheRoute;
      });

      let timerInterval: any;
      Swal.fire({
        title: 'statut fiche changé avec succés',
        icon: 'success',
        timer: 1000,
        timerProgressBar: true,
        willClose: () => {
          clearInterval(timerInterval);
        },
      })
    }, error => {
      console.error('Error saving data', error);

    });


  }

  updateStatusArticle() {


    this.BonlivraisonService.updateStatutArticle(this.listeLivraison).subscribe(response => {
      console.log('status saved successfully', response);
      this.getLigneLivEtTrajet();

      let timerInterval: any;
      Swal.fire({
        title: 'statut changé avec succés',
        icon: 'success',
        timer: 1000,
        timerProgressBar: true,
        willClose: () => {
          clearInterval(timerInterval);
        },
      })
    }, error => {
      console.error('Error saving data', error);

    });


  }
}

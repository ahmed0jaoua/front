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


  constructor(private route: ActivatedRoute, private BonlivraisonService: BonlivraisonService) { }
  activeIndex: number | null = null;

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
      { label: 'bon livraison' },
      { label: 'bon Details', active: true }
    ];

this.getLigneLivEtTrajet();

  }


  statusOptions = [
    { value: '2', label: 'Delivered' },
    { value: '1', label: 'In Transit' },
    { value: '3', label: 'Missed' }
  ];

  trajetStatus: any; // Object to hold the status for each trajet
  selectedTrajetId: number = 0; // This should be set according to the selected trajet


  getLigneLivEtTrajet() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (id !== null) {
      this.BonlivraisonService.findListLigneAndtrajetParIdLivraison(id).subscribe((data: any) => {
        this.listeTrajetEtLigne = data;

        // Extract ligneLivraisons and trajets from the data
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
    console.log(this.listeLigne);

  }

  updateStatusArticle() {


    this.BonlivraisonService.updateLivraisonStatus(this.listeLigne).subscribe(response => {
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

    console.log();
  }
}

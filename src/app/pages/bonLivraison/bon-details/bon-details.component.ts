import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})

/**
 * OrdersDetails Component
 */
export class BonDetailsComponent implements OnInit {
   
  listeTrajetEtLigne: any;
  breadCrumbItems!: Array<{}>;
  listeLigne: any[] = [];
  listeTrajet: any[] = [];
  livraison :any ; 
  config = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false
  };
  

  constructor(private route: ActivatedRoute, private BonlivraisonService: BonlivraisonService) {}
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
          this.listeTrajet.sort((a, b) => b.etat - a.etat);
        }
      
        console.log('Ligne Livraisons:', this.listeLigne);
        console.log('Trajets:', this.listeTrajet);
      });
    } else {
      console.error('ID parameter is missing or invalid');
    }
    if (id !== null) {
      this.BonlivraisonService.findLivraisonById(id).subscribe((data: any) => {
        this.livraison =data ; 
       });
    }
  
 
  }


    getStatusText(status: number | string): string {
      const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;

    switch (statusNumber) {
      case 0: return 'En attente';
      case 1: return 'actuel';
      case 2: return 'En route';
      case 3: return 'Livré';
      default: return 'N/A';
    }
  }

  getStatusArticle(status: number | string): string {
    const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;

  switch (statusNumber) {
    case 0: return 'En attente';
    case 1: return 'En route';
    case 2: return 'Livré';
    default: return 'N/A';
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
}

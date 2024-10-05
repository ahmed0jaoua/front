import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../../invoices/commande.service'; 
import { ActivatedRoute } from '@angular/router';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

/**
 * Details Component
 */
export class DetailsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  codeco: string = '';
  dateCreation: Date = new Date();
  paymentStatus: string = '';
  totalAmount: number = 0;
  nom1: string = '';
  adresse: string = '';
  phone: string = '';
  activite: string = '';
  codec: string = '';
  raisonSocial: string = '';
  matriculeFiscale: string = '';
  email: string = '';
  items: any[] = [];
  subTotal: number = 0;
  estimatedTax: number = 0;
  discount: number = 0;
  shippingCharge: number = 0;
  paymentMethod: string = '';
  cardHolderName: string = '';
  cardNumber: string = '';
  note: string = '';
  articles: any[] = [];
  commande: any;

  constructor(private CommandeService: CommandeService, private route: ActivatedRoute ,private BonlivraisonService:BonlivraisonService,) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Bon Livraison' },
      { label: 'Details', active: true }
    ];
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
    if (id !== null) {
      this.BonlivraisonService.getBonDeLivraisonById(id).subscribe((data: any) => {
        this.commande = data;
   
      });
    } else {

      console.error('ID parameter is missing or invalid');
    }
    if (id !== null) {
      this.BonlivraisonService.findarBybon(id).subscribe((data: any) => {
      
        this.articles = data.articles;
      });
    } else {

      console.error('ID parameter is missing or invalid');
    }
    
  }

  affiche() {

    console.log(this.commande);
  }
}

  

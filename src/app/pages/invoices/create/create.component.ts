import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { ClientService } from 'src/app/core/services/client.service'; 
import { CommandeService } from '../commande.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  submitted = false;
  items: any[] = [];
  clients: any[] = [];
  filteredClients: any[] = [];

  // Form fields
  nom1: string = '';
  adresse: string = '';
  phone: string = '';
  activite: string = '';
  codec: string = '';
  raisonSocial: string = '';
  matriculeFiscale: string = '';
  email: string = '';
  paymentStatus: string = '';
  clientId: number = 0;
  codeco:string=''; 
  constructor(
    private clientService: ClientService,
    private http: HttpClient,
    private commandeService: CommandeService,
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Invoices' },
      { label: 'Invoice Details', active: true }
    ];

    this.clientService.getClients().subscribe((data: any[]) => {
      this.clients = data;
    });
  }

  onNomChange(value: string): void {
    this.filterClients(value);
  }

  filterClients(value: string): void {
    this.filteredClients = this.clients.filter(client =>
      client.nom.toLowerCase().includes(value.toLowerCase())
    );
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
  }

  saveUser() {
    this.submitted = true;
    if (this.nom1 && this.adresse && this.phone && this.activite && this.codec && this.raisonSocial && this.matriculeFiscale && this.email) {
      const formData = {
        codeco: this.codeco,
        clientId: this.clientId,
        etat: 'nonaffectebon',
        articles: this.items.map(item => ({

          code: item.code,
          nom: item.nom,
          Dimensions: item.Dimensions,
          poids: item.poids,
          Contenu: item.Contenu,
          receiver: {
            name: item.receiver.name,
            address: item.receiver.address,
            contact: item.receiver.contact
          }
        }))
      };

      this.commandeService.createCommande(formData).subscribe({
        next: (response) => {
          console.log('Commande created successfully:', response);
          this.router.navigate(['/invoices/list']); // Navigate to success URL
        },
        error: (error) => {
          console.error('Error creating commande:', error);
          // Handle error response, e.g., show an error message
        }
      });
    }
  }

  addItem(): void {
    this.items.push({
      code: '',
      nom: '',
      Dimensions: '',
      poids: '',
      Contenu: '',
      receiver: {
        name: '',
        address: '',
        contact: ''
      }
    });
    console.log(this.items);
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  saveArticleList() {
    console.log('Saved Article List:', this.items);
    // Process the article list as needed (e.g., save to a database)
  }
}

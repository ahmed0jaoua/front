import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  
   {
    id: 0,
    label: 'Acceuil',
    link: '/',
    icon:'bx bx-receipt',
    parentId: 2
  },
  {
    id: 1,
    label: 'Bon de Livraison',
    link: '/bon/list',
    icon:'bx bx-receipt',
    parentId: 2
  },

  {
    id: 2,
    label: 'Fiche de Routes',
    icon: 'ri-truck-fill',
    isCollapsed: true,
    subItems: [
      {
        id: 3,
        label: 'Entrant',
        link: '/fichederoute/listesEntrants',
        parentId: 2
      },
      
      {
        id: 4,
        label: 'Sortant ',
        link: '/fichederoute/listes',
        icon: 'mdi mdi-speedometer',
        parentId: 2
      },
     
 
    ]
  },
  {
    id: 2,
    label: 'Suivi Colis',
    icon: 'mdi mdi-cube-outline',
    isCollapsed: true,
    subItems: [
      {
        id: 3,
        label: 'Entrant',
        link: '/suiviColis/listesEntrants',
        parentId: 2
      },
      
      {
        id: 4,
        label: 'Sortant ',
        link: '/suiviColis/listes',
        icon: 'mdi mdi-speedometer',
        parentId: 2
      },
     
 
    ]
  },
  {
    id: 5,
    label: 'Facture Client',
    link: '/facture/listes',
    icon: ' ri-file-copy-2-line'
   
  },
  {
    id: 5,
    label: 'Paiement',
    link: '/paiement/listes',
    icon: ' ri-file-copy-2-line'

  },
 
  {
    id: 6,
    label: 'Clients',
    link: '/clients/listeClients',
    icon: 'bx bx-user-pin',
    parentId: 2
  },

  {
    id: 7,
    label: 'Vehicules',
    icon: 'bx bxs-truck',
    link: '/vehicules/list',
    isCollapsed: true,
  
  },
  {
    id: 8,
    label: 'Chauffeurs',
    icon: 'bx bx-walk',
    link: '/chauffeurs/list',
    isCollapsed: true,
    
    
   
    
  },

  
  
  // {
  //   id: 3,
  //   label: 'Bon de Réception',
  //   link: '/invoices/list',
  //   icon: 'mdi mdi-speedometer',
  //   isCollapsed: true,
  //   parentId: 2
  // },
 

 
  

  

  {
    id: 9,
    label: 'Utilisateurs',
    icon: 'bx bxs-user-account',
    link: '/utilisateur/list',
    isCollapsed: true,
    
    
   
    
  },

  {
    id: 10,
    label: 'Sieges',
    icon: 'bx bx-building-house',
    link: '/sieges/list',
    isCollapsed: true,
    
    
   
    
  },

  {
    id: 11,
    label: 'Articles',
    link: '/typecoli/list',
    icon: 'mdi mdi-cube-outline',
    parentId: 2
  },
  {
    id: 12,
    label: 'Type Paiement',
    link: '/typepaiment/list',
    icon: 'ri-secure-payment-line',
    parentId: 2
  },
  {
    id: 13,
    label: 'Mode paiement',
    link: '/modepaiment/list',
    icon: 'ri-bank-card-line',
    parentId: 2
  },
  

  



  
  
 

];

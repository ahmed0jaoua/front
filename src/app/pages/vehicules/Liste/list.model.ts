export interface ListJsModel {
  id: any;
  marque: string;
  nom: string;
  modele: string;
  typecarburant: string;
  datefabrication: string;
  matricule: string;
  status: string;
  kilometrage: number; // Utilisez 'number' pour un float
  type:string;
  proprietaire:string;
  dateenregistrement:string;

}











export interface paginationModel {
  id: any;
  name: string;
  type: string;
  img: string;
}

/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { ListJsModel } from './chauffeur.model';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from './list-sortable.directive';
//import { ListJs } from 'src/app/core/data';
import { ChauffeurService } from 'src/app/core/services/chauffeur.service';

interface SearchResult {
  countries: ListJsModel[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;

}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(countries: ListJsModel[], column: SortColumn, direction: string): ListJsModel[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: ListJsModel, term: string, pipe: PipeTransform) {
  const searchTermb = term.toLowerCase();

  return (country.nom?.toLowerCase() ?? '').includes(searchTermb)
    || (country.prenom?.toLowerCase() ?? '').includes(searchTermb)
    || (country.telephone?.toLowerCase() ?? '').includes(searchTermb)
    || (country.adresse?.toLowerCase() ?? '').includes(searchTermb);

}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<ListJsModel[]>([]);
  
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 8,
    totalRecords: 0
  };


  ListSiegeDates: ListJsModel[] = [];
 
  

  constructor(private pipe: DecimalPipe, public ChauffeurService: ChauffeurService ) {
   
 //   this.VehiculeService.getVehicules().subscribe(data => {
  //    this.ListVehiculeDates = data;
   // });
 


    
    
   
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._countries$.next(result.countries);
      this._total$.next(result.total);
    });

    this._search$.next();
 
    //this.products =this.ListVehiculeDates;


    
    

     
    



  }
  getChauffeurs(){this.ChauffeurService.getChauffeurs().subscribe(data => {
    this.ListSiegeDates = data;
   // this.products = data; // Assigner à products pour qu'il soit utilisé dans _search
    this._search$.next(); // Déclencher la recherche pour mettre à jour les résultats
  });}

  get countries$() { return this._countries$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
   // let countries = sort(this.products, sortColumn, sortDirection);
    let countries = this.ListSiegeDates ? sort(this.ListSiegeDates, sortColumn, sortDirection) : [];


    // 2. filter
    countries = countries.filter(country => matches(country, searchTerm, this.pipe));
    const total = countries.length;

    // 3. paginate
    this.totalRecords = countries.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    countries = countries.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({ countries, total });
  }
}

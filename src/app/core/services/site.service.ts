import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
const glob_API = GlobalComponent.API_URL;
@Injectable({
  providedIn: 'root'
})
export class SiteService {
  
 

  constructor(private http: HttpClient) { }


}

import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeColiComponent } from 'src/app/pages/TypeColi/create/typecoli.component'; 

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalService: NgbModal) {}

  openModal(content: any, options?: any) {
    return this.modalService.open(content, options);
  }
}
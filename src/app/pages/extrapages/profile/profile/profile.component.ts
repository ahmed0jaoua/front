import { Component, OnInit, ViewChild } from '@angular/core';

// Swiper Slider
import { TokenStorageService } from '../../../../core/services/token-storage.service';

import { document, projectList } from 'src/app/core/data';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { projectListModel, documentModel } from './profile.model';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Profile Component
 */
export class ProfileComponent implements OnInit {

  projectList!: projectListModel[];
  document!: documentModel[];
  userData: any;
  allprojectList: any;

  constructor(private formBuilder: UntypedFormBuilder, private modalService: NgbModal, private TokenStorageService: TokenStorageService, public service: PaginationService) {
  }

  ngOnInit(): void {

    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.userData = currentUser;
    /**
     * Fetches the data
     */
    this.fetchData();
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.document = document;
    this.projectList = projectList;
    this.allprojectList = projectList;
  }

  /**
   * Swiper setting
   */
  config = {
    slidesPerView: 3,
    initialSlide: 0,
    spaceBetween: 25,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      }
    }
  };

  // Pagination
  changePage() {
    this.projectList = this.service.changePage(this.allprojectList)
  }

  /**
   * Confirmation mail model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    this.document.slice(id, 1)
    this.modalService.dismissAll()
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-outletarticlesearch',
  templateUrl: './outletarticlesearch.component.html',
  styleUrls: ['./outletarticlesearch.component.scss']
})
export class OutletarticlesearchComponent implements OnInit {
  OutletPartyId: number;
  ColorId = null;

  articlenumber: any;
  colorcheck: boolean = false;
  outletSelection: boolean = false;
  showrecords: boolean = false;
  noRecordfound: boolean = false;
  public outletArticles: any = [];
  colordropdown = [];
  articlesRecords = [];
  totalInwards: any;
  totalOutwards: any;
  totalPacks: any;
  brandName: any;
  categoryName: any;
  TotalTransportOutwardpacks: any;

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private userService: UserService, private route: ActivatedRoute, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("Outlet Article Search | Colorhunt");
    this.route.queryParamMap
      .subscribe((params) => {
        this.getoutletarticle(params);
      }
      );
  }

  ngOnInit() {

  }

  getoutletarticle(params) {
    this.ColorId = null;
    this.showrecords = false;
    this.articlenumber = decodeURIComponent(params.params.article);
    if (this.articlenumber !== undefined) {
      let userdata = JSON.parse(localStorage.getItem('logindata'));
      this.userService.geoutlets(userdata[0].Id).subscribe((res) => {
        this.outletSelection = true;
        this.outletArticles = res;
      });
    }
  }

  colorselect(colorid) {
    console.log('colorid', colorid)
    this.spinner.show();
    this.ColorId = colorid;
    this.outletarticlesearchfun();
  }

  onChangeOutlet(event) {
    this.OutletPartyId = event.Id;
    this.outletSelection = false;

    this.userService.outletarticlecolorcheck(this.articlenumber, this.OutletPartyId).subscribe((res) => {
      console.log('res', res)
      if (res['ColorCheck'] === false) {
        this.showrecords = true;
        this.outletarticlesearchfun();
      }
      else {
        this.colorcheck = true;
        this.colordropdown = res['ArticleColors'];
        this.spinner.hide();
      }
    });
  }

  changeOutletId(event) {
    this.spinner.show();
    this.OutletPartyId = event.Id;
    this.outletarticlesearchfun();
  }

  outletarticlesearchfun() {
    this.userService.outletarticlesearch(this.articlenumber, this.ColorId, this.OutletPartyId).subscribe((res) => {
      console.log('res',res)
      if (res[0]['status'] === 'success') {
        this.TotalTransportOutwardpacks = res[0]['TotalTransportOutwardpacks'];
        this.noRecordfound = false;
        this.brandName = res[0]['BrandName'];
        this.categoryName = res[0]['CategoryName'];
        this.articlesRecords = res[0]['colorData'];
        this.totalInwards = res[0]['TotalInwardPacks'];
        this.totalOutwards = res[0]['TotalOutwardPacks'];
        this.totalPacks = res[0]['TotalPacks'];

        this.colorcheck = false;
        this.showrecords = true;
        this.spinner.hide();
      }
      else {
        this.colorcheck = false;
        this.noRecordfound = true;
        this.showrecords = true;
        this.spinner.hide();
      }

    });
  }
  goTochallan(orderType, NumberId) {
    if (orderType === "Purchase") {
      const link = this.router.serializeUrl(this.router.createUrlTree(['#/outwardchallan',{ OWNO: NumberId }]));
      // let dfdfgfd = this.router.navigate(['outwardchallan', { OWNO: NumberId }])
      window.open(link.replace("%23", "#") , '_blank');
    }
    else if (orderType === "Sales Return") {
      const link = this.router.serializeUrl(this.router.createUrlTree(['#/outletsalesreturnchallan',{ OSR: NumberId }]));
      // this.router.navigate(['outletsalesreturnchallan', { OSR: NumberId }])
      window.open(link.replace("%23", "#") , '_blank');
    } else if (orderType === "Outward") {
      const link = this.router.serializeUrl(this.router.createUrlTree(['#/outletchallan',{ OTLNO: NumberId }]));
      window.open(link.replace("%23", "#") , '_blank');
      // this.router.navigate(['outletchallan', { OTLNO: NumberId }])
    }
    else if (orderType === "Purchase Return") {
      const link = this.router.serializeUrl(this.router.createUrlTree(['#/salesreturnchallan',{ SR: NumberId }]));
      window.open(link.replace("%23", "#") , '_blank');
      // this.router.navigate(['salesreturnchallan', { SR: NumberId }])
    }
  }

















}

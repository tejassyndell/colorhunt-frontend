import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { concat, Subject } from 'rxjs';
import { RouterModule, Routes, Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-articlesearch',
  templateUrl: './articlesearch.component.html',
  styleUrls: ['./articlesearch.component.scss']
})
export class ArticlesearchComponent implements OnInit {

  articlenumber: any;
  articleexistcheck: boolean = false;
  ArticleExist: number;
  PurchaseOrder = [];
  InwardData = [];
  colordropdown = [];
  SalesOrderHistory = [];
  ArticleRejected = [];
  ArticleCancelled = [];
  colorflag: boolean = false;
  articlefindprocess: boolean = true;
  poandinwardshow: boolean = false;
  colorid: number;
  fileUrl: any;
  TotalStock: number;
  ArticleStatus: any;
  ArticleStatusColor: any;
  articlerejectedflag: boolean = false;
  articlecancelledflag: boolean = false;
  grandtotalinwardquantity: any;
  grandtotaloutwardquantity: any;
  GRNQuantity :any ;

  constructor(private sanitizer: DomSanitizer, private userService: UserService, private route: ActivatedRoute,  public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService,private http: HttpClient ,private titleService: Title) {
    this.titleService.setTitle("Article Search | Colorhunt");
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false; //use this line in constructer for same url reload data
    //this.router.onSameUrlNavigation = 'reload';

    // this.router.routeReuseStrategy.shouldReuseRoute = () => {
    //   // do your task for before route

    //   return true;
    // }

    // this.route.queryParams
    //   .filter(params => params.order)
    //   .subscribe(params => {
    //     console.log(params); // { order: "popular" }

    //     this.order = params.order;
    //     console.log(this.order); // popular
    //   }
    // );

    this.route.queryParamMap
  .subscribe((params) => {
    this.getarticle(params);
    this.articlefindprocess = true;
  }
);

  //   router.events.subscribe((val) => {
  //     // see also
  //     console.log(val instanceof NavigationEnd)

  //     alert(val);
  // });
  }

  getarticle(params){
    this.articlenumber = decodeURIComponent(params.params.article);
    if(this.articlenumber!==undefined){
      setTimeout(() => this.spinner.show(), 25);
      this.userService.articlecolorcheck(this.articlenumber).subscribe((res) => {
        this.getarticlecolordata(res);

      });


    }
  }

  colorselect(colorid){
    //alert(colorid);
    this.colorid = colorid;
    setTimeout(() => this.spinner.show(), 25);
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    this.userService.articlesearch(this.articlenumber, colorid, userdata[0].Id).subscribe((res) => {
     this.colorflag = false;
      this.getarticledata(res);
    });
  }

  getarticlecolordata(res){
    //alert(res.ArticleExist);
    this.ArticleExist = res.ArticleExist;
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    // console.log('userdata',userdata)
    if(res.ArticleExist==2)
    {
      this.userService.articlesearch(this.articlenumber, 0, userdata[0].Id).subscribe((res) => {
        this.colorflag = false;
        this.getarticledata(res);
      });
    } else{
      this.articlefindprocess = false;
      if(res.colorflag==1){
        this.colorflag = true;
        this.colordropdown = res.color;
        this.spinner.hide();
      }else{
        this.userService.articlesearch(this.articlenumber, 0, userdata[0].Id).subscribe((res) => {
          this.colorflag = false;
          this.getarticledata(res);
        });
      }

    }
  }

  getarticledata(res){
    if(res.ArticleExist){
      this.GRNQuantity = res.totalnopacks;
      //alert(res.ArticleExist);
      this.grandtotalinwardquantity = res.grandtotalinwardquantity;
      this.grandtotaloutwardquantity = res.grandtotaloutwardquantity;
      this.TotalStock = res.grandtotalinwardquantity - res.grandtotaloutwardquantity
      this.articleexistcheck = true;
      this.PurchaseOrder = res.PurchaseOrder[0];
      this.ArticleStatus = res.PurchaseOrder[0].ArticleStatus
      this.InwardData = res.InwardData;
      this.SalesOrderHistory = res.SalesOrderHistory['SalesOrderHistory'];
      if(res.ArticleRejected!=""){
        this.articlerejectedflag = true;
        this.ArticleRejected = res.ArticleRejected;
      }else{
        this.articlerejectedflag = false;
      }


      if(res.ArticleCancelled!=""){
        this.articlecancelledflag = true;
        this.ArticleCancelled = res.ArticleCancelled;
      }else{
        this.articlecancelledflag = false;
      }

      if(this.ArticleStatus==1){
        this.ArticleStatusColor = "colorbox green";
      } else if(this.ArticleStatus==2){
        this.ArticleStatusColor = "colorbox orange";
      } else if(this.ArticleStatus==3){
        this.ArticleStatusColor = "colorbox red";
      } else{
        this.ArticleStatusColor = "";
      }

    } else{
      this.articleexistcheck = false;
    }

    this.spinner.hide();
  }

  printpochallan(PO){
    // this.router.navigate(['pochallan', { PO: PO}])
    const link = this.router.serializeUrl(this.router.createUrlTree(['#/pochallan', {  PO: PO }]));
    window.open(link.replace("%23", "#") , '_blank');
  }

  printinwardchallan(id, type){
    const link = this.router.serializeUrl(this.router.createUrlTree(['#/inwardchallan', { GRN: id, type: type }]));
    window.open(link.replace("%23", "#") , '_blank');
  }

  downloadprnfile(Id, Colorflag) {
    this.spinner.show();
    let colorflagval;

    if(Colorflag==1){
      colorflagval = this.colorid;
    }else{
      colorflagval = 0;
    }
    this.userService.downloadfile(Id, colorflagval).subscribe((res) => {
      this.getprndata(res, Id);
    });
  }

  getprndata(res, Id) {
    if (res[0].length > 0) {
      const blob = new Blob([res], { type: 'application/octet-stream' });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      setTimeout(() => {
        document.getElementById("downloadfile_" + Id).click();
        $(".colordropdown_" + Id).prop('Select Color', 0);
        this.spinner.hide();
      }, 500);
    }
  }

  downloadprnsinglefile(Id, Colorflag) {
    this.spinner.show();
    let colorflagval;

    if(Colorflag==1){
      colorflagval = this.colorid;
    }else{
      colorflagval = 0;
    }
    this.userService.downloadsinglefile(Id, colorflagval).subscribe((res) => {
      this.getbarcodesingledata(res, Id);
    });


  }
  getbarcodesingledata(res, Id) {
    if (res[0].length > 0) {
      const blob = new Blob([res], { type: 'application/octet-stream' });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      setTimeout(() => {
        document.getElementById("downloadfile_barcode_" + Id).click();
        this.spinner.hide();
      }, 500);
    }
  }

  downloadImage(img){
    alert(img);
  }

  printsochallan(id) {
    // this.router.navigate(['sochallan', { SONO: id,Back:1 }])
    const link = this.router.serializeUrl(this.router.createUrlTree(['#/sochallan', { SONO: id,Back:1 }]));
    window.open(link.replace("%23", "#") , '_blank');
  }

  printoutwardchallan(id) {

    // this.router.navigate(['outwardchallan', { OWNO: id }])
    const link = this.router.serializeUrl(this.router.createUrlTree(['#/outwardchallan', { OWNO: id }]));
    window.open(link.replace("%23", "#") , '_blank');
  }

  printsalesreturnchallan(id) {
    // this.router.navigate(['salesreturnchallan', { SR: id }])
    const link = this.router.serializeUrl(this.router.createUrlTree(['#/salesreturnchallan',{ SR: id }]));
    window.open(link.replace("%23", "#") , '_blank');
  }

  printpurchasereturnchallan(id) {
    // this.router.navigate(['purchasereturnchallan', { PR: id }])
    const link = this.router.serializeUrl(this.router.createUrlTree(['#/purchasereturnchallan',{ PR: id }]));
    window.open(link.replace("%23", "#") , '_blank');
  }
  printstocktransferchallan(id){
    const link = this.router.serializeUrl(this.router.createUrlTree(['#/stocktransferchallan',{ STNO: id }]));
    window.open(link.replace("%23", "#") , '_blank');
  }

  orderno(id, type){
    if(type==0){
      this.printinwardchallan(id, 1);
    } else if(type==1){
      this.printsochallan(id);
    } else if(type==2){
      this.printoutwardchallan(id);
    } else if(type==3){
      this.printsalesreturnchallan(id);
    } else if(type==4){
      this.printpurchasereturnchallan(id);
    } else if(type==5 || type==6 || type==7){
      this.printstocktransferchallan(id);
    } else{

    }

  }
  ngOnInit() {
    //let article = this.route.snapshot.paramMap.get('article');
    //getarticle();
    // this.userService.articlesearch(this.articlenumber).subscribe((res) => {
    //   console.log(res);
    // });

    let userdata = JSON.parse(localStorage.getItem('logindata'));

    if(userdata[0].Role==6 || userdata[0].Role==7 || userdata[0].Role==8){
      this.poandinwardshow = false;
    } else{
      this.poandinwardshow = true;
    }
  }

}

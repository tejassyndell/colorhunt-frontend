import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jspdf from 'jspdf';
import { environment } from '../../../environments/environment';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pochallan',
  templateUrl: './pochallan.component.html',
  styleUrls: ['./pochallan.component.scss']
})

export class PochallanComponent implements OnInit {
  BaseURL: any;
  Address: any;
  ArticleNumber: any;
  GSTNumber: any;
  Id: any;
  Name: any;
  NumPacks: any;
  PO_Image: any;
  PoDate: any;
  PurchaseNumber: any;
  Remarks: any;
  Brandname: any;
  Title: any;
  polist: [];
  StyleDescription: any;
  isEnable: boolean = false;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  preparedby: any;
  verifiedby: any;
  poBack: boolean = false;
  multipleimage: any;
  multipleimageflag: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService,private titleService: Title) { 
    this.titleService.setTitle("PO Challan | Colorhunt");
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    let backgetval = this.route.snapshot.paramMap.get('Back');
    if (backgetval == '1') {
      this.poBack = true;
    }
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 25);
      if (this.route.snapshot.paramMap.get('PO')) {
        //let id = this.route.snapshot.paramMap.get('id');
        let ponumber = this.route.snapshot.paramMap.get('PO');
        this.userService.getpochallen(ponumber).subscribe((res) => {
          this.getpochallen(res);
          this.spinner.hide();
        });
      }
    }
  }
  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 6) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }
          this.isList = data[i].ListRights;
          this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = true;
        }

      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 6) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }
          this.isList = data[i].ListRights;
          this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = true;
        }

      }

    }
  }

  public getpochallen(res) {

    this.BaseURL = environment.UploadBaseURL;
    this.Address = res[0].Address;
    this.ArticleNumber = res[0].ArticleNumber;
    this.GSTNumber = res[0].GSTNumber;
    this.Id = res[0].Id;
    this.Name = res[0].Name;
    this.NumPacks = res[0].NumPacks;
    this.PO_Image = res[0].PO_Image;
    this.PoDate = res[0].PoDate;
    this.Brandname = res[0].Brandname;
    this.PurchaseNumber = res[0].PurchaseNumber;
    this.Remarks = res[0].Remarks;
    this.Title = res[0].Title;
    this.StyleDescription = res[0].StyleDescription;
    this.preparedby = res[0].PreparedBy;
    this.polist = res;

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    this.multipleimage = res[0].MultipleImage;
    //alert(this.multipleimage);
    if (this.multipleimage == 1) {
      this.multipleimageflag = true;

    } else {
      this.multipleimageflag = false;
      if (this.PO_Image) {
        this.isEnable = true;
      } else {
        this.isEnable = false;
      }
    }

    this.spinner.hide();

  }

  public captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });
  }
  goBack (){
    window.history.back();
  }
}

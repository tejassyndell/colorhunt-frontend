import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inwardchallan',
  templateUrl: './inwardchallan.component.html',
  styleUrls: ['./inwardchallan.component.scss']
})
export class InwardchallanComponent implements OnInit {

  showVendorId: boolean = false;
  VendorName: any;
  VendorAddress: any;
  VendorGSTNumber: any;
  InwardDate: any;
  GRN_Number: any;
  Remark: any;
  Name: any;
  Address: any;
  GSTNumber: any;
  countNoPacks: any;
  countTotalSetQuantity: any;
  countRate: any;
  countWight: any;
  public inwardlist: any = [];
  PurchaseNumber: any;
  Notes: any;
  PoDate: any;
  BrandName: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  preparedby: any;
  verifiedby: any;
  inwordBack: boolean = false;
  Canceled: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Inward Challan | Colorhunt");
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    let backgetval = this.route.snapshot.paramMap.get('Back');
    if (backgetval == '1') {
      this.inwordBack = true;
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
      if (this.route.snapshot.paramMap.get('GRN')) {
        let data = this.route.snapshot.paramMap.get('GRN');
        let type = this.route.snapshot.paramMap.get('type');

        this.userService.getinwardchallen(data, type).subscribe((res) => {
          // alert(type);
          this.getinwardchallen(res, type);
        });
      }
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));

    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 3) {
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
        if (data[i].PageId == 3) {
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

  public getinwardchallen(res, type) {
    if (type == 0) {
      this.Canceled = true;
    } else {
      this.Canceled = false;
    }
    this.InwardDate = res[0][0].InwardDate;
    this.GRN_Number = res[0][0].GRN;
    this.Remark = res[0][0].Remark;
    this.Name = res[0][0].Name;
    this.Address = res[0][0].Address;
    this.GSTNumber = res[0][0].GSTNumber;
    this.PoDate = res[0][0].PoDate;
    this.BrandName = res[0][0].BrandName;
    this.PurchaseNumber = res[0][0].PurchaseNumber;
    this.Notes = res[0][0].Notes;

    this.countNoPacks = res[1]['countNoPacks'];
    this.countTotalSetQuantity = res[1]['countTotalSetQuantity'];
    this.countRate = res[1]['countRate'];
    this.countWight = res[1]['countWight'];


    this.showVendorId = res[1]['vendorInformation'];
    this.VendorName = res[1]['vendorName'];
    this.VendorAddress = res[1]['vendorAddress'];
    this.VendorGSTNumber = res[1]['vendorGSTNumber'];

    this.preparedby = res[0][0].PreparedBy;
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    this.inwardlist = res;
    res[0].forEach(inwardInner => {
      if(inwardInner.rejections){
        inwardInner.rejections = JSON.parse(inwardInner.rejections);
      }
    });
    this.inwardlist = res;

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

  goBack() {
    window.history.back();
  }

}

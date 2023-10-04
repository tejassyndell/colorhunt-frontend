import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-outletchallan',
  templateUrl: './outletchallan.component.html',
  styleUrls: ['./outletchallan.component.scss']
})
export class OutletchallanComponent implements OnInit {
  OutletDate: any;
  OutletNumber: any;
  UserName: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  PartyName: any;
  Address :any ; 
  Contact :any ;
  GST :any ;

  public outletlist: any = [];
  getuserdata: any;
  UserWiseData: boolean = true;
  accessdenied: boolean = true;

  Roundoff: boolean;
  TotalRoundAmount: any;
  AdjustAmount: any;
  Discount: any;
  TotalFinalAmount: any;
  RoundValueSign: any;
  GSTLabel: any;
  GSTValue: any;
  BorderBottomWithoutRoundOff: boolean = false;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  preparedby: any;
  verifiedby: any;
  SalesPerson:any;
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("Outlet Challan | Colorhunt");
   }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);

    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 25);
      this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
      let data = this.route.snapshot.paramMap.get('OTLNO');

      this.userService.getoutletchallen(data).subscribe((res) => {
        this.getoutletchallen(res);
      });
      
    }

  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 21) {
          let parameterInnerId = this.route.snapshot.paramMap.get('id');
          let parameterId = this.route.snapshot.paramMap.get('OTLNO');
          if (data[i].ListRights == 1) {
            if (parameterId == "Add" && data[i].ListRights == 1) {
              this.accessdenied = false;
            } else {
              if (parameterId != "Add" && data[i].EditRights == 1) {
                this.accessdenied = false;
              } else {
                this.accessdenied = true;
              }
            }
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
        if (data[i].PageId == 21) {
          let parameterId = this.route.snapshot.paramMap.get('id');
          if (data[i].ListRights == 1) {
            if (parameterId == null && data[i].ListRights == 1) {
              this.accessdenied = false;
            } else {
              if (parameterId != null && data[i].EditRights == 1) {
                this.accessdenied = false;
              } else {
                this.accessdenied = true;
              }
            }
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



  public getoutletchallen(res) {
    this.OutletDate = res[0][0].OutletDate;
    this.UserName = res[0][0].UserName;
    this.SalesPerson = res[0][0].SalesPerson;
    this.OutletNumber = res[0][0].OutletNumber;
    this.PartyName = res[0][0].PartyName;
    this.Address  = res[0][0].Address;
    this.Contact  = res[0][0].Contact;
    this.GST  = res[0][0].GST;
    this.Roundoff = res[1].RoundOff.Roundoff;

    if (this.Roundoff) {
      this.BorderBottomWithoutRoundOff = false;
    } else {
      this.BorderBottomWithoutRoundOff = true;
    }
    this.RoundValueSign = res[1].RoundOff.RoundValueSign;
    this.TotalRoundAmount = res[1].RoundOff.TotalRoundAmount;
    this.AdjustAmount = res[1].RoundOff.AdjustAmount;

    this.preparedby = res[0][0].UserName;
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    this.Discount = res[1]['Discount'];
    this.TotalFinalAmount = res[1]['TotalFinalAmount'];
    this.GSTLabel = res[1]['GSTLabel'];
    this.GSTValue = res[1]['GSTValue'];
    this.TotalQuantityPic = res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];
    this.outletlist = res;
    this.spinner.hide();
    setTimeout(() => this.spinner.hide(), 25);
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


import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { exportElement } from '../../export-element';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sochallan',
  templateUrl: './sochallan.component.html',
  styleUrls: ['./sochallan.component.scss']
})
export class SochallanComponent implements OnInit {
  SODate: any;
  SoNumber: any;
  GSTNumber: any;
  SalesPerson:any;
  UserName: any;
  Remarks: any;
  Name: any;
  Address: any;
  PhoneNumber: any;
  Transporter: any;
  Destination: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  public solist: any = [];
  getuserdata: any;
  UserWiseData: boolean = true;
  getID: string;
  preparedby: any;
  verifiedby: any;
  back: string;
  soBack: any;

  GSTLabel: any;
  GSTValue: any;
  GSTType: any;
  GSTPercentage: any;
  SGSTValue: any;
  CGSTValue: any;
  TotalFinalAmount: any;
  Roundoff: boolean;
  TotalRoundAmount: any;
  AdjustAmount: any;
  GSTTypeStatus: boolean = true;
  PartyTotalDiscount: any;
  RoundValueSign: any;
  BorderBottomWithoutRoundOff: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("SO Challan | Colorhunt");
  }

  ngOnInit() {

    setTimeout(() => this.spinner.show(), 25);

    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
    let data = this.route.snapshot.paramMap.get('SONO');
    let backgetval = this.route.snapshot.paramMap.get('Back');
    if (backgetval == '1') {
      this.soBack = 1;
    } else if(backgetval == '2') {
      this.soBack = 2;
    } else if(backgetval == '4'){
      this.soBack = 4;
    } else {
      this.soBack = 3;
    }


    this.getID = this.route.snapshot.paramMap.get('SONO');
    if (this.route.snapshot.paramMap.get('SONO')) {
      this.userService.sodatacheckuserwise(this.getuserdata[0].Id, data).subscribe((res) => {
        if (res['Rights']) {
          this.UserWiseData = true;
          this.userService.getsochallen(data).subscribe((res) => {
            this.getsochallen(res);
          });
        } else {
          this.UserWiseData = false;
        }
      });
    }


  }



  public getsochallen(res) {
    this.SODate = res[0][0].SoDate;
    this.Remarks = res[0][0].Remarks;
    this.UserName = res[0][0].UserName;
    this.SalesPerson = res[0][0].SalesPerson;
    this.Name = res[0][0].Name;
    this.Address = res[0][0].Address;
    this.PhoneNumber = res[0][0].PhoneNumber;
    this.GSTNumber = res[0][0].GSTNumber;
    //this.Remarks = res[0][0].Remarks;
    this.SoNumber = res[0][0].SoNumber;
    this.Transporter = res[0][0].Transporter;
    this.Destination = res[0][0].Destination;
    // this.preparedby = res[0][0].UserName;
    this.preparedby =  res[0][0].UserName;

    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic = res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];
    this.solist = res;

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;


    this.Roundoff = res[1].RoundOff.Roundoff;
    if(this.Roundoff)
    {
      this.BorderBottomWithoutRoundOff = false;
    }else{
      this.BorderBottomWithoutRoundOff = true;
    }
    this.RoundValueSign = res[1].RoundOff.RoundValueSign;
    this.TotalRoundAmount = res[1].RoundOff.TotalRoundAmount;
    this.AdjustAmount = res[1].RoundOff.AdjustAmount;
    this.TotalFinalAmount = res[1]['TotalFinalAmount'];
    this.GSTLabel = res[1]['GSTLabel'];
    this.GSTValue = res[1]['GSTValue'];
    this.SGSTValue = res[1]['SGSTValue'];
    this.CGSTValue = res[1]['CGSTValue'];
    this.GSTPercentage = res[1]['GSTPercentage'];
    this.GSTType = res[1]['GSTType'];

    if(this.GSTType=="GST"){
      this.GSTTypeStatus = true;
      this.GSTPercentage = (this.GSTPercentage/2);
    } else{
      this.GSTTypeStatus = false;
    }


    this.spinner.hide()
  }



  pdf(element){
    $(".rupeesymbol").replaceWith("Rs.");
    //alert(this.Name);
    //exportElement(element, this.Name);
    // exportElement(element, this.Name, { paperSize: "A4",
    // margin: { top: "1cm", left: "1cm", right: "1cm", bottom: "1cm" },
    // scale: 0.5});

    exportElement(element, this.Name, { paperSize: "A4",scale: 0.4,repeatHeaders:true});
   this.ngOnInit();
  }

  goBack (){
    window.history.back();
  }




}







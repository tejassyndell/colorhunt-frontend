import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { exportElement } from '../../export-element';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-soremainingchallan',
  templateUrl: './soremainingchallan.component.html',
  styleUrls: ['./soremainingchallan.component.scss']
})
export class SoremainingchallanComponent implements OnInit {
  SODate: any;
  SoNumber: any;
  GSTNumber: any;
  UserName: any;
  Remarks: any;
  Name: any;
  Address: any;
  Transporter: any;
  Destination: any;
  TotalNoPacks: any;
  TotalSendNoPacks: any;
  TotalRemainingNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  public solist: any = [];
  getuserdata: any;
  UserWiseData: boolean = true;
  getID: string;
  preparedby: any;
  verifiedby: any;
  back: string;
  soBack: boolean = false;
  id: string;
  articaldown: any;
  public remsodata: any = [];
  newarray: any = [];
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("SO Remaining Challan | Colorhunt");
  }

  ngOnInit() {

    setTimeout(() => this.spinner.show(), 25);
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
    let data = this.route.snapshot.paramMap.get('Id');
    this.id = this.route.snapshot.paramMap.get('Id');

    let backgetval = this.route.snapshot.paramMap.get('Back');
    if (backgetval == '1') {
      this.soBack = true;
    }
    this.getID = this.route.snapshot.paramMap.get('Id');
    if (this.route.snapshot.paramMap.get('Id')) {
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
    this.Name = res[0][0].Name;
    this.Address = res[0][0].Address;
    this.GSTNumber = res[0][0].GSTNumber;
    this.SoNumber = res[0][0].SoNumber;
    this.Transporter = res[0][0].Transporter;
    this.Destination = res[0][0].Destination;
    this.preparedby = res[0][0].UserName;

    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic = res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];
    this.TotalSendNoPacks = res[1]['TotalSendNoPacks'];
    this.TotalRemainingNoPacks = res[1]['TotalRemainingNoPacks'];

    this.solist = res;


    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    this.spinner.hide()
  }

  public gotopdfpage(element) {

    // this.router.navigate(['sochallanpdf', { SONO: this.getID }])
    $(".rupeesymbol").replaceWith("Rs.");
    //exportElement(element);
	//exportOutwardElement(element, this.Name);
	  exportElement(element, '', { paperSize: "A4",scale: 0.4,repeatHeaders:true});
    this.ngOnInit();
  }

  goBack (){
    window.history.back();
  }

}

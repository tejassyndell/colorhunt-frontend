import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-outletsalesreturnchallan',
  templateUrl: './outletsalesreturnchallan.component.html',
  styleUrls: ['./outletsalesreturnchallan.component.scss']
})
export class OutletsalesreturnchallanComponent implements OnInit {
  showOutletPartyId: boolean = false;
  OutletPartyName: any;
  OutletPartyAddress: any;
  OutletPartyGSTNumber: any;

  SRDate: any;
  SRNO: any;
  GSTNumber: any;
  UserName: any;
  Name: any;
  Address: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  public solist: any = [];
  getuserdata: any;
  UserWiseData: boolean = true;
  preparedby: any;
  verifiedby: any;
  Remark: any;
  OutletNumber: any;
  constructor(private router: Router,private route: ActivatedRoute, private userService: UserService,private spinner: NgxSpinnerService,private titleService: Title) { 
    this.titleService.setTitle("Outlet Sales Return Challan | Colorhunt");
  }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 25);
    this.getuserdata =  JSON.parse(localStorage.getItem('logindata'));
    let data = this.route.snapshot.paramMap.get('OSR');
    if(this.route.snapshot.paramMap.get('OSR')){
      this.userService.getoutletsalesreturnchallan(data).subscribe((res) => {
        this.getoutletsalesreturnchallan(res);
      });
    }

  }

  public getoutletsalesreturnchallan(res){
    this.spinner.hide()
    this.OutletNumber = res[0][0].OutletNumber;
    this.SRDate=  res[0][0].SRDate;
    this.UserName = res[0][0].UserName;
    this.Name= res[0][0].Name;
    this.Address= res[0][0].Address;
    this.GSTNumber= res[0][0].GSTNumber;
    this.SRNO = res[0][0].SalesReturnNumber;
    this.Remark = res[0][0].Remark;

    this.preparedby = res[0][0].UserName;
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;


    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic= res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];
    this.solist = res;

    this.showOutletPartyId = res[0][0]['Outletdata'];
    this.OutletPartyName = res[0][0]['OutletPartyName'];
    this.OutletPartyAddress = res[0][0]['OutletPartyAddress'];
    this.OutletPartyGSTNumber = res[0][0]['OutletPartyGSTNumber'];

  }

  public captureScreen()
  {
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

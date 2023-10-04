import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs
import { NgxSpinnerService } from 'ngx-spinner';
import { exportElement } from '../../export-element';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sochallanpdf',
 templateUrl: './sochallanpdf.component.html',
  styleUrls: ['./sochallanpdf.component.scss']
})
export class SochallanpdfComponent implements OnInit {
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
  TotalQuantityPic: any;
  TotalAmount: any;
  public solist: any = [];
  getuserdata: any;
  UserWiseData: boolean = true;
  getID: string;
  pageID: string;
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("SO Challan PDF | Colorhunt");
  }

  ngOnInit() {
    let data = this.route.snapshot.paramMap.get('SONO');
    this.getID = this.route.snapshot.paramMap.get('SONO');
    this.pageID = this.route.snapshot.paramMap.get('pageID');
    this.userService.getsochallen(data).subscribe((res) => {
      this.getsochallen(res);
    });
  }

  pdf(element){
    exportElement(element);
    
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

    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic = res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];
    this.solist = res;
 

  }

  public captureScreen() {
    this.spinner.show();
    $('#contentToConvert').parent().show();
    var data = document.getElementById('contentToConvert');
    var date = new Date();
    html2canvas(data).then(canvas => {
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;

      //enter code here
      const imgData = canvas.toDataURL('image/png')

      var doc = new jspdf('p', 'mm');
      var position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
     
      doc.save('SOPdf_' + date.getTime() + '.pdf')
      $('#contentToConvert').parent().hide();
      if (this.pageID == '1') {
        this.router.navigate(['socart'])
      } else {
        this.router.navigate(['sochallan', { SONO: this.getID }])

      }
    });

  }

}

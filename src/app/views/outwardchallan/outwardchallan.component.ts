import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { exportElement, exportOutwardElement } from '../../export-element';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { drawDOM, exportPDF, DrawOptions, Group } from '@progress/kendo-drawing';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-outwardchallan',
  templateUrl: './outwardchallan.component.html',
  styleUrls: ['./outwardchallan.component.scss']
})
export class OutwardchallanComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  UploadBaseUrl: string = environment.UploadBaseURL;
  OutwardDate: any;
  SoNumber: any;
  OutwardNumber: any;
  OutwardNumberId: any;
  GSTNumber: any;
  UserName: any;
  Name: any;
  Address: any;
  PhoneNumber: any;
  Transporter: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  public outwardlist: any = [];
  checkcalspan: any = [];
  getuserdata: any;
  UserWiseData: boolean = true;
  RoundValueSign: any;
  BorderBottomWithoutRoundOff: boolean = false;
  TotalWeight: any;
  dataList: any = [];
  dataList1: any = [];
  PartyDiscount: number;
  PartyTotalDiscount: any;

  Roundoff: boolean;
  TotalRoundAmount: any;
  AdjustAmount: any;
  Discount: any;
  TotalFinalAmount: any;
  GSTLabel: any;
  GSTValue: any;
  GSTType: any;
  GSTPercentage: any;
  SGSTValue: any;
  CGSTValue: any;
  Remarks: any;
  GSTTypeStatus: boolean = true;
  //html: String;
  accessdenied: boolean = false;
  SubtotalStatus: any;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  preparedby: any;
  verifiedby: any;
  TotalQuantityAllInSet: any;
  SubTotalAmount: any;
  ExtraDiscountpercentage: any;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("Outward Challan | Colorhunt");
  }

  ngOnInit() {
    
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));

    
    // if (rolerights != "" && rolerights != null && rolerights != undefined) {
    //   this.rightscheck(rolerights, 1);
    // } else {
    //   this.userService.getroleRights(item[0].Role).subscribe((res) => {
    //     this.rightscheck(res, 2);
    //   });
    // }
    // if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 25);
      this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
      let data = this.route.snapshot.paramMap.get('OWNO');
      if (this.route.snapshot.paramMap.get('OWNO')) {

        this.userService.getoutwardchallen(data).subscribe((res) => {
          this.getoutwardchallen(res);
          setTimeout(() => this.spinner.hide(), 25);
        });
      }
    // }


  }

  // rightscheck(data, no) {
  //   let item = JSON.parse(localStorage.getItem('userdata'));
  //   if (no == 1) {
  //     var Count = Object.keys(data).length;
  //     for (let i = 0; i < Count; i++) {
  //       if (data[i].PageId == 4) {
  //         if (data[i].ListRights == 1) {
  //           this.accessdenied = false;
  //         } else {
  //           this.accessdenied = true;
  //         }
  //         this.isList = data[i].ListRights;
  //         this.isAdd = data[i].AddRights;
  //         this.isEdit = data[i].EditRights;
  //         this.isDelete = data[i].DeleteRights;
  //         break;
  //       } else {
  //         this.accessdenied = true;
  //       }

  //     }
  //   } else {
  //     for (let i = 0; i < data.length; i++) {
  //       if (data[i].PageId == 4) {
  //         if (data[i].ListRights == 1) {
  //           this.accessdenied = false;
  //         } else {
  //           this.accessdenied = true;
  //         }
  //         this.isList = data[i].ListRights;
  //         this.isAdd = data[i].AddRights;
  //         this.isEdit = data[i].EditRights;
  //         this.isDelete = data[i].DeleteRights;
  //         break;
  //       } else {
  //         this.accessdenied = true;
  //       }

  //     }

  //   }
  // }


  public getoutwardchallen(res) {
    // console.log('res', res)
    this.dataList = [
      {
        pname: "New",
        numbers: ["Changssssss"],
        data1: ["dddd"]
      },
      {
        pname: "abc",
        numbers: [123, 234, 234, 231],
        data1: [2, 33, 44, 24]
      },
      {
        pname: "change",
        numbers: [123, 234, "", 231],
        data1: [2, "", 44, ""]
      },
      {
        pname: "mno",
        numbers: [125, 237],
        data1: [2, 43]
      }
    ];

    this.dataList1 = res[2];


    this.OutwardDate = res[0][0].OutwardDate;
    this.UserName = res[0][0].UserName;
    this.Name = res[0][0].Name;
    this.Address = res[0][0].Address;
    this.PhoneNumber = res[0][0].PhoneNumber;
    this.GSTNumber = res[0][0].GSTNumber;
    this.OutwardNumber = res[0][0].OutwardNumber;
    this.OutwardNumberId = res[0][0].OutwardNumberId;
    this.SoNumber = res[0][0].SoNumber;
    this.Transporter = res[0][0].Transporter;
    this.PartyDiscount = res[0][0].PartyDiscount;
    this.Remarks = res[0][0].Remarks;

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

    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic = res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];

    // let val = parseFloat(this.TotalAmount);
    // if(isNaN(val)){
    //   alert("not a float!");
    // } else{
    //   alert("not a float!");
    // }
    

    //isIntCheck(this.TotalAmount);
    this.SubtotalStatus = res[1]['SubtotalStatus'];
    this.PartyTotalDiscount = res[1]['PartyTotalDiscount'];
    
    this.TotalQuantityAllInSet =  res[1]['TotalQuantityAllInSet'];
    this.TotalWeight = res[1]['TotalWeight'];
    this.Discount = res[1]['Discount'];
    this.ExtraDiscountpercentage = res[1]['ExtraDiscountpercentage'];
    this.TotalFinalAmount = res[1]['TotalFinalAmount'];
    this.GSTLabel = res[1]['GSTLabel'];
    this.GSTValue = res[1]['GSTValue'];
    this.SGSTValue = res[1]['SGSTValue'];
    this.CGSTValue = res[1]['CGSTValue'];
    this.GSTPercentage = res[1]['GSTPercentage'];
    this.GSTType = res[1]['GSTType'];
    this.SubTotalAmount = res[1]['SubTotalAmount'];
    

    if(this.GSTType=="GST"){
      this.GSTTypeStatus = true;
      this.GSTPercentage = (this.GSTPercentage/2);
      //alert(this.GSTValue);
      //this.GSTValue = (this.GSTValue/2);
      //alert(this.GSTValue);
    } else{
      this.GSTTypeStatus = false;
     // alert(this.GSTPercentage);
    }

    this.outwardlist = res;
    let outwardlist1 = res[0];
    
    this.preparedby = res[0][0].PreparedUserName;

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    let outwardlist12: any;
    var Count1 = Object.keys(outwardlist1).length;

    this.spinner.hide();

  }

  isIntCheck(n){
    return Number(n) === n && n % 1 === 0;
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
  share(element) {
    $(".rupeesymbol").replaceWith("Rs.");
    drawDOM(element, { paperSize: "A4", scale: 0.6, repeatHeaders: true }).then((group: Group) => {
      return exportPDF(group);
    }).then((dataUri) => {
      var blob = this.dataURLtoBlob(dataUri);
      var file = new File([blob], "3211.pdf");
      let FileuploadformData = new FormData()
      FileuploadformData.append("fileoc", file);
      FileuploadformData.append("outwardNumId", this.OutwardNumberId);
      this.userService.saveOutwardChallan(FileuploadformData).subscribe((res) => {
        // console.log('res', res)
        if(res['status'] == 'success'){
          var fakeLink = document.createElement('a');
          fakeLink.setAttribute('href', `https://web.whatsapp.com/send?text=${this.UploadBaseUrl}${res['url']}`);
          fakeLink.setAttribute('target', '_blank');
          fakeLink.setAttribute('data-action', 'share/whatsapp/share');
          fakeLink.click();
        }
      });
    });
  }
  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }
  pdf(element){ 
    $('.box-body').css('width', '100px !important');
    $(".rupeesymbol").replaceWith("Rs.");
    //alert(this.Name);
    //exportOutwardElement(element, this.Name);
    exportOutwardElement(element, this.Name, { paperSize: "A4",scale: 0.6,repeatHeaders:true});
    //exportOutwardElement(element, this.Name, { paperSize: "A4",scale: 0.5});
   this.ngOnInit();
  }

  goBack (){
    window.history.back();
  }

}

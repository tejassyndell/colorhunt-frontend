import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { exportElement, exportOutwardElement , shareOutwardElement} from '../../export-element';
import html2canvas from 'html2canvas';
import { drawDOM, exportPDF, DrawOptions, Group } from '@progress/kendo-drawing';
import * as jspdf from 'jspdf';

class Person {
  Id: number;
  OutwardNumber: string;
  SoNumber: string;
  Name: string;
  TotalOutwardPieces: string;
  TotalAmount: string;
  OutwardDate: string;
  OutwardNumberId: string;
  SoId: string;
  Action: string
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}

@Component({
  selector: 'app-outwardlist',
  templateUrl: './outwardlist.component.html',
  styleUrls: ['./outwardlist.component.scss']
})
export class OutwardlistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  UploadBaseUrl: string = environment.UploadBaseURL;
  public outwardlist: Person[];
  public startnumber: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  accessdenied: boolean = true;
  showOutwardChallan: boolean = false;


  OutwardDate: any;
  SoNumber: any;
  OutwardNumber: any;
  GSTNumber: any;
  UserName: any;
  Name: any;
  Address: any;
  PhoneNumber: any;
  Transporter: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  public challanoutwardlist: any = [];
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
  DiscountAmount: any;
  TotalFinalAmount: any;
  GSTLabel: any;
  GSTValue: any;
  GSTType: any;
  GSTPercentage: any;
  SGSTValue: any;
  CGSTValue: any;
  Remarks: any;
  GSTTypeStatus: boolean = true;
  SubtotalStatus: any;
  preparedby: any;
  verifiedby: any;
  TotalQuantityAllInSet: any;
  SubTotalAmount: any;
  ExtraDiscountpercentage: any;
  showOutwardLogs: boolean = false;
  OutwardLogsData: any;
  UserRole: any;

  outwardNumId : any;
  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("Outward List | Colorhunt");
  }

  ngOnInit() {

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.UserRole = item[0].Role;
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 10);
      let userdata = JSON.parse(localStorage.getItem('logindata'));
      let uID = userdata[0].Id;
      this.isList = 1;
      const that = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        columnDefs: [{
          "targets": 'no-sort',
          "orderable": false,
        }], "order": [[1, "desc"]],
        ajax: (dataTablesParameters: any, callback) => {
          let ParentObj = { dataTablesParameters: dataTablesParameters, UserID: uID }

          that.http.post<DataTablesResponse>(
            this.ApiURL + "/outwardpostlist",
            ParentObj, {}
          ).subscribe(resp => {
            that.outwardlist = resp.data;
            that.startnumber = resp.startnumber;
            this.spinner.hide();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
        },
        columns: [{ data: 'No' }, { data: 'OutwardNumber' }, { data: 'SoNumber' }, { data: 'Name' }, { data: 'TotalOutwardPieces' }, { data: 'TotalAmount' }, { data: 'OutwardDate' }, { data: 'Action' }]
      };

    } else {
      this.spinner.hide();
    }
  }
  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if ($('.dataTables_empty').length > 0) {
          $('.dataTables_empty').remove();
        }
      });
      
    });
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 4) {
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
        if (data[i].PageId == 4) {
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  public delete(id, SoId) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {
        this.userService.deleteoutwardnumber(id, SoId, item[0].Id).subscribe((res) => {
          if (res) {
            this.success(res);
          }
        });
      } else {

      }
    });
  }

  success(data) {
    if (data.id != "") {
      this.toastr.success('Success', 'Outward Delete Successfully');
      this.dtElement.dtInstance.then
        ((dtInstance: DataTables.Api) => dtInstance.ajax.reload()
        );
    } else if (data.AssignSalseReturn == "true") {
      this.toastr.error('Failed', 'Sales return value already assign.');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  public edit(id) {
    this.router.navigate(['outward', { OWNO: id }])
  }
  public viewlogs(OWNOId) {
    this.showOutwardLogs = true;
    this.userService.outwardlogs(OWNOId).subscribe((res) => {
      this.OutwardLogsData = res;
    });
  }
  CloseLogs() {
    this.showOutwardLogs = false;
  }

  public printoutwardchallan(id) {
    this.outwardNumId = id ;
    this.spinner.show()
    // this.router.navigate(['outwardchallan', { OWNO: id }])
    this.userService.getoutwardchallen(id).subscribe((res) => {
      this.getoutwardchallen(res);
    });
  }


//jsdkfjhsdfkjd

//   pdf(): void {
//     let PdfContents, popupWin;
//     PdfContents = document.getElementById('print-section').innerHTML;
    
//     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
//     popupWin.document.open();
//     popupWin.document.write(`
//       <html>
//         <head>
//           <title> OUTWARDPdf_ ${this.Name} </title>
//           <style>
//           //........Customized style.......
//           </style>
//         </head>
//     <body onload="window.print();window.close()">${PdfContents}</body>
//       </html>`
//     );
//     popupWin.document.close();
// }





  public getoutwardchallen(res) {
    // console.log('DATAA' , res)
    this.showOutwardChallan = true;
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
    this.SoNumber = res[0][0].SoNumber;
    this.Transporter = res[0][0].Transporter;
    this.PartyDiscount = res[0][0].PartyDiscount;
    this.Remarks = res[0][0].Remarks;

    this.Roundoff = res[1].RoundOff.Roundoff;
    if (this.Roundoff) {
      this.BorderBottomWithoutRoundOff = false;
    } else {
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

    this.TotalQuantityAllInSet = res[1]['TotalQuantityAllInSet'];
    this.TotalWeight = res[1]['TotalWeight'];
    this.Discount = res[1]['Discount'];
    this.DiscountAmount = res[0][0]['Discount_in_amount'];
    // console.log('dddddddddddddd', res[0][0]['Discount_in_amount'])
    this.ExtraDiscountpercentage = res[1]['ExtraDiscountpercentage'];
    this.TotalFinalAmount = res[1]['TotalFinalAmount'];
    this.GSTLabel = res[1]['GSTLabel'];
    this.GSTValue = res[1]['GSTValue'];
    this.SGSTValue = res[1]['SGSTValue'];
    this.CGSTValue = res[1]['CGSTValue'];
    this.GSTPercentage = res[1]['GSTPercentage'];
    this.GSTType = res[1]['GSTType'];
    this.SubTotalAmount = res[1]['SubTotalAmount'];


    if (this.GSTType == "GST") {
      this.GSTTypeStatus = true;
      this.GSTPercentage = (this.GSTPercentage / 2);
      //alert(this.GSTValue);
      //this.GSTValue = (this.GSTValue/2);
      //alert(this.GSTValue);
    } else {
      this.GSTTypeStatus = false;
      // alert(this.GSTPercentage);
    }

    this.challanoutwardlist = res;
    let outwardlist1 = res[0];

    this.preparedby = res[0][0].PreparedUserName;

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    let outwardlist12: any;
    var Count1 = Object.keys(outwardlist1).length;

    this.spinner.hide();

  }
  isIntCheck(n) {
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
      FileuploadformData.append("outwardNumId", this.outwardNumId);
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

  pdf(element) {
    $(".rupeesymbol").replaceWith("Rs.");
    //alert(this.Name);
    //exportOutwardElement(element, this.Name);
    exportOutwardElement(element, this.Name, { paperSize: "A4", scale: 0.6, repeatHeaders: true });
    //exportOutwardElement(element, this.Name, { paperSize: "A4",scale: 0.5});
    // this.ngOnInit();
  }
  goBack() {
    this.showOutwardChallan = false;
    // window.history.back();
  }

}

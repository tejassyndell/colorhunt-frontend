import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

class Person {
  Id: number;
  Name: string;
  ArticleNumber:string;
  ReturnNoPacks:string;
  CreatedDate:string;
  Action:string
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}

@Component({
  selector: 'app-purchasereturnlist',
  templateUrl: './purchasereturnlist.component.html',
  styleUrls: ['./purchasereturnlist.component.scss']
})
export class PurchasereturnlistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  //public purchasereturnlist: Person[];
  public startnumber:  any;
  public purchasereturnlist:  Person[];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  BaseURL: string;
  accessdenied: boolean = true;
  showPurchaseReturnChallan :boolean = false ;

  PRDate: any;
  PRNO: any;
  GSTNumber: any;
  UserName: any;
  Name: any;
  Address: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  public solist: any = [];
  getuserdata: any;
  PurchaseReturnNumber: any;
  UserWiseData: boolean = true;
  Remarks: any;

  preparedby: any;
  verifiedby: any;
  UserRole: any;
  showPurchaseReturnLogs: boolean = false;
  PurchaseReturnLogsData: any;

  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService,private http: HttpClient,private titleService: Title) {
    this.titleService.setTitle("Purchase Return List | Colorhunt");
    this.spinner.show();
    this.BaseURL = environment.UploadBaseURL;
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
      setTimeout(() => this.spinner.show(), 25);
      //add new call
      const that = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        columnDefs: [{
          "targets": 'no-sort',
          "orderable": false,
        }], "order": [[1,"desc"]],

        ajax: (dataTablesParameters: any, callback) => {
          that.http.post<DataTablesResponse>(
              this.ApiURL+"/postpurchasereturn",
              dataTablesParameters, {}
            ).subscribe(resp => {
              that.purchasereturnlist = resp.data;
              that.startnumber = resp.startnumber;
              this.spinner.hide();
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
        },
        columns: [{ data: 'No' }, { data: 'Name' },{ data: 'ArticleNumber' }, { data: 'ReturnNoPacks' },{data:'CreatedDate' },{ data: 'Action' }]
      };
      //end

    } else {
      this.spinner.hide();
    }
  }


    ngAfterViewInit(): void {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on( 'draw.dt', function () {
      if($('.dataTables_empty').length > 0)
      {
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
        if (data[i].PageId == 25) {
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
        if (data[i].PageId == 25) {
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

  public delete(id) {
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
        this.userService.deletepurchasereturn(id , item[0].Id).subscribe((res) => {

          this.success(res);
        });
      } else {

      }
    });
  }

  success(data) {
    if (data.id == "SUCCESS") {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => dtInstance.ajax.reload());
      this.toastr.success('Success', 'Purchase Return Deleted Successfully');
    } else if (data.Alreadyexist == "true") {
      this.toastr.error('Failed', 'Already assign pieces');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  printpurchasereturnchallan(id) {
    this.spinner.show();
    // this.router.navigate(['purchasereturnchallan', { PR: id }])
    this.userService.getpurchasereturnchallan(id).subscribe((res) => {
      this.getpurchasereturnchallan(res);
    });
  }


  public edit(id) {
    this.router.navigate(['purchasereturn', { PRONO: id }])
  }
  public viewlogs(PRONOId) {
    this.showPurchaseReturnLogs = true;
    this.userService.purchasereturnlogs(PRONOId).subscribe((res) => {
      this.PurchaseReturnLogsData = res;
    });
  }

  CloseLogs() {
    this.showPurchaseReturnLogs = false;
  }
  codeprint() {
    this.router.navigate(['printcode'])

  }
  public getpurchasereturnchallan(res){
    this.showPurchaseReturnChallan = true;
    this.PRDate=  res[0][0].PRDate;
    this.UserName = res[0][0].UserName;
    this.Name= res[0][0].Name;
    this.Address= res[0][0].Address;
    this.GSTNumber= res[0][0].GSTNumber;
    this.PRNO = res[0][0].PurchaseReturnNumber;
    this.Remarks = res[0][0].Remark;

    this.preparedby = res[0][0].UserName;
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic= res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];
    this.solist = res;
    this.spinner.hide();
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
    this.showPurchaseReturnChallan = false;
  }

}

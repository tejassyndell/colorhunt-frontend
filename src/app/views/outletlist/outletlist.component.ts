import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

class Person {
  Id: number;
  OutletName:string;
  PartyName:string;
  TotalPieces:number;
  OutletDate:string;
  OutletNumber: string;
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
  selector: 'app-outletlist',
  templateUrl: './outletlist.component.html',
  styleUrls: ['./outletlist.component.scss']
})
export class OutletlistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public outletlistdata:  Person[];
  public startnumber:  any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject <any> = new Subject();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  accessdenied: boolean = true;
  showOutletChallan : boolean = false;



  OutletDate: any;
  OutletNumber: any;
  UserName: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  PartyName: any;
  Address :any ;
  Contact :any ;
  Remarks :any ;
  GST :any ;

  public outletlist: any = [];
  getuserdata: any;
  UserWiseData: boolean = true;
  Roundoff: boolean;
  TotalRoundAmount: any;
  AdjustAmount: any;
  Discount: any;
  TotalFinalAmount: any;
  RoundValueSign: any;
  GSTLabel: any;
  GSTValue: any;
  BorderBottomWithoutRoundOff: boolean = false;
  preparedby: any;
  verifiedby: any;
  SalesPerson:any;
  showOutletLogs: boolean = false;
  OutletLogsData: any;
  UserRole: any;

  constructor(private userService: UserService, public router: Router,private toastr: ToastrService,private spinner: NgxSpinnerService,private http: HttpClient,private titleService: Title) {
    this.titleService.setTitle("Outward (Outlet) List | Colorhunt");
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.UserRole = item[0].Role;
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights,1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res,2);
      });
    }
    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 25);
      let userdata =  JSON.parse(localStorage.getItem('logindata'));
      let uID = userdata[0].Id;
       this.isList= 1;
      const that = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        columnDefs: [{
          "targets": 'no-sort',
          "orderable": false,
        }], "order": [[5,"desc"]],
        ajax: (dataTablesParameters: any, callback) => {
         let  ParentObj = { dataTablesParameters: dataTablesParameters , UserID:uID }
          that.http.post<DataTablesResponse>(
              this.ApiURL+"/postoutletlist",
              ParentObj, {}
            ).subscribe(resp => {
              that.outletlistdata = resp.data;
              that.startnumber = resp.startnumber;
              this.spinner.hide();
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
        },
        columns: [{ data: 'No' },  {data: 'OutletName'}, {data: 'PartyName'}, {data: 'TotalPieces'}, { data: 'OutletDate' },{data:'OutletNumber'}, { data: 'Action' }]
      };


    }else{
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
        if (data[i].PageId == 21) {
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
        if (data[i].PageId == 21) {
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
        this.userService.deleteoutletnumber(id , item[0].Id).subscribe((res) => {
          this.dtElement.dtInstance.then
          ((dtInstance: DataTables.Api) => dtInstance.ajax.reload()
         );
          this.success(res);
        });
      } else {

      }
    });
  }

  public edit(id) {
    this.router.navigate(['outlet', { OTLNO: id }])
  }
  public viewlogs(OTLNOId) {
    this.showOutletLogs = true;
    this.userService.outletlogs(OTLNOId).subscribe((res) => {
      this.OutletLogsData = res;
    });
  }
  CloseLogs() {
    this.showOutletLogs = false;
  }

  public printoutletchallan(id) {
    this.spinner.show();
    // this.router.navigate(['outletchallan', { OTLNO: id }])
    this.userService.getoutletchallen(id).subscribe((res) => {
      this.getoutletchallen(res);
    });
  }

  success(data) {
    if (data.id != "") {
       this.toastr.success('Success', 'Outlet Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  public getoutletchallen(res) {
    this.showOutletChallan =true;
    this.OutletDate = res[0][0].OutletDate;
    this.UserName = res[0][0].UserName;
    this.SalesPerson = res[0][0].SalesPerson;
    this.OutletNumber = res[0][0].OutletNumber;
    this.PartyName = res[0][0].PartyName;
    this.Address  = res[0][0].Address;
    this.Contact  = res[0][0].Contact;
    this.Remarks  = res[0][0].Remarks;
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
    // setTimeout(() => this.spinner.hide(), 25);
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
    this.showOutletChallan =false;
  }

}

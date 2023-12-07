import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { exportElement } from '../../export-element';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

class Person {
  Id: number;
  SoNumber: string;
  Name: string;
  TotalSoPieces: string;
  SoDate: string;
  Destination: string;
  Transporter: string;
  OWID: number;
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
  selector: 'app-solist',
  templateUrl: './solist.component.html',
  styleUrls: ['./solist.component.scss']
})
export class SolistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public solist: Person[];
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
  adminaccess: boolean = false;
  showSOChallan: boolean = false;

  SODate: any;
  SoNumber: any;
  GSTNumber: any;
  SalesPerson: any;
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
  public challansolist: any = [];
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
  UserRole: any;
  showSOLogs: boolean = false;
  SOLogsData: any;
  ArticleId: any;


  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {

    this.titleService.setTitle("SO List | Colorhunt");
  }

  async ngOnInit() {


    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    this.UserRole = item[0].Role;

    if (item[0].RoleName == "Outward") {
      for (let i = 0; i < rolerights.length; i++) {
        if (rolerights[i].Name == 'SO' && rolerights[i].Id == 33) {

          this.adminaccess = true;

        }
      }
    }

    if (rolerights != "" && rolerights != null && rolerights !== undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }

    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 10);
      this.dtOptions = {
        pagingType: 'numbers',
        pageLength: 10,
        processing: true,
        order: [[0, 'asc']]
      };
      this.isList = 1;
      this.getSo();
      this.spinner.hide();
    } else {
      this.spinner.hide();
    }
  }
  async getadminId() {

  }
  usernewId;

  public async getSo() {
    let userdata = JSON.parse(localStorage.getItem('logindata'));

    if (this.adminaccess == true) {
      const adminId = localStorage.getItem('newadminId');

      if (adminId == null) {
        await this.userService.admingetuserId().subscribe((res) => {


          if (res[0].Id != "") {
            localStorage.setItem('newadminId', res[0].Id);
            this.getSonew(res[0].Id);
          }
        })

      } else {

        this.usernewId = adminId;
        this.getSonew(this.usernewId);
      }


    } else {
      this.usernewId = userdata[0].Id
      this.getSonew(this.usernewId);
    }

  }

  getSonew(adminuserId) {

    const that = this;
    this.dtOptions = {
      serverSide: true,
      processing: true,
      columnDefs: [{
        "targets": 'no-sort',
        "orderable": false,
      }], "order": [[1, "desc"]],
      ajax: (dataTablesParameters: any, callback) => {
        let ParentObj = { dataTablesParameters: dataTablesParameters, UserID: adminuserId }

        that.http.post<DataTablesResponse>(
          this.ApiURL + "/postsolist",
          ParentObj, {}
        ).subscribe(resp => {
          that.solist = resp.data;
          that.startnumber = resp.startnumber;
          this.spinner.hide();
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [{ data: 'No' }, { data: 'SoNumber' }, { data: 'Name' }, { data: 'TotalSoPieces' }, { data: 'SoDate' }, { data: 'Destination' }, { data: 'Transporter' }, { data: 'Action' }]
    };


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
        if (data[i].PageId == 5) {
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
        if (data[i].PageId == 5) {
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
        this.userService.deletesonumber(id , item[0].Id) .subscribe((res) => {
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
    this.router.navigate(['so', { SONO: id }])
  }
  public viewlogs(SONOId) {
    this.showSOLogs = true;
    this.userService.sologs(SONOId).subscribe((res) => {
      // console.log("res logs" , res)
      this.SOLogsData = res;
    });
  }
  CloseLogs() {
    this.showSOLogs = false;
  }

  public printsochallan(id) {
    // this.router.navigate(['sochallan', { SONO: id,Back:1 }])
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
    this.spinner.show()
    this.userService.sodatacheckuserwise(this.getuserdata[0].Id, id).subscribe((res) => {
      this.userService.getsochallen(id).subscribe((res) => {
        this.getsochallen(res);
      });

    });
  }

  success(data) {
    if (data != "") {
      this.toastr.success('Success', 'SO Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }


  public getsochallen(res) {
    this.showSOChallan = true;
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
    this.preparedby = res[0][0].UserName;

    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic = res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];
    this.challansolist = res;

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;


    this.Roundoff = res[1].RoundOff.Roundoff;
    if (this.Roundoff) {
      this.BorderBottomWithoutRoundOff = false;
    } else {
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

    if (this.GSTType == "GST") {
      this.GSTTypeStatus = true;
      this.GSTPercentage = (this.GSTPercentage / 2);
    } else {
      this.GSTTypeStatus = false;
    }


    this.spinner.hide()
  }


  pdf(element) {
    $(".rupeesymbol").replaceWith("Rs.");
    //alert(this.Name);
    //exportElement(element, this.Name);
    // exportElement(element, this.Name, { paperSize: "A4",
    // margin: { top: "1cm", left: "1cm", right: "1cm", bottom: "1cm" },
    // scale: 0.5});

    exportElement(element, this.Name, { paperSize: "A4", scale: 0.4, repeatHeaders: true });
    // this.ngOnInit();
  }

  goBack() {
    this.showSOChallan = false;
    //     window.history.back();
  }


}

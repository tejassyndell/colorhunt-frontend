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
import { exportElement } from '../../export-element';

class Person {
  Id: number;
  Name: string;
  SoNumber: string;
  SoDate: string;
  Action: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}



@Component({
  selector: 'app-sostatuslist',
  templateUrl: './sostatuslist.component.html',
  styleUrls: ['./sostatuslist.component.scss']
})
export class SostatuslistComponent implements OnInit {
  ApiURL: string = environment.apiURL;

  public sostatuslist: Person[];
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
  showSoStatusChallan : boolean = false;

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

  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("SO Status List | Colorhunt");
    this.spinner.show();

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

      const that = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        columnDefs: [{
          "targets": 'no-sort',
          "orderable": false,
        }], "order": [[1, "asc"]],
        ajax: (dataTablesParameters: any, callback) => {
          that.http.post<DataTablesResponse>(
            this.ApiURL + "/remainingpostoutwardso",
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.sostatuslist = resp.data;
            that.startnumber = resp.startnumber;
            this.spinner.hide();
            callback({

              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
        },
        columns: [{ data: 'No' }, { data: 'Name' }, { data: 'SoNumber' }, { data: 'TotalNoPacks' }, { data: 'TotalSendNoPacks' }, { data: "TotalRemainingNoPacks" }, { data: 'SoDate' }, { data: 'Action' }]
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

  public getSoStatus() {
    //remainingpostoutwardso
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    this.userService.remainingoutwardso().subscribe((res) => {
      const data = res;
      if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.complete();
          this.spinner.hide();
        });
      } else {
        setTimeout(() => {
          this.dtTrigger.complete();
          this.spinner.hide();
        }, 100);

      }

    });
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));

    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 23) {
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
        if (data[i].PageId == 23) {
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

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {
        this.userService.deletesostatus(id).subscribe((res) => {
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
    this.router.navigate(['sostatus', { SOST: id }])
  }

  public printoutwardchallan(id) {
    // this.router.navigate(['soremainingchallan', { Id: id }])
    this.spinner.show();
    this.userService.getsochallen(id).subscribe((res) => {
      this.getsochallen(res);
    });
  }

  public getsochallen(res) {
    this.showSoStatusChallan =  true ;
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

  success(data) {
    if (data != "") {
      this.toastr.success('Success', 'SO Status Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }


  public gotopdfpage(element) {

    // this.router.navigate(['sochallanpdf', { SONO: this.getID }])
    $(".rupeesymbol").replaceWith("Rs.");
    //exportElement(element);
	//exportOutwardElement(element, this.Name);
	  exportElement(element, '', { paperSize: "A4",scale: 0.4,repeatHeaders:true});
    // this.ngOnInit();
  }

  goBack (){
    this.showSoStatusChallan =  false ;
  }

}

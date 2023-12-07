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
import { exportStElement } from '../../export-element';

class Person {
  Id: number;
  OutwardNumber: string;
  SoNumber: string;
  Name: string;
  TotalOutwardPieces: string;
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
  selector: 'app-stocktransferlist',
  templateUrl: './stocktransferlist.component.html',
  styleUrls: ['./stocktransferlist.component.scss']
})
export class StocktransferlistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public stocktransferlist: Person[];
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



  UserWiseData: boolean = true;
  getID: string;
  getuserdata: any;
  stBack: any;
  UserName: any;
  STDate: any;
  STNumber: any;
  Remarks: any;
  TotalConsumedNoPacks: any;
  TotalTransferNoPacks: any;
  public stocktransferlistchallan: any = [];

  showStockTransferChallan: boolean = false;
  showStockTransferLogs: boolean = false;
  StockTransferLogsData: any;
  UserRole: any;

  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("Stock Transfer List | Colorhunt");
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
            this.ApiURL + "/stocktransferpostlist",
            ParentObj, {}
          ).subscribe(resp => {
            that.stocktransferlist = resp.data;
            that.startnumber = resp.startnumber;
            this.spinner.hide();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
        },
        columns: [{ data: 'No' }, { data: 'StocktransferNumber' }, { data: 'Remarks' }, { data: 'TransferNoPacks' }, { data: 'StocktransferDate' }]
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
        if (data[i].PageId == 34) {
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
        if (data[i].PageId == 34) {
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

  public delete(STNO) {
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
        this.userService.deletestocktransfernumber(STNO, item[0].Id).subscribe((res) => {

          if(res){
            this.success(res);
          }
        });
      } else {

      }
    });
  }

  success(data) {
    if (data['status'] == "success") {
      this.toastr.success('Success', 'Stock Transfer Number Delete Successfully');
      this.dtElement.dtInstance.then
      ((dtInstance: DataTables.Api) => dtInstance.ajax.reload()
     );
    }  else if(data['status'] == "failed"){
      this.toastr.error('Failed', 'Stock Transfer Number cannot be delete.Some articles stocks are going negative.');
    }
  }

  public edit(id) {
    this.router.navigate(['stocktransfer', { STNO: id }])
  }
  public viewlogs(STNOId) {
    this.showStockTransferLogs = true;
    this.userService.stocktransferlogs(STNOId).subscribe((res) => {
      this.StockTransferLogsData = res;
    });
  }
  CloseLogs() {
    this.showStockTransferLogs = false;
  }

  public printoutwardchallan(id) {
    this.router.navigate(['outwardchallan', { OWNO: id }])
  }

  public printstocktransferchallan(id) {
    // this.router.navigate(['stocktransferchallan', { STNO: id,Back:1 }])
    this.spinner.show()
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.userService
    .stocktransferdatacheckuserwise(item[0].Id, id)
    .subscribe((res) => {
      if (res["Rights"]) {
        this.UserWiseData = true;
        this.spinner.show();
        this.userService.getstocktransferchallen(id).subscribe((res) => {
          this.TotalConsumedNoPacks = res["TotalConsumedNoPacks"];
          this.TotalTransferNoPacks = res["TotalTransferNoPacks"];
          this.getstocktransferchallen(res["data"]);
        });
      } else {
        this.UserWiseData = false;
      }
    });
    // this.userService.stocktransferdatacheckuserwise(, id).subscribe((res) => {
    //   this.stockTransferChallan(res , id)
    //   });
  }

  // public stockTransferChallan(res , id){
  //   if (res["Rights"]) {
  //     this.UserWiseData = true;
  //     this.spinner.show();
  //     this.userService.getstocktransferchallen(id).subscribe((rescha) => {
  //       this.TotalConsumedNoPacks = rescha["TotalConsumedNoPacks"];
  //       this.TotalTransferNoPacks = rescha["TotalTransferNoPacks"];
  //       this.getstocktransferchallen(rescha["data"]);
  //     });
  //   } else {
  //     this.UserWiseData = false;
  //   }
  // }
  public getstocktransferchallen(res) {
    this.showStockTransferChallan = true;
    this.UserName = res[0].UserName;
    this.STDate = res[0].STDate;
    this.STNumber = res[0].STNumber;
    this.Remarks = res[0].Remarks;
    this.stocktransferlistchallan = res;
    this.spinner.hide();
  }
  pdf(element) {
    exportStElement(element, 'StockTransfer', {
      paperSize: "A4",
      scale: 0.4,
      repeatHeaders: true,
    });
    // this.ngOnInit();
    this.spinner.hide();
  }
  goBack (){
    this.showStockTransferChallan = false;
  }

}


import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';

class Person {
  Id: number;
  PurchaseNumber: string;
  FinancialYear: string;
  ArticleNumber: string;;
  Name: string;
  Title: number;
  NumPacks: number;
  WorkStatusName: string;
  InwardArticleId: string;
  POId: string;
  ArticleId: string;
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
  selector: 'app-polist',
  templateUrl: './polist.component.html',
  styleUrls: ['./polist.component.scss']
})
export class PolistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public polist: Person[];
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



  BaseURL: any;
  Address: any;
  ArticleNumber: any;
  GSTNumber: any;
  Id: any;
  Name: any;
  NumPacks: any;
  PO_Image: any;
  PoDate: any;
  PurchaseNumber: any;
  Remarks: any;
  Brandname: any;
  Title: any;
  challanpolist: [];
  StyleDescription: any;
  isEnable: boolean = false;
  preparedby: any;
  verifiedby: any;
  poBack: boolean = false;
  multipleimage: any;
  multipleimageflag: boolean = false;
  showPOChallan: boolean = false;
  showPOLogs: boolean = false;
  UserRole: any;
  POLogsData: any;


  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("PO List | Colorhunt");
  }

  // ngOnInit() {


  //   let item = JSON.parse(localStorage.getItem('userdata'));
  //   this.UserRole = item[0].Role;
  //   let rolerights = JSON.parse(localStorage.getItem('roleright'));
  //   let roledata = {};
  //   if (rolerights != "" && rolerights != null && rolerights != undefined) {
  //     roledata = rolerights;
  //     this.rightscheck(rolerights, 1);
  //   } else {
  //     this.userService.getroleRights(item[0].Role).subscribe((res) => {
  //       this.rightscheck(res, 2);
  //     });
  //   }
  //   if (this.accessdenied == false) {
  //     setTimeout(() => this.spinner.show(), 25);
  //     const that = this;
  //     this.dtOptions = {
  //       serverSide: true,
  //       processing: true,
  //       columnDefs: [{
  //         "targets": 'no-sort',
  //         "orderable": false,
  //       }], "order": [[1, "desc"]],

  //       ajax: (dataTablesParameters: any, callback) => {
  //         that.http.post<DataTablesResponse>(
  //           this.ApiURL + "/popostlist",
  //           dataTablesParameters, {}
  //         ).subscribe(resp => {
  //           that.polist = resp.data;
  //           that.startnumber = resp.startnumber;
  //           this.spinner.hide();
  //           callback({

  //             recordsTotal: resp.recordsTotal,
  //             recordsFiltered: resp.recordsFiltered,
  //             data: []
  //           });
  //         });
  //       },
  //       columns: [{ data: 'No' }, { data: "PoDate" }, { data: 'PurchaseNumber' }, { data: 'Name' }, { data: 'TotalPieces' }, { data: 'Action' }]
  //     };
  //   } else {
  //     this.spinner.hide();
  //   }
  // }

  

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.UserRole = item[0].Role;
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    let roledata = {};
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      roledata = rolerights;
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
        }],
        "order": [[1, "desc"]],
        ajax: (dataTablesParameters: any, callback) => {
          that.spinner.show();
          this.http.post<DataTablesResponse>(
            this.ApiURL + "/popostlist",
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.polist = resp.data;
            that.startnumber = resp.startnumber;
            that.spinner.hide();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
        },
        columns: [
          { data: 'No' },
          { data: "PoDate" },
          { data: 'PurchaseNumber' },
          { data: 'Name' },
          { data: 'TotalPieces' },
          { data: 'Action' }
        ]
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
        if (data[i].PageId == 6) {
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
        if (data[i].PageId == 6) {
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

  public delete(POId) {
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
        this.userService.deletepopon(POId , item[0].Id).subscribe((res) => {
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
    this.router.navigate(['po', { PO: id }])
  }
  public viewlogs(id) {
    this.showPOLogs = true;
    this.userService.pologs(id).subscribe((res) => {
      this.POLogsData = res;
    });
  }
  CloseLogs() {
    this.showPOLogs = false;
  }

  success(data) {
    if (data == "SUCCESS") {
      this.toastr.success('Success', 'PO Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  printpochallan(PO) {
    // this.router.navigate(['pochallan', { PO: PO}])
    this.spinner.show()
    this.userService.getpochallen(PO).subscribe((res) => {
      this.getpochallen(res);
      this.spinner.hide();
    });
  }


  public getpochallen(res) {
    this.showPOChallan = true ;
    this.BaseURL = environment.UploadBaseURL;
    this.Address = res[0].Address;
    this.ArticleNumber = res[0].ArticleNumber;
    this.GSTNumber = res[0].GSTNumber;
    this.Id = res[0].Id;
    this.Name = res[0].Name;
    this.NumPacks = res[0].NumPacks;
    this.PO_Image = res[0].PO_Image;
    this.PoDate = res[0].PoDate;
    this.Brandname = res[0].Brandname;
    this.PurchaseNumber = res[0].PurchaseNumber;
    this.Remarks = res[0].Remarks;
    this.Title = res[0].Title;
    this.StyleDescription = res[0].StyleDescription;
    this.preparedby = res[0].PreparedBy;
    this.challanpolist = res;

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    this.multipleimage = res[0].MultipleImage;
    //alert(this.multipleimage);
    if (this.multipleimage == 1) {
      this.multipleimageflag = true;
    } else {
      this.multipleimageflag = false;
      if (this.PO_Image) {
        this.isEnable = true;
      } else {
        this.isEnable = false;
      }
    }

    this.spinner.hide();

  }
  public goBack(){
    this.showPOChallan = false ;
  }

}

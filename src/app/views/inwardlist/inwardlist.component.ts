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
var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var htmlToPdfmake = require("html-to-pdfmake");
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';

class Person {
  Id: number;
  GRN_Number: string;
  Name: string;
  TotalInwardPieces: string;;
  InwardDate: string;
  SODataCheck: number;
  SOID: number;
  GRN: string;
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
  selector: 'app-inwardlist',
  templateUrl: './inwardlist.component.html',
  styleUrls: ['./inwardlist.component.scss']
})
export class InwardlistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public inwardlist: Person[];
  public startnumber: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  isAdd: any;
  public inwardlistchallan: any = [];
  isEdit: any;
  isDelete: any;
  isList: any;
  accessdenied: boolean = true;
  countRate: any;
  countWight: any;

  showVendorId: boolean = false;
  VendorName: any;
  VendorAddress: any;
  VendorGSTNumber: any;
  InwardDate: any;
  GRN_Number: any;
  Remark: any;
  Name: any;
  Address: any;
  GSTNumber: any;
  countNoPacks: any;
  countTotalSetQuantity: any;
  PurchaseNumber: any;
  Notes: any;
  PoDate: any;
  BrandName: any;
  preparedby: any;
  verifiedby: any;
  Canceled: boolean = false;
  showRejection: boolean = false;
  rejections: any = [];
  totalRejectionPacks:any;

  showInwardChallan:boolean =false;
  showInwardLogs: boolean = false;
  InwardLogsData: any;
  UserRole:any;


  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("Inward List | Colorhunt");
  }

  ngOnInit() {

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.UserRole = item[0].Role
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
        }], "order": [[1, "desc"]],

        ajax: (dataTablesParameters: any, callback) => {
          that.http.post<DataTablesResponse>(
            this.ApiURL + "/inwardpostlist",
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.inwardlist = resp.data;
            that.startnumber = resp.startnumber;
            this.spinner.hide();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
        },
        columns: [{ data: 'No' }, { data: 'GRN_Number' }, { data: 'Name' }, { data: 'TotalInwardPieces' }, { data: 'InwardDate' }, { data: 'Action' }]
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
        if (data[i].PageId == 3) {
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
        if (data[i].PageId == 3) {
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

  // ngOnDestroy(): void {
  //   this.dtTrigger.unsubscribe();
  // }

  public cancel(GRN) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancellation!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {

        Swal.fire({
          title: 'Reason for Cancellation',
          inputPlaceholder: 'Type your message here...',
          input: 'textarea',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Submit Notes',
          showLoaderOnConfirm: true,
          preConfirm: (Notes) => {
            // alert(notes);
            // alert(GRN);

            if (Notes == "") {
              Swal.showValidationMessage(
                `Please enter a notes`
              )
            } else {
              setTimeout(() => this.spinner.show(), 25);
              this.userService.cancellationinwardgrn({ 'GRN': GRN, 'Notes': Notes }).subscribe((res) => {
                this.spinner.hide();
                this.dtElement.dtInstance.then
                  ((dtInstance: DataTables.Api) => dtInstance.ajax.reload()
                  );
                this.success(res);
                //this.success(res);
              });
              // return fetch(`//api.github.com/users/${login}`)
              // .then(response => {
              //   if (!response.ok) {
              //     throw new Error(response.statusText)
              //   }
              //   return response.json()
              // })
              // .catch(error => {
              //   Swal.showValidationMessage(
              //     `Request failed: ${error}`
              //   )
              // })
            }

          },
          allowOutsideClick: () => !Swal.isLoading()
        });
        // .then((result) => {
        //   if (result.value) {
        //     Swal.fire({
        //       title: `${result.value.login}'s avatar`,
        //       imageUrl: result.value.avatar_url
        //     })
        //   }
        // })

        // this.userService.deleteinwardgrn(GRN).subscribe((res) => {
        //   this.dtElement.dtInstance.then
        //   ((dtInstance: DataTables.Api) => dtInstance.ajax.reload()
        //  );
        //   this.success(res);
        // });
      } else {

      }
    });
  }

  public delete(GRN) {
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
        this.userService.deleteinwardgrn(GRN , item[0].Id).subscribe((res) => {
          this.dtElement.dtInstance.then
            ((dtInstance: DataTables.Api) => dtInstance.ajax.reload()
            );
          this.success(res);
        });
      } else {

      }
    });
  }

  cancelsuccess(data) {
    if (data == "SUCCESS") {
      this.toastr.success('Success', 'Inward Canceled Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  success(data) {
    if (data == "SUCCESS") {
      this.toastr.success('Success', 'Inward Deleted Successfully');
    } else if (data == "AlreadyMixAssign") {
      this.toastr.error('Failed', 'There is smaller pieces of Mix/Rejection in GRN');
    } else if (data == "AlreadyArticleAssign") {
      this.toastr.error('Failed', 'Sales order generated from GRN');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  public edit(id) {
    this.router.navigate(['inward', { GRN: id }])
  }
  public viewlogs(GRNId) {
    this.showInwardLogs = true;
    this.userService.inwardlogs(GRNId).subscribe((res) => {
      this.InwardLogsData = res;
    });
  }
  CloseLogs() {
    this.showInwardLogs = false;
  }
  printinwardchallan(id, type) {
    this.spinner.show()
    this.userService.getinwardchallen(id, type).subscribe((res) => {
      // alert(type);
      this.getinwardchallenPopup(res, type);
    });
    // this.router.navigate(['inwardchallan', { GRN: id, type: type }])
  }

  // public downloadPDF(id, type) {

  //   this.userService.getinwardchallen(id, type).subscribe((res) => {
  //     // alert(type);
  //     this.getinwardchallen(res, type);
  //   });
  //   var val = htmlToPdfmake(`
  //   <div>
  //     <h1>My title</h1>
  //     <p>
  //     Inward Challan
  //     </p>
  //   </div>
  // `);
  //   var dd = { content: val };
  //   pdfMake.createPdf(dd).download();
  // }

  public getinwardchallenPopup(res, type) {
    this.showInwardChallan = true ;
    if (type == 0) {
      this.Canceled = true;
    } else {
      this.Canceled = false;
    }
    this.InwardDate = res[0][0].InwardDate;
    this.GRN_Number = res[0][0].GRN;
    this.Remark = res[0][0].Remark;
    this.Name = res[0][0].Name;
    this.Address = res[0][0].Address;
    this.GSTNumber = res[0][0].GSTNumber;
    this.PoDate = res[0][0].PoDate;
    this.BrandName = res[0][0].BrandName;
    this.PurchaseNumber = res[0][0].PurchaseNumber;
    this.Notes = res[0][0].Notes;

    this.countNoPacks = res[1]['countNoPacks'];
    this.countTotalSetQuantity = res[1]['countTotalSetQuantity'];
    this.countRate = res[1]['countRate'];
    this.countWight = res[1]['countWight'];


    this.showVendorId = res[1]['vendorInformation'];
    this.VendorName = res[1]['vendorName'];
    this.VendorAddress = res[1]['vendorAddress'];
    this.VendorGSTNumber = res[1]['vendorGSTNumber'];

    this.preparedby = res[0][0].PreparedBy;
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    this.inwardlistchallan = res;
    res[0].forEach(inwardInner => {
      if(inwardInner.rejections){
        inwardInner.rejections = JSON.parse(inwardInner.rejections);
      }
    });
    this.inwardlistchallan = res;

    this.spinner.hide();
  }



  //Inward Challan Functions
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
  public goBack(){
    this.showInwardChallan = false ;
  }

}

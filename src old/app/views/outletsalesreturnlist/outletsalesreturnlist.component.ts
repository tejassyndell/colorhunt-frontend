import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Title } from '@angular/platform-browser';

class Person {
  Id: number;
  Name: string;
  OutwardNumber:string;
  OutletPartyName: string;
  ArticleNumber:string;;
  NoPacks:string;
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
  selector: 'app-outletsalesreturnlist',
  templateUrl: './outletsalesreturnlist.component.html',
  styleUrls: ['./outletsalesreturnlist.component.scss']
})
export class OutletsalesreturnlistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public sostatuslist: Person[];
  public startnumber:  any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  accessdenied: boolean = true;
  showOutSalesReturnChallan : boolean = false ;


  showOutletPartyId: boolean = false;
  
  OutletPartyAddress: any;
  OutletPartyGSTNumber: any;
  
  SRDate: any;
  SRNO: any;
  GSTNumber: any;
  UserName: any;
  Name: any;
  OutletPartyName: any;
  Address: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  public solist: any = [];
  getuserdata: any;
  UserWiseData: boolean = true;
  preparedby: any;
  verifiedby: any;
  Remark: any;
  OutletNumber: any;
  UserRole: any;
  id: any;
  showOutletSalesReturnLogs: boolean = false;
  OutletSalesReturnLogsData: any;


  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService,private http: HttpClient,private titleService: Title) {
    this.titleService.setTitle("Outlet Sales Return List | Colorhunt");
    this.spinner.show();

  }

  ngOnInit() {


    let item = JSON.parse(localStorage.getItem('userdata'));
    // console.log('NNNN',localStorage)
    const data = JSON.parse(localStorage.getItem('userdata'));
    this.id = data[0].Id;
    // console.log('NNNN',id);



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

     this.getsalsereturnlist();


    } else {
      // console.log('denied')
      this.spinner.hide();
    }
  }


  public getsalsereturnlist() {
    // console.log('get IIIIIIIIIIIIIIIIIIII', this.id)
    // let userdata =  JSON.parse(localStorage.getItem('logindata'));
    // let uID = userdata[0].Id;
    const that = this;
    this.dtOptions = {
      serverSide: true,
      processing: true,
      columnDefs: [{
        "targets": 'no-sort',
        "orderable": false,
      }], "order": [[4,"desc"]],

      ajax: (dataTablesParameters: any, callback) => {
        // let  ParentObj = { dataTablesParameters: dataTablesParameters , UserID:uID }
        that.http.post<DataTablesResponse>(
            this.ApiURL+"/postoutletsalesreturn?pid=" + this.id,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.sostatuslist = resp.data;
            // console.log('JP',that.sostatuslist);
            that.startnumber = resp.startnumber;
            this.spinner.hide();
            callback({

              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
                     
            });
          });
      },
      columns: [{ data: 'No' }, { data: 'SalesReturnNumber' },  { data: 'NoPacks' },{data: 'OutletPartyName'}, { data: 'CreatedDate' }, { data: 'Action' }]
      
    };
  }


  // public getsalsereturnlist() {
  //   console.log('get IIIIIIIIIIIIIIIIIIII', this.id)
  //   const that = this;
  //   this.dtOptions = {
  //     serverSide: true,
  //     processing: true,
  //     columnDefs: [{
  //       "targets": 'no-sort',
  //       "orderable": false, 
  //     }],
  //     ajax: (dataTablesParameters: any, callback) => {
  //       that.http.post<DataTablesResponse>(
  //         this.ApiURL+"/postoutletsalesreturn?pid=" + this.id,
  //         dataTablesParameters, {}
  //       ).subscribe(resp => {
  //         that.sostatuslist = resp.data;
  //         console.log('JP',that.sostatuslist);
  //         that.startnumber = resp.startnumber;
          
  //         // Sort the data by the "CreatedDate" column in ascending order
  //         that.sostatuslist.sort((a, b) => {
  //           return new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime();
  //         });

  //         // Call the callback function with the sorted data
  //         callback({
  //           recordsTotal: resp.recordsTotal,
  //           recordsFiltered: resp.recordsFiltered,
  //           data: that.sostatuslist
  //         });
  //       });
  //     },
  //     columns: [
  //       { data: 'No' },
  //       { data: 'SalesReturnNumber' },
  //       { data: 'NoPacks' },
  //       { data: 'OutletPartyName' },
  //       { data: 'CreatedDate' },
  //       { data: 'Action' }
  //     ]
  //   };
  // }

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
        if (data[i].PageId == 36) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }
          this.isList = data[i].ListRights;
          this.isDelete = data[i].DeleteRights;
          this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;

          break;
        } else {
          this.accessdenied = true;
        }

      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 36) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }
          this.isList = data[i].ListRights;
          this.isDelete = data[i].DeleteRights;
          this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;

          break;
        } else {
          this.accessdenied = true;
        }

      }

    }
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
        this.userService.deletesalesreturn(id , item[0].Id).subscribe((res) => {
          this.success(res);
        });
      } else {

      }
    });
  }

  success(data) {
    if (data.id == "SUCCESS") {
      this.dtElement.dtInstance.then
      ((dtInstance: DataTables.Api) => dtInstance.ajax.reload()
     );
      this.toastr.success('Success', 'Sales Return Deleted Successfully');
    } else if (data.Alreadyexist == "true") {
      this.toastr.error('Failed', 'Already assign pieces');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  printsalesreturnchallan(id) {
    this.spinner.show()
    // this.router.navigate(['outletsalesreturnchallan', { OSR: id }])
    this.userService.getoutletsalesreturnchallan(id).subscribe((res) => {
      this.getoutletsalesreturnchallan(res);
    });
  }

  public edit(id) {
    this.router.navigate(['outletsalesreturn', { OSRONO: id }])
  }
  public viewlogs(OSRONOId) {
    this.showOutletSalesReturnLogs = true;
    this.userService.outletsalesreturnlogs(OSRONOId).subscribe((res) => {
      this.OutletSalesReturnLogsData = res;
    });
  }

  CloseLogs() {
    this.showOutletSalesReturnLogs = false;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  public getoutletsalesreturnchallan(res){
    this.showOutSalesReturnChallan = true;
    this.OutletNumber = res[0][0].OutletNumber;
    this.SRDate=  res[0][0].SRDate;
    this.UserName = res[0][0].UserName;
    this.Name= res[0][0].Name;
    this.Address= res[0][0].Address;
    this.GSTNumber= res[0][0].GSTNumber;
    this.SRNO = res[0][0].SalesReturnNumber;
    // console.log('SalesReturnNumber'); 
    this.OutletPartyName = res[0][0].OutletPartyName;
    // console.log(this.OutletPartyName);  
    this.Remark = res[0][0].Remark;

    this.preparedby = res[0][0].UserName;
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;


    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic= res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];
    this.solist = res;

    this.showOutletPartyId = res[0][0]['Outletdata'];
    this.OutletPartyName = res[0][0]['OutletPartyName'];
    this.OutletPartyAddress = res[0][0]['OutletPartyAddress'];
    this.OutletPartyGSTNumber = res[0][0]['OutletPartyGSTNumber'];
    this.spinner.hide()
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
    this.showOutSalesReturnChallan = false;
    // window.history.back();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from './../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

class Person {
  Id: number;
  ArticleNumber: string;
  Title: string;
  TotalPieces: string;
  TotalNoPacks: string;
  SalesNoPacks: string;
  ArticleColor: string;
  ArticleSize: string;
  ArticleRatio: string;
  TotalNoPacksStocks: string;
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
  selector: 'app-rangewisedailyreports',
  templateUrl: './rangewisedailyreports.component.html',
  styleUrls: ['./rangewisedailyreports.component.scss']
})
export class RangewisedailyreportsComponent implements OnInit {

//   selected: any;
// alwaysShowCalendars: boolean;
// ranges: any = {
//   'Today': [moment(), moment()],
//   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//   'This Month': [moment().startOf('month'), moment().endOf('month')],
//   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
// }
// invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

// isInvalidDate = (m: moment.Moment) =>  {
//   return this.invalidDates.some(d => d.isSame(m, 'day') )
// }

isList: any;
isAdd: any;
isEdit: any;
isDelete: any;
Outletpermissions: boolean = false;
AllReportpermissions: boolean = false;


  flagstockdata: boolean = false;
  getsallstocks: any;
  public allstocksist: Person[];
  ApiURL: string = environment.apiURL;
  public startnumber: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  accessdenied: boolean = true;
  RangeStartDate: Date;
  RangeEndDate: Date;
  constructor(private userService: UserService, public router: Router, private spinner: NgxSpinnerService, private http: HttpClient,private titleService: Title) {
    this.titleService.setTitle("Daily Stock Report | Colorhunt");
    //this.alwaysShowCalendars = true;
    this.RangeStartDate = new Date();
    this.RangeEndDate = new Date();
  }

  onSubmit(data){
    //this.ngAfterViewInit();
    this.flagstockdata = true;
    debugger;

  
      const dataUrl = this.ApiURL + "/getsrangewiseallstocks/"+data.rangestartdate+"/"+data.rangeenddate;
 
      this.dtOptions = {
        ajax: dataUrl,
        columns: [{
          title: 'Series',
          data: 'Series'
        }, {
          title: 'Sub-Cat',
          data: 'Subcategory'
        }, {
          title: 'Cat',
          data: 'Category'
        },
        {
          title: 'Art No.',
          data: 'ArticleNumber',
        },
        {
          title: 'Opening',
          data: 'TotalOpeningStock'
        },
        {
          title: 'Inw. Qty',
          data: 'TotalInwardQuantity'
        },
        {
          title: 'Sales Return',
          data: 'SalesReturnNoPacks'
        },
        {
          title: 'Outlet Sales Return',
          data: 'OutletSalesReturnNoPacks'
        },
        {
          title: 'Prodction Stock',
          data: 'TotalTransferNoPacks'
        },
        {
          title: 'Total Inward',
          data: 'TotalInward'
        },
        {
          title: 'Dom. Out Qty',
          data: 'TotalDomesticOutQuantity'
        },
        {
          title: 'Exp. Out Qty',
          data: 'TotalExportOutQuantity',
         // class: 'none'
        }, 
        {
          title: 'Purchase Return',
          data: 'PurchaseReturnNoPacks',
         // class: 'none'
        },
        {
          title: 'Consumed Stock',
          data: 'TotalConsumedNoPacks',
        //  class: 'none'
        },
        {
          title: 'Shortage',
          data: 'TotalInwardCancellation',
        //  class: 'none'
        },
        {
          title: 'Total Outward Qty',
          data: 'TotalOutwardQuantity',
        //  class: 'none'
        }, {
          title: 'Closing',
          data: 'Closing',
         // class: 'none'
        }
        ],
        //dom: 'Bfrtip',
        dom: "lBfrtip",
        // Configure the buttons
        buttons: [
          { extend: 'copy', className: 'reportbutton', title: 'Colorhunt '+data.rangestartdate+' To '+data.rangeenddate },
          { extend: 'print', className: 'reportbutton', title: 'Colorhunt '+data.rangestartdate+' To '+data.rangeenddate },
          { extend: 'excel', className: 'reportbutton', title: 'Colorhunt '+data.rangestartdate+' To '+data.rangeenddate }
        ],
        // Use this attribute to enable the responsive extension
        //className: 'table-button button btn btn-success',
        //responsive: true,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
       // dom: '<"bottom"flp><"clear"><"top"i>rt'
        //info: true, 
      }; 
    
  }
  ngOnInit(): void {
    // let item = JSON.parse(localStorage.getItem('userdata'));
    // if(item[0].Role==2 || item[0].Role==4){
    //   this.accessdenied = false;
    // } else{
    //   this.accessdenied = true;
    // }

    let item = JSON.parse(localStorage.getItem('userdata'));
    if(item[0].Role==7){
      this.AllReportpermissions = false;
      this.Outletpermissions = true;
    } else{
      this.AllReportpermissions = true;
    }
  
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
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
        
        if (data[i].PageId == 48) {
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
        if (data[i].PageId == 48) {
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



}



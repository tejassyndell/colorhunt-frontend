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
  selector: 'app-rangestokesreports',
  templateUrl: './rangestokesreports.component.html',
  styleUrls: ['./rangestokesreports.component.scss']
})
export class RangestokesreportsComponent implements OnInit {

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


  flagstockdata: boolean = false;
  getsallstocks: any;
  public allstocksist: Person[];
  ApiURL: string = environment.apiURL;
  public startnumber: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  accessdenied: boolean = false;
  RangeStartDate: Date;
  RangeEndDate: Date;
  OutletPartyId: any;
  public partydropdown: any = [];
  Outlet: any;

  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  Outletpermissions: boolean = false;
  AllReportpermissions: boolean = false;

  constructor(private userService: UserService, public router: Router, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("All Stock List | Colorhunt");
    //this.alwaysShowCalendars = true;
    this.RangeStartDate = new Date();
    this.RangeEndDate = new Date();
  }

  onSubmit(data) {
    this.flagstockdata = true;
    if (this.OutletPartyId) {
      const dataUrl = this.ApiURL + "/getoutletrangewiseallstockts/" + data.rangestartdate + "/" +  data.rangeenddate +  "/" +  this.OutletPartyId;
      this.dtOptions = {
        ajax: dataUrl,
        columns: [{
          title: 'SeriesName',
          data: 'SeriesName'
        }, {
          title: 'Sub-Cat',
          data: 'Subcategory'
        }, {
          title: 'Cat',
          data: 'Title'
        },
        {
          title: 'Art No.',
          data: 'ArticleNumber',
        },
        {
          title: 'Opening',
          data: 'OpeningStock'
        },
        {
          title: 'Imported',
          data: 'TransportOutwardpacks'
        },
        {
          title: 'Inw. Qty',
          data: 'totalPurchase'
        },
        {
          title: 'Sales Return',
          data: 'totalSalesReturn'
        },
        {
          title: 'Total Inward',
          data: 'totalInward'
        },
        {
          title: 'Purchase Return',
          data: 'totalPurchaseReturn',
          // class: 'none'
        },
        {
          title: 'Total Outward Qty',
          data: 'totalOutward',
          //  class: 'none'
        }, {
          title: 'Closing',
          data: 'closing',
          // class: 'none'
        },
        {
          title : "Received Date",
          data : 'ReceivedDate'
        }
        ],
        //dom: 'Bfrtip',
        dom: "lBfrtip",
        // Configure the buttons
        buttons: [
          { extend: 'copy', className: 'reportbutton', title: 'Colorhunt ' + data.rangestartdate + ' To ' + data.rangeenddate },
          { extend: 'print', className: 'reportbutton', title: 'Colorhunt ' + data.rangestartdate + ' To ' + data.rangeenddate },
          { extend: 'excel', className: 'reportbutton', title: 'Colorhunt ' + data.rangestartdate + ' To ' + data.rangeenddate }
        ],
        // Use this attribute to enable the responsive extension
        //className: 'table-button button btn btn-success',
        //responsive: true,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        // dom: '<"bottom"flp><"clear"><"top"i>rt'
        //info: true,
      };
    }
    else {
      const dataUrl = this.ApiURL + "/getsrangewiseallstocks/" + data.rangestartdate + "/" + data.rangeenddate;
      this.dtOptions = {
        ajax: dataUrl,
        columns: [{
          title: 'Series',
          data: 'Series'
        }, {
          title: 'Sub-Cat',
          data: 'Name'
        }, {
          title: 'Cat',
          data: 'Title'
        },
        {
          title: 'Art No.',
          data: 'ArticleNumber'
        },
        {
          title: 'Opening',
          data: 'openStock'
        },
        {
          title: 'Inw. Qty',
          data: 'inwardStock'
        },
        {
          title: 'Sales Return',
          data: 'salesReturnStock'
        },
        {
          title: 'Prodction Stock',
          data: 'proStock'
        },
        {
          title: 'Total Inward',
          data: 'totalInwardStock'
        },
        {
          title: 'Dom. Out Qty',
          data: 'domesticOutwardStock'
          // class: 'none'
        },
        {
          title: 'Exp. Out Qty',
          data: 'exportOutwardStock'
          // class: 'none'
        },
        {
          title: 'Purchase Return',
          data: 'purchaseReturnStock'
          // class: 'none'
        },
        {
          title: 'Consumed Stock',
          data: 'consStock'
          //  class: 'none'
        },
        {
          title: 'Shortage',
          data: 'shortageStock'
          //  class: 'none'
        },
        {
          title: 'Total Outward. Qty',
          data: 'totalOutwardStock'
          // class: 'none'
        },
        {
          title: 'Closing',
          data: 'closeStock'
          // class: 'none'
        },{
          title : "Inward Date",
          data : 'InwardDate'
        }
        ],
        //dom: 'Bfrtip',
        dom: "lBfrtip",
        // Configure the buttons
        buttons: [
          { extend: 'copy', className: 'reportbutton', title: 'Colorhunt ' + data.rangestartdate + ' To ' + data.rangeenddate },
          { extend: 'print', className: 'reportbutton', title: 'Colorhunt ' + data.rangestartdate + ' To ' + data.rangeenddate },
          { extend: 'excel', className: 'reportbutton', title: 'Colorhunt ' + data.rangestartdate + ' To ' + data.rangeenddate }
        ],
        // Use this attribute to enable the responsive extension
        //className: 'table-button button btn btn-success',
        //responsive: true,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        // dom: '<"bottom"flp><"clear"><"top"i>rt'
        //info: true,
      };
    }
  }
  changeOutlet(id){
    if(id == 0){
      this.OutletPartyId = null;
    }
    else{
      this.OutletPartyId = id;
    }
  }
  ngOnInit(): void {
    // let item = JSON.parse(localStorage.getItem("userdata"));
    // if (item[0].Role == 2 || item[0].Role == 4) {
    //   this.accessdenied = false;
    // } else {
    //   this.accessdenied = true;
    // }
    this.OutletPartyId = null
    this.userService.outletpartylist().subscribe((res) => {
      console.log('res',res)
      this.Outlet = this.partydropdown.Name;
      this.Outlet = res["Name"];
      this.partydropdown = res;
      
      // console.log('this.partydropdown', this.partydropdown)
    });

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

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        
        if (data[i].PageId == 43) {
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
        if (data[i].PageId == 43) {
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

  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if ($('.dataTables_empty').length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });
  }

}


import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';


class Person {
  ArticleNumber: string;
  Id: number;
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
  selector: 'app-launchreport',
  templateUrl: './launchreport.component.html',
  styleUrls: ['./launchreport.component.scss']
})
export class LaunchreportComponent implements OnInit {

  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  Outletpermissions: boolean = false;
  AllReportpermissions: boolean = false;

  cgetsallstocks: any;
  public allstocksist: Person[];
  ApiURL: string = environment.apiURL;
  public startnumber: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  accessdenied: boolean = false;
  constructor(private userService: UserService, public router: Router, private spinner: NgxSpinnerService, private http: HttpClient,private titleService: Title) {
    this.titleService.setTitle("Launch Report List | Colorhunt");
  }


  ngOnInit(): void {
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

    const dataUrl = this.ApiURL + "/getslaunchreport";

      this.dtOptions = {
        ajax: dataUrl,
        columns: [ 
          {
            title: 'No.',
            data: 'SerialNo'
          },
          {
            title: 'Article No',
            data: 'ArticleNumber'
          }, 
          {
            title: 'Rate',
            data: 'ArticleRate'
          },{
            title: 'Category',
            data: 'CategoryName'
          },
          {
            title: 'Brand',
            data: 'BrandName',
          },
          {
            title: 'Colorwise Oty',
            data: 'SalesNoPacks'
          },
          {
            title: 'Total Qty',
            data: 'TotalPieces'
          },
          // {
          //   title: 'Total Qty',
          //   data: 'SalesNoPacks',
          // },
          {
            title: 'Inward Date',
            data: 'InwardDate',
            // class: 'none'
          },
          {
            title: 'Launch Date',
            data: 'LaunchDate',
            // class: 'none'
          }

        ],
        //dom: 'Bfrtip',
        dom: "lBfrtip",
        // Configure the buttons
        buttons: [
          { extend: 'copy', className: 'reportbutton' },
          { extend: 'print', className: 'reportbutton' },
          { extend: 'excel', className: 'reportbutton' }
        ],
        // Use this attribute to enable the responsive extension
        //className: 'table-button button btn btn-success',
        responsive: true,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
       // dom: '<"bottom"flp><"clear"><"top"i>rt'
        //info: true,
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
        
        if (data[i].PageId == 44) {
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
        if (data[i].PageId == 44) {
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

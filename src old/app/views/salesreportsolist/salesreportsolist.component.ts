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
import { Title } from '@angular/platform-browser';

class Person {
  Id: number;
  SoNumber:string;
  Name: string;
  TotalSoPieces: string;
  SoDate: string;
  Destination: string;
  Transporter:string;
  OWID:number;
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
  selector: 'app-salesreportsolist',
  templateUrl: './salesreportsolist.component.html',
  styleUrls: ['./salesreportsolist.component.scss']
})
export class SalesreportsolistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public solist:  Person[];
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
  constructor(private userService: UserService, public router: Router,private toastr: ToastrService, private spinner: NgxSpinnerService,private http: HttpClient,private titleService: Title) {

    this.titleService.setTitle("Sales Order List | Colorhunt");
  }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 10);

    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights,1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res,2);
      });
    }

    if (this.accessdenied == false) {

      this.isList = 1;
      this.getSo();

    }else{
      this.spinner.hide();
    }
  }


  public getSo() {
    //reportpostsolist
    let userdata =  JSON.parse(localStorage.getItem('logindata'));

    const that = this;
    this.dtOptions = {
      serverSide: true,
      processing: true,
      columnDefs: [{
        "targets": 'no-sort',
        "orderable": false,
      }], "order": [[1,"asc"]],
      ajax: (dataTablesParameters: any, callback) => {
       let  ParentObj = { dataTablesParameters: dataTablesParameters , UserID:userdata[0].Id }

        that.http.post<DataTablesResponse>(
            this.ApiURL+"/reportpostsolist",
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
      columns: [{ data: 'No' }, { data: 'SoNumber' },{data:'Name'},{data:'TotalSoPieces'}, {data:'SoDate'},{data:'Destination'},{data:'Transporter'},{ data: 'Action' }]
    };
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
        if (data[i].PageId == 17 ||  data[i].PageId == 7) {
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
        if (data[i].PageId == 17 ||  data[i].PageId == 7) {
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

  public printsochallan(id) {
    this.router.navigate(['sochallan', { SONO: id,Back:2 }])
  }

}


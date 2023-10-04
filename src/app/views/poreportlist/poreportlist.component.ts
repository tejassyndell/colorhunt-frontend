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
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

class Person {
  Id: number;
  PurchaseNumber: string;
  FinancialYear:string;
  ArticleNumber:string;;
  Name:string;
  Title:number;
  NumPacks: number;
  WorkStatusName: string;
  InwardArticleId:string;
  POId:string;
  ArticleId:string;
  startnumber:number;
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
  selector: 'app-poreportlist',
  templateUrl: './poreportlist.component.html',
  styleUrls: ['./poreportlist.component.scss']
})
export class PoreportlistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public polist: Person[];
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
    this.titleService.setTitle("PO Report | Colorhunt");
  }

  ngOnInit() {
    setTimeout(() => this.spinner.show(), 25);

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

      setTimeout(() => this.spinner.show(), 25);

      this.isList = 1;
      this.getPo();

    }else{
      this.spinner.hide();
    }
  }


  public getPo() {
    const that = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        columnDefs: [{
          "targets": 'no-sort',
          "orderable": false,
        }], "order": [[2,"desc"]],

        ajax: (dataTablesParameters: any, callback) => {
          that.http.post<DataTablesResponse>(
              this.ApiURL+"/reportpostpolist",
              dataTablesParameters, {}
            ).subscribe(resp => {
              that.polist = resp.data;
              that.startnumber = resp.startnumber;
              this.spinner.hide();
              callback({

                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
        },
        columns: [{ data: 'No' }, {data: "PoDate"},  { data: 'PurchaseNumber' },  { data: 'Name' },{ data: 'TotalPieces' },{ data: 'Action' }]
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
  
  printpochallan(PO){
    this.router.navigate(['pochallan', { PO: PO,Back:1}])
  }
}

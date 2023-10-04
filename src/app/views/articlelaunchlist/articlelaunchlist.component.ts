import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

class Person {
  Id: number;
  Name: string;
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
  selector: 'app-articlelaunchlist',
  templateUrl: './articlelaunchlist.component.html',
  styleUrls: ['./articlelaunchlist.component.scss']
})
export class ArticlelaunchlistComponent implements OnInit {

  ApiURL: string = environment.apiURL;
  public articlelist: Person[];
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
  showArticleLogs: boolean = false;
  ArticleLogsData: any;
  UserRole: any;
  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService,private http: HttpClient ,private titleService: Title) {
    this.titleService.setTitle("Article Launch List | Colorhunt");
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
       setTimeout(() => this.spinner.show(), 25);
       this.getArticleList();

    }else{
      this.spinner.hide();
    }


  }

  public getArticleList() {
    const that = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        columnDefs: [{
          "targets": 'no-sort',
          "orderable": false,
        }], "order": [[1,"desc"]],
        ajax: (dataTablesParameters: any, callback) => {
          that.http.post<DataTablesResponse>(
              this.ApiURL+"/articlelaunchlist",
              dataTablesParameters, {}
            ).subscribe(resp => {
              that.articlelist = resp.data;
              that.startnumber = resp.startnumber;
              this.spinner.hide();
              callback({

                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
        },
        columns: [{ data: 'No' }, { data: 'ArticleNumber' }, { data: 'ArticleRate' }, { data: 'CategoryName' }, { data: 'SubCategory' }, { data: 'Series' },  { data: 'LaunchDate' }, { data: 'Action' }]
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
        if (data[i].PageId == 39) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = false;
          }
          this.isList = data[i].ListRights;
          this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = false;
        }

      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 39) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = false;
          }
          this.isList = data[i].ListRights;
          this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = false;
        }

      }

    }
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
        this.userService.deletelaunchedarticle(id , item[0].Id).subscribe((res) => {
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
    console.log('testest',id);
    this.router.navigate(['articlelaunchedit', { id: id }])
  }

  success(data) {
    if (data.id != "") {
      this.toastr.success('Success', 'Article Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }
  public viewlogs(id) {
    this.showArticleLogs = true;
    this.userService.articlelaunchlogs(id).subscribe((res) => {
      this.ArticleLogsData = res;
    });
  }
  goBack (){
    this.showArticleLogs = false;
  }


}





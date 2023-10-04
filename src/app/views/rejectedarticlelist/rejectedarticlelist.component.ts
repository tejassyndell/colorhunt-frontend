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
  selector: 'app-rejectedarticlelist',
  templateUrl: './rejectedarticlelist.component.html',
  styleUrls: ['./rejectedarticlelist.component.scss']
})
export class RejectedarticlelistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public colorlist: Person[];
  public rejectedarticle: any = [];
  public startnumber:  any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  UserRole: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  showRejectedArticleLogs: boolean = false;
  RejectedArticleLogsData: any;
  accessdenied: boolean = true;
  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService,private http: HttpClient,private titleService: Title) {
    this.titleService.setTitle("Rejected Article List | Colorhunt");
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
       this.getColor();

    }else{
      this.spinner.hide();
    }


  }

  public getColor() {
    this.userService.rejectedproductlist().subscribe((res) => {
      const data = res;

      // this.dtOptions = {
      // columnDefs: [{
      //   "targets": 'no-sort',
      //   "orderable": true,
      // }], "order": [[1,"asc"]]}

      if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.rejectedarticle = data;
            // Call the dtTrigger to rerender again
            this.dtTrigger.complete();
            this.spinner.hide();
          });
      } else {
        setTimeout(() => {
          this.rejectedarticle = data;
          this.dtTrigger.complete();
          this.spinner.hide();
        }, 100);

      }

    });
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
        if (data[i].PageId == 28) {
          if (data[i].AddRights == 1) {
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
        if (data[i].PageId == 28) {
          if (data[i].AddRights == 1) {
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

  public delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {
        this.userService.deletecolor(id).subscribe((res) => {
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
    this.router.navigate(['articlecolor', { id: id }])
  }
  public viewlogs(id) {
    this.showRejectedArticleLogs = true;
    this.userService.rejectedarticlelogs(id).subscribe((res) => {
      this.RejectedArticleLogsData = res;
    });
  }
  CloseLogs() {
    this.showRejectedArticleLogs = false;
  }
  success(data) {
    if (data.id != "") {
      this.toastr.success('Success', 'Article Color Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }


}


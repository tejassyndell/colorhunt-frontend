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
  Description: string;
  startnumber:number;
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
  selector: 'app-beanerlist',
  templateUrl: './beanerlist.component.html',
  styleUrls: ['./beanerlist.component.scss']
})
export class  BeanerlistComponent  implements OnInit {
  ApiURL: string = environment.apiURL;
  public beanerlist: Person[];
  public startnumber:  any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  BaseURL: any;
  isList: any;
  accessdenied: boolean = true;
  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient,private titleService: Title) {
    this.titleService.setTitle("Beaner List | Colorhunt");
  }

  ngOnInit() {
    this.BaseURL = environment.UploadBaseURL;
    let item = JSON.parse(localStorage.getItem('userdata'));
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
       this.getdata();


    } else {
      this.spinner.hide();
    }
  }

 

  public getBrand() {
    if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        this.getdata();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
        this.spinner.hide();
      });
    } else {
      setTimeout(() => {
        this.getdata();
        this.dtTrigger.next();
        this.spinner.hide();
      }, 100);

    }
  }

  public getdata() {
    
    const that = this;
    this.dtOptions = {
      serverSide: true,
      processing: true,
      columnDefs: [{
        "targets": 'no-sort',
        "orderable": false,
      }], "order": [[1, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(
          this.ApiURL + "/beanerpostlist",
          dataTablesParameters, {}
        ).subscribe(resp => {
          that.beanerlist = resp.data;
          console.log(' that.beanerlist', resp.data);
          that.startnumber = resp.startnumber;
          this.spinner.hide();
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [{ data: 'No' }, { data: 'Name' }, { data: 'Action' }]
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
        if (data[i].PageId == 15) {
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
        if (data[i].PageId == 15) {
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
        this.userService.deleteBeaner(id).subscribe((res) => {
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
    this.router.navigate(['beaner', { id: id }])
  }

  success(data) {
    if (data.id != "") {
      this.toastr.success('Success', 'Transportation Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }


}

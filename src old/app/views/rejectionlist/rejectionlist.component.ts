import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rejectionlist',
  templateUrl: './rejectionlist.component.html',
  styleUrls: ['./rejectionlist.component.scss']
})
export class RejectionlistComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject <any> = new Subject();
  dtOptions: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  public rejectionlist: any = [];
  accessdenied: boolean = true;
  constructor(private userService: UserService,private toastr: ToastrService,private router: Router,  private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Rejection Type List | Colorhunt");
  }

  ngOnInit() {

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
      this.dtOptions = {
        pagingType: 'numbers',
        pageLength: 25,
      };
      this.isList= 1;
      this.getRection();

    }else{
      this.spinner.hide();
    }
  }

  public getRection() {
    this.userService.rejectionlist().subscribe((res) => {
      const data = res;
      if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.rejectionlist = data;
            this.dtTrigger.complete();
            this.spinner.hide();
          });
      } else {
        setTimeout(() => {
          this.rejectionlist = data;
          this.dtTrigger.complete();
          this.spinner.hide();
        }, 100);

      }

    });
  }


  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 16) {
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
        if (data[i].PageId == 16) {
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
  public edit(id) {
    this.router.navigate(['rejection', { id: id }])
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
        this.userService.deleterejection(id).subscribe((res) => {
          this.getRection();
          this.success(res);
        });
      } else {

      }
    });
  }

  success(data) {
    if (data.id != "") {
      this.toastr.success('Success', 'Rejection Type Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
}


}

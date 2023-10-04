import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {
  public userlist: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  lId: any;
  lRoleId:any;

  accessdenied: boolean = true;
  constructor(private userService: UserService, public router: Router, private toastr: ToastrService ,private titleService: Title) {
    this.titleService.setTitle("User List | Colorhunt");
  }

  ngOnInit() {

    let ldata = JSON.parse(localStorage.getItem('logindata'));
    this.lId = ldata[0].Id;
    this.lRoleId = ldata[0].Role;
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
      this.dtOptions = {
        pagingType: 'numbers',
        pageLength: 25
      };
      this.isList = 1;
      this.getUser();
    }else{
    }
  }


  public getUser() {
    this.userService.getAllUsers().subscribe((res) => {
      const data = res;
      if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          this.userlist = data;
          // Call the dtTrigger to rerender again
        });
      } else {
        setTimeout(() => {
          this.userlist = data;
        }, 100);

      }

    });
  }


  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 1) {
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
        if (data[i].PageId == 1) {
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
    let loggeduser = JSON.parse(localStorage.getItem('userdata'));
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {
        this.userService.deleteuser(id , loggeduser[0].Id).subscribe((res) => {
          this.getUser();
          this.success(res);
        });
      } else {

      }
    });
  }

  public edit(id) {
    this.router.navigate(['users', { id: id }])

  }

  public changeUserStatus(id) {
    let loggeduser = JSON.parse(localStorage.getItem('userdata'));
    if(loggeduser[0].Role == 2){
      let item = JSON.parse(localStorage.getItem('userdata'));
      if (id == item[0].Id) {
        this.toastr.info('', `You cannot change your own status`);
      }
      else{
        this.userService.updateuserstatus(id , loggeduser[0].Id).subscribe((res) => {
          if(res['status'] === 'Active'){
            this.toastr.success('Activated', `${res['User'].Name}'s account is active now`);
          }else{
            this.toastr.error('Deactivated', `${res['User'].Name}'s account is deactive now`);
          }
        });
      }
    }
    else{
      this.toastr.error('Error', 'You do not have right to perform this action');
    }
  }

  success(data) {
    if (data.id != "") {
      this.toastr.success('Success', 'User Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  public view(id) {
    this.router.navigate(['userview', { id: id }])
  }



}

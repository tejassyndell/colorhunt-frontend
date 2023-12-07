import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-userrolelist',
  templateUrl: './userrolelist.component.html',
  styleUrls: ['./userrolelist.component.scss']
})
export class UserrolelistComponent implements OnInit {
  public userrolelist: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject <any> = new Subject();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  accessdenied: boolean = true;
  constructor(private userService: UserService, public router: Router,private toastr: ToastrService,private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("User Role List | Colorhunt");
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
      this.getUserrole();
      
    }else{
      this.spinner.hide();
    }
  }

  
  public getUserrole() {    
    this.userService.userrolelist().subscribe((res) => {
      const data = res;
      if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.userrolelist = data;
            // Call the dtTrigger to rerender again
            this.dtTrigger.complete();
            this.spinner.hide();
          });
      } else {
        setTimeout(() => {
          this.userrolelist = data;
          this.dtTrigger;
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
        if (data[i].PageId == 35) {
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
        if (data[i].PageId == 35) {
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
        this.userService.deleteuserrole(id).subscribe((res) => {
          if (res == "allreadyassign") {
            this.toastr.error('Failed', 'This role is already use');
          } else{
            this.getUserrole();
            this.success(res);
          }
         

        });
      } else {

      }
    });
  }

  public edit(id) {
    this.router.navigate(['userrole', { id: id }])
  }
  
 success(data) {
    if (data.id != "") {
      this.toastr.success('Success', 'Rack Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
}

}


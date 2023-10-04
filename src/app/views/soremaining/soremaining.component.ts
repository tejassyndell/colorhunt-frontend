import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-soremaining',
  templateUrl: './soremaining.component.html',
  styleUrls: ['./soremaining.component.scss']
})
export class SoremainingComponent implements OnInit {
  public soremaining: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  accessdenied: boolean = true;
  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Sales remaining Inward | Colorhunt");
  }

  ngOnInit() {
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
      this.dtOptions = {
        pagingType: 'numbers',
        pageLength: 25,
      };
      this.isList = 1;
      this.soremainingfun();
    } else {
      this.spinner.hide();
    }
  }

  rightscheck(data, no) {
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 38) {
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
        if (data[i].PageId == 38) {
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

  soremainingfun() {
    this.spinner.show();
    this.userService.soremaining().subscribe((res) => {
      const data = res;
      if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          if (data['status'] == 'success') {
            this.soremaining = data['soRemaning'];
          }
          else {
            this.soremaining = [];
          }
          this.dtTrigger.complete();
          this.spinner.hide();
        });
      } else {
        setTimeout(() => {
          if (data['status'] == 'success') {
            this.soremaining = data['soRemaning'];
          }
          else {
            this.soremaining = [];
          }
          this.dtTrigger.complete();
          this.spinner.hide();
        }, 100);

      }

    });
  }
  fixSalesRemaining(inwardid , newsalespacks){
    this.userService.fixsoremaining(inwardid ,newsalespacks).subscribe((res) => {
      this.dtOptions = {
        pagingType: 'numbers',
        pageLength: 25,
      };
      this.isList = 1;  
      this.soremainingfun();
      this.toastr.success('Success', 'Record fixed successfully');
    });
  }

  fixSoRemainByOnce(){
    this.spinner.show();
    this.userService.fixsoremainingbyonce().subscribe((res) => {
      this.spinner.hide();
      this.dtOptions = {
        pagingType: 'numbers',
        pageLength: 25,
      };
      this.isList = 1;
      this.soremainingfun();
      this.toastr.success('Success', 'Record fixed successfully');
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  goback() {
    window.history.back();
  }

}

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
  selector: 'app-outwardsoremaining',
  templateUrl: './outwardsoremaining.component.html',
  styleUrls: ['./outwardsoremaining.component.scss']
})
export class OutwardsoremainingComponent implements OnInit {
  public outwardsalesremaining: any = [];
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
    this.titleService.setTitle("Outward sales remaining | Colorhunt");
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
      this.outwardsoremaining();
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


  outwardsoremaining() {
    this.spinner.show();
    this.userService.outwardsoremaining().subscribe((res) => {
      const data = res;
      if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          if (data['status'] == 'success') {
            this.outwardsalesremaining = data['outwardSalesRemaning'];
          }
          else {
            this.outwardsalesremaining = [];
          }
          this.dtTrigger.complete();
          this.spinner.hide();
        });
      } else {
        setTimeout(() => {
          if (data['status'] == 'success') {
            this.outwardsalesremaining = data['outwardSalesRemaning'];
          }
          else {
            this.outwardsalesremaining = [];
          }
          this.dtTrigger.complete();
          this.spinner.hide();
        }, 100);

      }

    });
  }

  fixOutwardSalesRemaining(soid ,OutwardNoPacksActual){
    this.userService.fixoutwardsalesremaining(soid , OutwardNoPacksActual).subscribe((res) => {
      this.dtOptions = {
        pagingType: 'numbers',
        pageLength: 25,
      };
      this.isList = 1;
      this.outwardsoremaining();
      this.toastr.success('Success', 'Record fixed successfully');
    });
  }

  fixOutwardSoRemainByOnce(){
    this.spinner.show();
    this.userService.fixoutwardsalesremainingbyonce().subscribe((res) => {
      this.spinner.hide();
      this.dtOptions = {
        pagingType: 'numbers',
        pageLength: 25,
      };
      this.isList = 1;
      this.outwardsoremaining();
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

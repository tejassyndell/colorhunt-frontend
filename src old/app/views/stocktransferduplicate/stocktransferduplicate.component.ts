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
  selector: 'app-stocktransferduplicate',
  templateUrl: './stocktransferduplicate.component.html',
  styleUrls: ['./stocktransferduplicate.component.scss']
})
export class StocktransferduplicateComponent implements OnInit {
  public stocktraduplist: any = [];
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
    this.titleService.setTitle("Stock Transfer Duplication List | Colorhunt");
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
      this.checkstocktransferduplication();

    } else {
      this.spinner.hide();
    }


  }




  checkstocktransferduplication() {

    this.spinner.show();
    this.userService.checkstocktransferduplication().subscribe((res) => {
      const data = res;
      if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();

          if (data['status'] == 'success') {
            this.stocktraduplist = data['stockTransferDuplications'];
          }
          else {
            this.stocktraduplist = [];
          }
          this.dtOptions = {
            pagingType: 'numbers',
            pageLength: 25,
          };
          this.dtTrigger.complete();

          this.spinner.hide();
        });
      } else {
        setTimeout(() => {
          if (data['status'] == 'success') {
            this.stocktraduplist = data['stockTransferDuplications'];
          }
          else {
            this.stocktraduplist = [];
          }
          this.dtTrigger.complete();
          this.spinner.hide();
        }, 100);

      }

    });
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

  deletestocktransferduplication(stocktransfernumberid, consumedarticleid , transferarticleid) {


    Swal.fire({
      title: 'Are you sure?',
      // text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {
        this.userService.deletestocktransferduplication(stocktransfernumberid, consumedarticleid , transferarticleid).subscribe((res) => {
          // if(res['status'] == 'success'){

          // this.checkSoduplication();
          this.dtOptions = {
            pagingType: 'numbers',
            pageLength: 25,
          };
          this.isList = 1;
          this.checkstocktransferduplication();
          // this.userService.checksoduplication().subscribe((res) => {
          //   if (res['status'] == 'success') {
          //     this.soduplist = res['soDuplication'];
          //   }
          //   else {
          //     this.soduplist = [];
          //   }
          // });
          this.toastr.success('Success', 'Duplicate records deleted successfully');
          // }
        });

      } else {

      }
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







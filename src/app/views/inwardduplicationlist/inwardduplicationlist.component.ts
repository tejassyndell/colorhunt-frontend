import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Subject } from "rxjs";
import { RouterModule, Routes, Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-inwardduplicationlist",
  templateUrl: "./inwardduplicationlist.component.html",
  styleUrls: ["./inwardduplicationlist.component.scss"],
})
export class InwardduplicationlistComponent implements OnInit {
  public inwardduplist: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  accessdenied: boolean = true;

  constructor(
    private userService: UserService,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Inward Duplication List | Colorhunt");
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem("userdata"));
    let rolerights = JSON.parse(localStorage.getItem("roleright"));
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
        pagingType: "numbers",
        pageLength: 25,
      };
      this.isList = 1;
      this.checkInwardduplication();
    } else {
      this.spinner.hide();
    }
  }
  checkInwardduplication() {
    this.spinner.show();
    this.userService.checkinwardduplication().subscribe((res) => {
      console.log('res', res)
      const data = res;
      if (
        typeof this.dtElement !== "undefined" &&
        typeof this.dtElement.dtInstance !== "undefined"
      ) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          if (data["status"] == "success") {
            this.inwardduplist = data["inwardDuplication"];
          } else {
            this.inwardduplist = [];
          }
          this.dtOptions = {
            pagingType: "numbers",
            pageLength: 25,
          };
          this.dtTrigger.complete();

          this.spinner.hide();
        });
      } else {
        setTimeout(() => {
          if (data["status"] == "success") {
            this.inwardduplist = data["inwardDuplication"];
          } else {
            this.inwardduplist = [];
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

  deleteinwardduplication(GRNId, articleid) {
    Swal.fire({
      title: "Are you sure?",
      // text: 'You will not be able to recover this data!',
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value == true) {
        this.userService
          .deleteinwardduplication(GRNId, articleid)
          .subscribe((res) => {
            this.dtOptions = {
              pagingType: "numbers",
              pageLength: 25,
            };
            this.isList = 1;
            this.checkInwardduplication();

            this.toastr.success(
              "Success",
              "Duplicate records deleted successfully"
            );
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

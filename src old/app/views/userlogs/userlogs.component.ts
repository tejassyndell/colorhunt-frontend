import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { RouterModule, Routes, Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-userlogs",
  templateUrl: "./userlogs.component.html",
  styleUrls: ["./userlogs.component.scss"],
})
export class UserlogsComponent implements OnInit {
  accessdenied: boolean = true;
  showSelection :boolean = false ; 
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  userLogRecord: any = [];
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private titleService: Title
  ) {
    this.titleService.setTitle("User Logs | Colorhunt");
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
      this.dtOptions = {
        pagingType: "numbers",
        pageLength: 10,
      };
      let id;
      let value;
      if(this.route.snapshot.paramMap.get("id")){
        id=this.route.snapshot.paramMap.get("id")
        value = null;
      }
      else{
        id=0;
        this.showSelection = true;
        value = document.getElementById('selection');
      }
      this.getUsersLogs(id ,value);
    }
  }

  getUsersLogs(id , value) {
    this.spinner.show();
    // let id = this.route.snapshot.paramMap.get("id");
    this.dtOptions = {
      pagingType: "numbers",
      pageLength: 10,
    };
    this.userService.userlogs(id, value).subscribe((res) => {
      console.log('res', res);
      // this.userlogs = data;
      const data = res;
      if (
        typeof this.dtElement !== "undefined" &&
        typeof this.dtElement.dtInstance !== "undefined"
      ) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          this.userLogRecord = data;
          
          // this.userlist = data;
          // Call the dtTrigger to rerender again
          this.dtTrigger.complete();
        });
      } else {
        // setTimeout(() => {
        this.userLogRecord = data;
        this.dtTrigger.complete();
        // }, 100);
      }
      console.log('data', data);
      this.spinner.hide();
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  onChange(value) {
    // console.log('LogsValue', value)
    // if (value == "user") {
    // } else if (value == "article") {

    // } else if (value == "po") {
    // } else if (value == "inward") {
    // } else if (value == "so") {
    // } else if (value == "outward") {
    // } else if (value == "pr") {
    // } else if (value == "sr") {
    // } else if (value == "st") {
    // }
    let id = 0;
    this.getUsersLogs(id , value)
  }
  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem("userdata"));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 1) {
          let parameterId = this.route.snapshot.paramMap.get("id");
          if (data[i].AddRights == 1 || data[i].EditRights == 1) {
            if (parameterId == null && data[i].AddRights == 1) {
              this.accessdenied = false;
            } else {
              if (parameterId != null && data[i].EditRights == 1) {
                this.accessdenied = false;
              } else {
                this.accessdenied = true;
              }
            }
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
          let parameterId = this.route.snapshot.paramMap.get("id");
          if (data[i].AddRights == 1 || data[i].EditRights == 1) {
            if (parameterId == null && data[i].AddRights == 1) {
              this.accessdenied = false;
            } else {
              if (parameterId != null && data[i].EditRights == 1) {
                this.accessdenied = false;
              } else {
                this.accessdenied = true;
              }
            }
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
  // success(data) {
  //   if (data["status"] == "success") {
  //     this.toastr.success("Success", "User Deleted Successfully");
  //     this.getUsersLogs();
  //   } else {
  //     this.toastr.error("Failed", "Please try agin later");
  //   }
  // }
}

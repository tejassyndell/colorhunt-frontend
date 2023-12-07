import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { RouterModule, Routes, Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-userview",
  templateUrl: "./userview.component.html",
  styleUrls: ["./userview.component.scss"],
})
export class UserviewComponent implements OnInit {
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  userRecord: any = [];
  constructor(
    private userService: UserService,
    public router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private titleService: Title
  ) {
    this.titleService.setTitle("User View | Colorhunt");
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
      let id = this.route.snapshot.paramMap.get('id');
      this.spinner.show();
      this.userService.viewuser(id).subscribe((res) => {
        this.userRecord = res
        this.spinner.hide();
        // this.success(res);
      });
    }
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

  public goToUserLogs (id){
    this.router.navigate(['userlogs', { id: id }])
  }
}

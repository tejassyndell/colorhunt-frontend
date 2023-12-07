import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-workorder',
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.scss']
})
export class WorkorderComponent implements OnInit {
  public editarray = {};
  workstatusForm: FormGroup;
  COLORPAGE: any;
  errorexit: string = "";

  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
      this.titleService.setTitle("Work Order | Colorhunt");
      this.workstatusForm = this.formBuilder.group({
      Name: ['', [Validators.required]]
    });
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
      this.COLORPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.paramMap.get('id')) {
        this.COLORPAGE = "Edit";
        this.userService.getworkorderstatusidwise(data).subscribe((res) => {
          if (Array.isArray(res) && res.length !== 0) {

            this.editarray = {
              Name: res[0].Name,
            }
            this.workstatusForm.patchValue(this.editarray);
          }
        });
      }
    }

  }
  doarticalcoloradd() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Name: this.workstatusForm.value.Name
      }

      this.userService.updateWorkorderstatus(editobject).subscribe(
        userdata => {
          this.spinner.hide();
          document.getElementById('submit-button').removeAttribute('disabled');
          this.successupdate(userdata);
        }
      );
    } else {

      this.userService.doworkorderstatusadd(this.workstatusForm.value).subscribe(
        userdata => {
          this.spinner.hide();
          document.getElementById('submit-button').removeAttribute('disabled');
          if (userdata == "allreadyexits") {
            this.errorexit = "Article color already exists";
          } else {
            this.errorexit = "";
            this.success(userdata);
          }
        }
      );
    }

  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));

    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 20) {
          let parameterId = this.route.snapshot.paramMap.get('id');
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
        if (data[i].PageId == 20) {
          let parameterId = this.route.snapshot.paramMap.get('id');
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

  // User Add success function
  success(data) {
    if (data.id != "") {
      this.router.navigate(['/workorderlist']);
      this.toastr.success('Success', 'Work Order Status Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdate(data) {
    if (data.id != "") {
      this.router.navigate(['/workorderlist']);
      this.toastr.success('Success', 'Work Order Status Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }
  goBack (){
    window.history.back();
  }
}

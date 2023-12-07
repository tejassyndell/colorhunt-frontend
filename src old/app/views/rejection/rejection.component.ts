import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rejection',
  templateUrl: './rejection.component.html',
  styleUrls: ['./rejection.component.scss']
})
export class RejectionComponent implements OnInit {
  public editarray = {};
  rejectionForm: FormGroup;
  REJPAGE: any;
  errorexit: string = "";
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService, private route: ActivatedRoute, private userService: UserService, private titleService: Title) {
    this.titleService.setTitle("Add Rejection Type | Colorhunt");
    this.rejectionForm = this.formBuilder.group({
      rejection: ['', [Validators.required]],
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
      this.REJPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (data != "" && data != undefined) {
        this.REJPAGE = "Edit";
        this.userService.getrejectidwise(data).subscribe((res) => {
          this.editarray = {
            rejection: res[0].RejectionType,
          }
          this.rejectionForm.patchValue(this.editarray);

        });
      }
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 16) {
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
        if (data[i].PageId == 16) {
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
  dorejectionadd() {
    document.getElementById('submit-button').setAttribute('disabled', 'true');
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        rejection: this.rejectionForm.value.rejection
      }
      this.userService.updateRejection(editobject).subscribe(
      userdata => {
        document.getElementById('submit-button').removeAttribute('disabled');
        this.spinner.hide();
        this.successupdated(userdata);
      }
      );
    } else {
      this.userService.dorejectionadd(this.rejectionForm.value).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.errorexit = "Rack already exists";
          } else {
            this.errorexit = "";
            this.success(userdata);
          }

        }
      );
    }

  }

  success(data) {
    if (data.id != "") {
      this.router.navigate(['/rejectionlist']);
      this.toastr.success('Success', 'Rejection Type Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdated(data) {
    if (data.id != "") {
      this.router.navigate(['/rejectionlist']);
      this.toastr.success('Success', 'Rejection Type Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack() {
    window.history.back();
  }
}

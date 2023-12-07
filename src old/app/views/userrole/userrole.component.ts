import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-userrole',
  templateUrl: './userrole.component.html',
  styleUrls: ['./userrole.component.scss']
})
export class UserroleComponent implements OnInit {
  public editarray = {};
  userroleForm: FormGroup;
  USERROLEPAGE: any;
  errorexit: string = "";
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("Add User Role | Colorhunt");
    this.userroleForm = this.formBuilder.group({
      Role: ['', [Validators.required]],
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
    this.USERROLEPAGE = "Add";
    let data = this.route.snapshot.paramMap.get('id');
    if (data != "" && data != undefined) {
      this.USERROLEPAGE = "Edit";
      this.userService.getuserroleidwise(data).subscribe((res) => {
        this.editarray = {
          Role: res[0].Role,
        }
        this.userroleForm.patchValue(this.editarray);

      });
    }
  }
  }
  // Initicate user add
  doexitscheck() {
    this.userService.doexitscheck(this.userroleForm.value.Role).subscribe(
      userdata => {
        if ( userdata != "") {
          this.errorexit = "User role name already exists";
          this.userroleForm.disable;
        } else {
          this.errorexit = "";
        }
      }
    );
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 35) {
          let parameterId = this.route.snapshot.paramMap.get('id');
          if(data[i].AddRights==1 || data[i].EditRights==1){
            if(parameterId==null && data[i].AddRights==1){
              this.accessdenied = false;
            }else{
              if(parameterId!=null && data[i].EditRights==1){
                this.accessdenied = false;
              }else{
                this.accessdenied = true;
              }
            }
          }else{
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
          let parameterId = this.route.snapshot.paramMap.get('id');
          if(data[i].AddRights==1 || data[i].EditRights==1){
            if(parameterId==null && data[i].AddRights==1){
              this.accessdenied = false;
            }else{
              if(parameterId!=null && data[i].EditRights==1){
                this.accessdenied = false;
              }else{
                this.accessdenied = true;
              }
            }
          }else{
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

  isUnique(control: FormGroup) {
    const q = new Promise((resolve, reject) => {
      this.userService.doexitscheck(control.value).subscribe(userdata => {
        if (userdata != "") {
          this.errorexit = "User role name already exists";
          resolve({ 'isEmailUnique': true });
        } else {
          this.errorexit = "";
          resolve(null);
        }
      }, () => {
        this.errorexit = "";
        this.errorexit = "User role name already exists";
        resolve({ 'isUnique': true });
      }
      );
    });
    return q;
  }

  public restrictNumeric(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
   }

  douserroleadd() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Role: this.userroleForm.value.Role

      }
      this.userService.updateuserrole(editobject).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          this.successupdated(userdata);
        }
      );
    } else {
      this.userService.douserroleadd(this.userroleForm.value).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.errorexit = "User role name already exists";
          } else {
            this.errorexit = "";
            this.success(userdata);
          }

        }
      );
    }

  }


  // User Add success function
  success(data) {
    if (data.id != "") {
      this.router.navigate(['/userrolelist']);
      this.toastr.success('Success', 'User role Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdated(data) {
    if (data.id != "") {
      this.router.navigate(['/userrolelist']);
      this.toastr.success('Success', 'User role Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack (){
    window.history.back();
  }

}


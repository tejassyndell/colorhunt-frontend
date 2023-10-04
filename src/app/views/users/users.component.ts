import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  PartyDropdownDisplay: Boolean = false;
  public roledropdown: any = [''];
  public partypdown: any = [];
  public editarray = {};

  accessdenied: boolean = true;
  userForms: FormGroup;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isReadonly: Boolean = false;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,private titleService: Title) {
      this.titleService.setTitle("Add User | Colorhunt");
    this.userForms = this.formBuilder.group({
      Role: ['', [Validators.required]],
      Name: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required, ValidationService.passwordValidator]],
      PartyId: [''],
      LoggedId: [' ']
    });



  }

  userEmailValidation(event){
    if(event.keyCode == 32){
			return false;
		 }else{
			return true;
		 }
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
      this.userService.getRole().subscribe((res) => {
        this.roledropdown = res;
      });


      this.userService.getoutletparty(0).subscribe((res) => {
        this.partypdown = res;
      });

      let data = this.route.snapshot.paramMap.get('id');
      if(data){
      this.userService.getuseridwise(data).subscribe((res) => {
        let PartyId = '';
        if (res != "") {
          if (res[0].Role == 7) {
            this.PartyDropdownDisplay = true;
            if (res[0].PartyId != 0) {
              PartyId = res[0].PartyId
            }
          } else {
            this.PartyDropdownDisplay = false;
          }

          this.isReadonly = true;
          this.editarray = {
            Role: res[0].Role,
            Name: res[0].Name,
            Email: res[0].Email,
            Password: res[0].Password,
            PartyId: PartyId
          }
          this.userForms.patchValue(this.editarray);
        }
      });
    }

    }
  }

  onChangRoles(event) {
    if (event.target.value != "") {
      this.spinner.show();
      if (event.target.value == 7) {
        this.PartyDropdownDisplay = true;
      } else {
        this.PartyDropdownDisplay = false;
      }
      this.spinner.hide();
    } else {
      this.PartyDropdownDisplay = false;
    }
  }
  // Initicate user add
  doUserAdd() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.userForms.patchValue({LoggedId: item[0].Id});
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Role: this.userForms.value.Role,
        Name: this.userForms.value.Name,
        Email: this.userForms.value.Email,
        Password: this.userForms.value.Password,
        PartyId: this.userForms.value.PartyId,
        LoggedId: this.userForms.value.LoggedId
      }
      this.userService.updateCustomer(editobject).subscribe(
        userdata => {
          let item = JSON.parse(localStorage.getItem('userdata'));
          if (editobject.id == item[0].Id) {
            localStorage.setItem('logindata', JSON.stringify([userdata['user']]));
            localStorage.setItem('userdata', JSON.stringify([userdata['user']]));
          }
          this.spinner.hide();
          this.successupdated(userdata);
          document.getElementById('submit-button').removeAttribute('disabled');
        }
      );
    } else {
      this.userService.doUserAdd(this.userForms.value).subscribe(
        userdata => {
          this.spinner.hide();

          this.success(userdata);
          document.getElementById('submit-button').removeAttribute('disabled');
        }
      );
    }

  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 1) {
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
        if (data[i].PageId == 1) {
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
    if (data.Result == "1") {
      this.router.navigate(['/userlist']);
      this.toastr.success('Success', 'User Add Successfully');
    } else if(data.Result=="2"){
      this.toastr.error('Failed', 'Email/User name all ready exists.');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }

  }

  successupdated(data) {
    if (data.id != "") {
      this.router.navigate(['/userlist']);
      this.toastr.success('Success', 'User Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }


  goBack (){
    window.history.back();
  }

}

import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  public editarray = {};
  brandForm: FormGroup;
  BRANDPAGE: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("Add Brand | Colorhunt");
    this.brandForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Description: ['']
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

      this.BRANDPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');

      if (this.route.snapshot.paramMap.get('id')) {
        this.BRANDPAGE = "Edit";
        this.userService.getbrandidwise(data).subscribe((res) => {
           if (res != "") {
            this.editarray = {
              Name: res[0].Name,
              Description: res[0].Description
            }
            this.brandForm.patchValue(this.editarray);
          }
        });
      }
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 15) {
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
        if (data[i].PageId == 15) {
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

  // Initicate user add
  dobrandadd() {
    this.spinner.show();
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Name: this.brandForm.value.Name,
        Description: this.brandForm.value.Description
      }
      this.userService.updateBrand(editobject).subscribe(
        userdata => {
          this.spinner.hide();
          document.getElementById('submit-button').removeAttribute('disabled');
          this.successupdated(userdata);
        }
      );
    } else {
      this.userService.dobrandadd(this.brandForm.value).subscribe(
        userdata => {
          this.spinner.hide();
          document.getElementById('submit-button').removeAttribute('disabled');
          this.success(userdata);
        }
      );
    }

  }


  // User Add success function
  success(data) {
    if (data.id != "") {
      this.router.navigate(['/brandlist']);
      this.toastr.success('Success', 'Brand Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdated(data) {
    if (data.id != "") {
      this.router.navigate(['/brandlist']);
      this.toastr.success('Success', 'Brand Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack (){
    window.history.back();
  }

}

import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  public editarray = {};
  vendorForm: FormGroup;
  VENDERPAGE: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("Add Vendor | Colorhunt");
    this.vendorForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      ContactPerson: ['', [Validators.required]],
      GSTNumber: ['', [Validators.required]]
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
      this.VENDERPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (data != "" && data != undefined) {
        this.VENDERPAGE = "Edit";
        this.userService.getvendoridwise(data).subscribe((res) => {
           if (res != "") {
            this.editarray = {
              Name: res[0].Name,
              Address: res[0].Address,
              PhoneNumber: res[0].PhoneNumber,
              ContactPerson: res[0].ContactPerson,
              GSTNumber: res[0].GSTNumber
            }
            this.vendorForm.patchValue(this.editarray);
          }
        });
      }

    }
  }
  // Initicate user add
  dovendorkadd() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Name: this.vendorForm.value.Name,
        Address: this.vendorForm.value.Address,
        PhoneNumber: this.vendorForm.value.PhoneNumber,
        ContactPerson: this.vendorForm.value.ContactPerson,
        GSTNumber: this.vendorForm.value.GSTNumber
      }

      this.userService.updateVendor(editobject).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          this.successupdated(userdata);
        }
      );
    } else {
      this.userService.dovendorkadd(this.vendorForm.value).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          this.success(userdata);
        }
      );
    }

  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 14) {
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
        if (data[i].PageId == 14) {
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

  // User Add success function
  success(data) {
    if (data.id != "") {
      this.router.navigate(['/vendorlist']);
      this.toastr.success('Success', 'Vendor Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdated(data) {
    if (data.id != "") {
      this.router.navigate(['/vendorlist']);
      this.toastr.success('Success', 'Vendor Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack (){
    window.history.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {
  public editarray = {};
  subcategoryForm: FormGroup;
  subcategoryPAGE: any;
  errorexit: string = "";
  accessdenied: boolean = true;
  public catedropdown: any = [];
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {

    this.titleService.setTitle("Add Subcategory | Colorhunt");
    this.subcategoryForm = this.formBuilder.group({
      CategoryId: ['', [Validators.required]],
      Name: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.userService.categorylist().subscribe((res) => {
      this.catedropdown = res;
    });

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
      this.subcategoryPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.paramMap.get('id')) {
        this.subcategoryPAGE = "Edit";
        this.userService.getsubcatidwise(data).subscribe((res) => {

           if (res != "") {
            this.editarray = {
              CategoryId: res[0].CategoryId,
              Name: res[0].Name,
            }
            this.subcategoryForm.patchValue(this.editarray);
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
        if (data[i].PageId == 29) {
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
        if (data[i].PageId == 29) {
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

  dosubcategoryadd() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Name: this.subcategoryForm.value.Name,
        CategoryId: this.subcategoryForm.value.CategoryId
      }
      this.userService.updateSubcategory(editobject).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          this.successupdate(userdata);
        }
      );
    } else {

      this.userService.dosubcategory(this.subcategoryForm.value).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.errorexit = "Subcategory already exists";
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
      this.router.navigate(['/subcategorylist']);
      this.toastr.success('Success', 'Subcategory Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdate(data) {
    if (data.id != "") {
      this.router.navigate(['/subcategorylist']);
      this.toastr.success('Success', 'Subcategory Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack (){
    window.history.back();
  }

}

import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-articlesize',
  templateUrl: './articlesize.component.html',
  styleUrls: ['./articlesize.component.scss']
})
export class ArticlesizeComponent implements OnInit {
  public editarray = {};
  SIZEPAGE: any;
  sizeForm: FormGroup;
  errorexit: string = "";
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("User List | Colorhunt");
    this.sizeForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
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
      this.SIZEPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.paramMap.get('id')) {
        this.SIZEPAGE = "Edit";
        this.userService.getsizeidwise(data).subscribe((res) => {
           if (res != "") {
            this.editarray = {
              Name: res[0].Name,
            }
            this.sizeForm.patchValue(this.editarray);
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
        if (data[i].PageId == 12) {
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
        if (data[i].PageId == 12) {
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
  doarticalsizeadd() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Name: this.sizeForm.value.Name
      }
      this.userService.updateSize(editobject).subscribe(
        userdata => {
          this.spinner.hide();
          document.getElementById('submit-button').removeAttribute('disabled');
          this.successupdated(userdata);
        }
      );
    } else {
      this.userService.doarticalsizeadd(this.sizeForm.value).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.errorexit = "Article size already exists";
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
      this.router.navigate(['/sizelist']);
      this.toastr.success('Success', 'Article Size Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdated(data) {
    if (data.id != "") {
      this.router.navigate(['/sizelist']);
      this.toastr.success('Success', 'Article Size Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack (){
    window.history.back();
  }

}

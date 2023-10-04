import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rangeseries',
  templateUrl: './rangeseries.component.html',
  styleUrls: ['./rangeseries.component.scss']
})
export class RangeseriesComponent implements OnInit {
  public editarray = {};
  rangeseriesForm: FormGroup;
  rangeseriesPAGE: any;
  errorexit: string = "";
  accessdenied: boolean = true;
  public catedropdown: any = [];
  public subcatedropdown: any = [];
  SubCategoryDisabled: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("Add Range Series | Colorhunt");
    this.rangeseriesForm = this.formBuilder.group({
      CategoryId: ['', [Validators.required]],
      SubCategoryId: ['', [Validators.required]],
      SeriesName: [''],
      Series: ['', [Validators.required]]
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
      this.rangeseriesPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.paramMap.get('id')) {
        this.rangeseriesPAGE = "Edit";
        this.userService.getrangeseriesidwise(data).subscribe((res) => {

          if (res !== "") {

            this.userService.getcategoryidwise(res[0].CategoryId).subscribe((res) => {
              this.subcatedropdown = res;
            });

            this.editarray = {
              CategoryId: res[0].CategoryId,
              SubCategoryId: res[0].SubCategoryId,
              SeriesName: res[0].SeriesName,
              Series: res[0].Series,
            }
            this.rangeseriesForm.patchValue(this.editarray);
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
        if (data[i].PageId == 32) {
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
        if (data[i].PageId == 32) {
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

  onChangeCategory(event) {
    if (event !== undefined && event !== null) {
      var newVal = '';
      if (event.Id === undefined) {
        newVal = event;
      } else {
        newVal = event.Id;
      }
      this.SubCategoryDisabled  = false;

      this.userService.getcategoryidwise(newVal).subscribe((res) => {
        this.subcatedropdown = res;
      });
    }
  }

  dosubcategoryadd() {
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        CategoryId: this.rangeseriesForm.value.CategoryId,
        SubCategoryId: this.rangeseriesForm.value.SubCategoryId,
        SeriesName: this.rangeseriesForm.value.SeriesName,
        Series: this.rangeseriesForm.value.Series
      }
      this.userService.updaterangeseries(editobject).subscribe(
        userdata => {
          this.spinner.hide();
          this.successupdate(userdata);
        }
      );
    } else {

      this.userService.dorangeseries(this.rangeseriesForm.value).subscribe(
        userdata => {
          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.errorexit = "Series already exists";
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
      this.router.navigate(['/rangeserieslist']);
      this.toastr.success('Success', 'Series Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdate(data) {
    if (data.id != "") {
      this.router.navigate(['/rangeserieslist']);
      this.toastr.success('Success', 'Series Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack (){
    window.history.back();
  }

}


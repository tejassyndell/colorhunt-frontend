import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-productlaunch',
  templateUrl: './productlaunch.component.html',
  styleUrls: ['./productlaunch.component.scss']
})
export class ProductlaunchComponent implements OnInit {
  productlaunchForm: FormGroup;
  public remainingso: any = [];
  public articlelist: any = [];
  public editarray = {};
  DropdownSO: boolean = true;
  StatusDisabled: boolean = true;
  statuscheck: boolean = false;
  getuserdata: any;
  ArticleId: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  Remarksstatus: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("Product Launch Status | Colorhunt");
    this.productlaunchForm = this.formBuilder.group({
      ArticleId: ['', [Validators.required]],
      ProductStatus: ['', [Validators.required]],
      Remarks: [''],
      //Status: ['', [Validators.required]]
    });
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
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

    this.userService.remaininglauncharticle().subscribe((res) => {
      this.articlelist = res;
    });
  }

  cancelform() {

    this.formrestvalue();
  }

  onChangeArticle(event) {

    if(event!==undefined){

    if (event.Id != "") {
      //launcharticlecheck

      this.spinner.show();
      this.userService.launcharticlecheck(event.Id).subscribe(
        res => {
          this.productlaunchForm.controls['ProductStatus'].reset();
          if(Object.keys(res).length>0){
            this.spinner.hide();
            this.editarray = {
              ProductStatus: res[0].ProductStatus,
              Remarks: res[0].Remarks
            }

            if(res[0].ProductStatus==2 || res[0].ProductStatus==3){
              this.Remarksstatus = true;
            } else{
              this.Remarksstatus = false;
            }

            this.productlaunchForm.patchValue(this.editarray);
          } else{
            this.spinner.hide();
            this.Remarksstatus = false;
          }
          //this.success(userdata);
        }
      );

      //alert(event.Id);
      this.statuscheck = false;
      this.remainingso = [];
      if (event.Id != "") {
        this.StatusDisabled = false;
        this.statuscheck = true;
      } else {
        this.statuscheck = false;
      }
    }

  }
  }

  changeStatus(event, Id){
    //alert(event.target.value);
    if(Id==2 || Id==3){
      this.productlaunchForm.controls['Remarks'].reset();
      this.Remarksstatus = true;
    } else{
      this.Remarksstatus = false;
    }

  }
  doProductLaunchStatus() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    let userdata = JSON.parse(localStorage.getItem('logindata'));

    this.productlaunchForm.value.UserId = userdata[0].Id;
    this.productlaunchForm.value.ArticleId = this.ArticleId;
    this.userService.doproductlaunchForm(this.productlaunchForm.value).subscribe(
      userdata => {
        this.spinner.hide();
        this.success(userdata);
        document.getElementById('submit-button').removeAttribute('disabled');
      }
    );
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 28) {
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
        if (data[i].PageId == 28) {
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

  success(data) {
    if (data.id != "") {
      let SonumberId = "";
      this.toastr.success('Success', 'Article Publish Successfully');
      this.ngOnInit();
      this.formrestvalue();
    }
  }

  formrestvalue() {
    this.productlaunchForm.controls['ArticleId'].reset();
    this.productlaunchForm.controls['ProductStatus'].reset();
    this.productlaunchForm.controls['Remarks'].reset();
    this.statuscheck = false;
    this.Remarksstatus = false;
  }

  goBack (){
    window.history.back();
  }

}



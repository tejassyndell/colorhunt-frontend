import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rack',
  templateUrl: './rack.component.html',
  styleUrls: ['./rack.component.scss']
})
export class RackComponent implements OnInit {
  public editarray = {};
  rackForm: FormGroup;
  RACKPAGE: any;
  errorexit: string = "";
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("Add Rack | Colorhunt");
    this.rackForm = this.formBuilder.group({
      Number: ['', [Validators.required]],
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
    this.RACKPAGE = "Add";
    let data = this.route.snapshot.paramMap.get('id');
    if (data != "" && data != undefined) {
      this.RACKPAGE = "Edit";
      this.userService.getrackidwise(data).subscribe((res) => {
        this.editarray = {
          Number: res[0].Number,
        }
        this.rackForm.patchValue(this.editarray);

      });
    }
  }
  }
  // Initicate user add
  doexitscheck() {
    this.userService.doexitscheck(this.rackForm.value.Number).subscribe(
      userdata => {
        if (userdata != "") {
          this.errorexit = "Rack already exists";
          this.rackForm.disable;
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
        if (data[i].PageId == 16) {
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
        if (data[i].PageId == 16) {
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
          this.errorexit = "Rack already exists";
          resolve({ 'isEmailUnique': true });
        } else {
          this.errorexit = "";
          resolve(null);
        }
      }, () => {
        this.errorexit = "";
        this.errorexit = "Rack already exists";
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

  dorackadd() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Number: this.rackForm.value.Number

      }
      this.userService.updateRack(editobject).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          this.successupdated(userdata);
        }
      );
    } else {
      this.userService.dorackadd(this.rackForm.value).subscribe(
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


  // User Add success function
  success(data) {
    if (data.id != "") {
      this.router.navigate(['/racklist']);
      this.toastr.success('Success', 'Rack Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdated(data) {
    if (data.id != "") {
      this.router.navigate(['/racklist']);
      this.toastr.success('Success', 'Rack Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack (){
    window.history.back();
  }

}

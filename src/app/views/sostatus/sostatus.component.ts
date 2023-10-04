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
  selector: 'app-sostatus',
  templateUrl: './sostatus.component.html',
  styleUrls: ['./sostatus.component.scss']
})
export class SostatusComponent implements OnInit {
  soStatusForm: FormGroup;
  public remainingso: any = [];
  public partylist: any = [];
  public editarray = {};
  DropdownSO: boolean = true;
  StatusDisabled: boolean = true;
  statuscheck: boolean = false;
  getuserdata: any;

  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("SO Status | Colorhunt");
    this.soStatusForm = this.formBuilder.group({
      PartyId: ['', [Validators.required]],
      SoId: [''],
      Status: ['', [Validators.required]]
    });
    this.getuserdata =  JSON.parse(localStorage.getItem('logindata'));
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

    this.userService.getparty().subscribe((res) => {
      this.partylist = res;
    });


  }

  cancelform(){
    this.formrestvalue();
  }

  onChangeParty(event) {
    this.statuscheck = false;
    this.soStatusForm.controls['SoId'].reset([null]);
    this.remainingso = [];
    if (event.target.value != "") {
      this.spinner.show();

      const newVal = event.target.value;
      this.userService.remainingsowithparty(newVal).subscribe((res) => {
        this.remainingso = res;
        this.spinner.hide();
      });
    }
  }

  onChangeSONumber(event) {
    if (event.target.value != "") {
      const newVal = event.target.value;
      this.StatusDisabled = false;
      this.statuscheck = true;
    }else{
      this.statuscheck = false;
    }
  }

  dosoStatus(){
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    let userdata =  JSON.parse(localStorage.getItem('logindata'));

    this.soStatusForm.value.UserId= userdata[0].Id;
    this.userService.dosoStatusform(this.soStatusForm.value).subscribe(
      userdata => {
        document.getElementById('submit-button').removeAttribute('disabled');
        this.spinner.hide();
        this.success(userdata);
      }
    );
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 23) {
          let parameterId = this.route.snapshot.paramMap.get('id');
          // if(data[i].AddRights==1 || data[i].EditRights==1){
          //   if(parameterId==null && data[i].AddRights==1){
          //     this.accessdenied = false;
          //   }else{
          //     if(parameterId!=null && data[i].EditRights==1){
          //       this.accessdenied = false;
          //     }else{
          //       this.accessdenied = true;
          //     }
          //   }
          // }else{
          //   this.accessdenied = true;
          // }
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }

          this.isList = data[i].ListRights;
          this.isAdd = data[i].ListRights;
         // this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = true;
        }

      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 23) {
          let parameterId = this.route.snapshot.paramMap.get('id');
          // if(data[i].AddRights==1 || data[i].EditRights==1){
          //   if(parameterId==null && data[i].AddRights==1){
          //     this.accessdenied = false;
          //   }else{
          //     if(parameterId!=null && data[i].EditRights==1){
          //       this.accessdenied = false;
          //     }else{
          //       this.accessdenied = true;
          //     }
          //   }
          // }else{
          //   this.accessdenied = true;
          // }
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }
          this.isList = data[i].ListRights;
          this.isAdd = data[i].ListRights;
          //this.isAdd = data[i].AddRights;
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
      this.toastr.success('Success', 'SO Status Add Successfully');
      this.router.navigate(['/sostatuslist']);
      this.formrestvalue();
    }
  }

  formrestvalue(){
    this.soStatusForm.controls['PartyId'].reset([null]);
    this.soStatusForm.controls['SoId'].reset([null]);
    this.statuscheck = false;
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
let roleId;
@Component({
  selector: 'app-accessrights',
  templateUrl: './accessrights.component.html',
  styleUrls: ['./accessrights.component.scss']
})
export class AccessrightsComponent implements OnInit {

  public roledropdown: any = [];
  public pageslist: any = [];
  selectdId: any;
  accessdenied: boolean = true;
  isList: any;
  dropdownSettings = {};
  public partylist: any = [];
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private router: Router,
    private userService: UserService,
    private toastr: ToastrService,private spinner: NgxSpinnerService ,private titleService: Title) { 
      this.titleService.setTitle("Access Rights | Colorhunt");
    }

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: false
    }

    this.userService.partylist().subscribe((res) => {
      // console.log('sdfsdfsdf', res)
      this.partylist = res;
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
    this.userService.getRole().subscribe((res) => {
      this.roledropdown = res;
    });

    this.userService.getpages('2').subscribe((res) => {
      this.pageslist = res;
    });
  }

  

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      // console.log(data)
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 2) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
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
        if (data[i].PageId == 2) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
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

  onItemChange(id) {
    this.spinner.show();
    this.selectdId = id;
    this.userService.getpages(id).subscribe((res) => {
      this.pageslist = [];
      this.spinner.hide();
      this.pageslist = res;
    });
  }

  onChekboxChecked(e) {
    // console.log('name???', e.target.checked)
    if (this.selectdId) {
      roleId = this.selectdId
    } else {
      roleId = '2'
    }

    if (e.target.checked) {      
      let actid = e.target.id + '_1';
      this.userService.getupdateaddrights(roleId, actid).subscribe((res) => {
      });
   
    } else {     
      let actid = e.target.id + '_0';
      this.userService.getupdateaddrights(roleId, actid).subscribe((res) => {  
      }); 
    }
  }


}

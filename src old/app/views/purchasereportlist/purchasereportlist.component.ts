import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-purchasereportlist',
  templateUrl: './purchasereportlist.component.html',
  styleUrls: ['./purchasereportlist.component.scss']
})
export class PurchasereportlistComponent implements OnInit {

  accessdenied: boolean = true;
  userService: any;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  Outletpermissions: boolean = false;
  AllReportpermissions: boolean = false;

  constructor(private titleService: Title) {
    this.titleService.setTitle("Purchase Report| Colorhunt");
   }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if(item[0].Role==7){
      this.AllReportpermissions = false;
      this.Outletpermissions = true;
    } else{
      this.AllReportpermissions = true;
    }
  
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
  }


  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        
        if (data[i].PageId == 41) {
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
        if (data[i].PageId == 41) {
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


}


import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-socategorylist',
  templateUrl: './socategorylist.component.html',
  styleUrls: ['./socategorylist.component.scss']
})
export class SocategorylistComponent implements OnInit {

  public categorylist: any = [];
  maintitle: any;
  BaseURL: string;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(public router: Router, private route: ActivatedRoute, private userService: UserService,private titleService: Title) {
    this.titleService.setTitle("SO Category List | Colorhunt");
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
 
    if (rolerights != "" && rolerights != null && rolerights !== undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
    document.body.className = 'app sidebar-hidden sidebar-fixed aside-menu-fixed aside-menu-hidden';
    this.userService.categorylist().subscribe((res) => {
  
      this.BaseURL = environment.UploadBaseURL;
      this.categorylist = res;
    });
  }

  gotoSofront(id) {
    this.router.navigate(['sofrontview', { id: id }])
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {        
        if (data[i].PageId == 26) {
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
        if (data[i].PageId == 26) {
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

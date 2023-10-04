import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-articlephotos',
  templateUrl: './articlephotos.component.html',
  styleUrls: ['./articlephotos.component.scss']
})
export class ArticlephotosComponent implements OnInit {
  public editarray = {};
  size: any;
  width: number;
  height: number;
  selectedFile: any;

  articleimgForm: FormGroup;
  FileuploadformData: any;
  public articdropdown: any = [];
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  ArticleId:any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("Add Article Photo | Colorhunt");
    this.articleimgForm = this.formBuilder.group({
      ArticleId: ['', [Validators.required]],
      Image: ['', [Validators.required]],
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
      // this.userService.articallist().subscribe((res) => {
      //   this.articdropdown = res;
      // });

      this.userService.approvedarticallist().subscribe((res) => {
        this.articdropdown = res;
      });

      // this.userService.remaininglauncharticle().subscribe((res) => {
      //   this.articdropdown = res;
      // });

    }
  }
  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 18) {
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
        if (data[i].PageId == 18) {
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

  uploadFile(event: any) {
    let elem = event.target;
    var height = 0;
    var width = 0;

    if (elem.files.length > 0) {
      this.FileuploadformData = new FormData();
      for (var i = 0; i < event.target.files.length; i++) {

        this.FileuploadformData.append("myfile[" + i + "]", event.target.files[i]);
      }
    }
    elem.value = "";
  }

  ArticlePhotos() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.FileuploadformData.append("ArticleId", this.articleimgForm.value.ArticleId.Id);
    this.FileuploadformData.append("UserId", item[0].Id);
    this.spinner.show();
    this.userService.articlephotos(this.FileuploadformData).subscribe( //line8
      (response) => {
        //response code
        this.spinner.hide();
        this.success(response);
        document.getElementById('submit-button').removeAttribute('disabled');
      });
  }

  // User Add success function
  success(data) {
    if (data.NoMatch == "true") {
      this.toastr.error('Failed', 'Image width and height not matched');
    } else if (data.result == "true") {
      this.router.navigate(['/articlephotoslist']);
      this.toastr.success('Success', 'Article Photos Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }
  goBack (){
    window.history.back();
  }
}

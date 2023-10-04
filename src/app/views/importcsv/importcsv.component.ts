import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-importcsv',
  templateUrl: './importcsv.component.html',
  styleUrls: ['./importcsv.component.scss']
})

export class ImportcsvComponent implements OnInit {
  public editarray = {};
  myForm: FormGroup;
  myFormoutlet: FormGroup;
  COLORPAGE: any;
  errorexit: string = "";
  CheckFileUpload: boolean = false;
  accessdenied: boolean = true;
  FileuploadformData: any;
  fileToUpload: File = null;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("Import CSV | Colorhunt");
    this.myForm = this.formBuilder.group({
      file: ['', [Validators.required]]
    });

    this.myFormoutlet = this.formBuilder.group({
      file: ['', [Validators.required]]
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
      this.COLORPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.paramMap.get('id')) {
        this.COLORPAGE = "Edit";
        this.userService.getcoloridwise(data).subscribe((res) => {
           if (res != "") {
            this.editarray = {
              Name: res[0].Name,
            }
            this.myForm.patchValue(this.editarray);
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
        if (data[i].PageId == 11) {
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
        if (data[i].PageId == 11) {
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


  // onFileChange(event) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.myForm.patchValue({
  //       fileSource: file
  //     });
  //   }
  // }

  onFileChange(event) {
    let elem = event.target;

    if (elem.files.length > 0) {
      this.FileuploadformData = new FormData();
      this.FileuploadformData.append("Import_CSV", event.target.files[0]);
      this.CheckFileUpload = true;
    }
    //elem.value = "";
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}


dooutletsubmit() {
  this.spinner.show();
  //if (this.CheckFileUpload == false) {
  //  this.FileuploadformData = new FormData();
  //}
  //this.FileuploadformData.append('Import_CSV', this.myForm.value.Import_CSV);

  this.userService.importoutletcsv(this.FileuploadformData).subscribe(
    userdata => {
      this.spinner.hide();
      this.success(userdata);
    }
  );
}


  dosubmit() {
    this.spinner.show();
    //if (this.CheckFileUpload == false) {
    //  this.FileuploadformData = new FormData();
    //}
    //this.FileuploadformData.append('Import_CSV', this.myForm.value.Import_CSV);

    this.userService.importcsv(this.FileuploadformData).subscribe(
      userdata => {
        this.spinner.hide();
        this.success(userdata);
      }
    );
  }

  // User Add success function
  success(data) {
    if (data.Message == "Success") {
      this.router.navigate(['/importcsv']);
      this.toastr.success('Success', 'Import CSV Successfully');
    } else if (data.Message == "Error") {
      this.router.navigate(['/importcsv']);
      this.toastr.error('Failed', 'Article number '+data.Article+' duplicate found');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack (){
    window.history.back();
  }


}

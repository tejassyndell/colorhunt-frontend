import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-beaner',
  templateUrl: './beaner.component.html',
  styleUrls: ['./beaner.component.scss']
})
export class BeanerComponent implements OnInit {
  public colorflag: boolean = false;
  public articleopenFlag : boolean = false;
  public editarray = {};
  BeanerForm: FormGroup;
  errorexit: string = "";
  POIDCheck: any;
  BANERPAGE: any;
  accessdenied: boolean = false;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  FileuploadformData: any;
  hdnImg: string = '';
  ArticleAutoGenerate: number = 0;
  ArticleSeriesAuto: number = 0;
  ArticleSeriesAutoFlag: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService  ,private titleService: Title) {
    this.titleService.setTitle("Add Beaner | Colorhunt");
    this.BeanerForm = this.formBuilder.group({
      image: this.route.snapshot.paramMap.has('id') 
        ? [null] // For edit mode
        : [null, [Validators.required]] // For add mode with required validation
    });
    
    
   // Set a default value for hdnImg
   this.hdnImg = '';
  }

  ngOnInit() {
    this.FileuploadformData = new FormData();
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
      this.BANERPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.paramMap.get('id')) {
        this.BANERPAGE = "Edit";
       
        this.userService.getBeaneridwise(data).subscribe((res) => {
          console.log('res',res);
           if (res != "") {

            if (res[0].image) {
              this.hdnImg = res[0].image
            }
            console.log('this.hdnImg',this.hdnImg);  
            console.log('Existing Image Name:', res[0].image);


            
            this.editarray = {
              
              hdnImg: res[0].image
             
            }
            this.BeanerForm.patchValue({
              image: res[0].image
              // Add other fields here and update the form controls accordingly
            });
            console.log(' Image :', res[0].image);

            this.BeanerForm.patchValue(this.editarray);
            
          }
        });
      }
    }
  }

  uploadFile(event: any) {
    let elem = event.target;
    var height = 0;
    var width = 0;
    if (elem.files.length > 0) {

      for (var i = 0; i < event.target.files.length; i++) {
        this.FileuploadformData.append("myfile[" + i + "]", event.target.files[i]);
      }
      // Update hdnImg based on the first file (you might need to adjust this based on your requirements)
      this.hdnImg = event.target.files[0].name;
      
      console.log('this.hdnImg', this.hdnImg);
      console.log('Selected files:', event.target.files);
      console.log('Updated this.hdnImg:', this.hdnImg);
    }
    elem.value = "";
  }
  // Initicate user add
  doBeaner() {
    this.spinner.show();
    //console.log('FileuploadformData:', this.FileuploadformData);

    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    if (this.route.snapshot.paramMap.get('id')) {

      this.FileuploadformData.append("id", this.route.snapshot.paramMap.get('id'));
      
     // Check if this.hdnImg is defined before appending it to FormData
    if (this.hdnImg !== undefined) {
      this.FileuploadformData.append("image", this.hdnImg);
    }
      
      this.spinner.hide();
      this.userService.updateBeaner(this.FileuploadformData).subscribe(
        
        userdata => {

          document.getElementById('submit-button').removeAttribute('disabled');
          console.log('FileuploadformData:', this.FileuploadformData);

          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.errorexit = "beaner already exists";
          } else {
            this.errorexit = "";
            this.success(userdata);
          }
        }
      );
    } else {

     // Check if this.hdnImg is defined before appending it to FormData
    if (this.hdnImg !== undefined) {
      this.FileuploadformData.append("image", this.hdnImg);
    }
 
      this.spinner.hide();
      console.log('this.hdnImg',this.hdnImg); 
      this.userService.doBeaner(this.FileuploadformData).subscribe(
        userdata => {
           
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.errorexit = "beaner already exists";
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
      this.router.navigate(['/beanerlist']);
      this.toastr.success('Success', 'beaner Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  onChekboxChecked(e) {
    var checkBox = document.getElementById("articleopenflag");
    //checkBox.checked
    if (e.target.checked) {
      this.colorflag = true;
    } else {
      this.colorflag = false;
    }
  }

  onChekboxArticleOpenFlagChecked(e) {
    if (e.target.checked) {
      this.articleopenFlag = true;
    } else {
      this.articleopenFlag = false;
    }
  }

  onradioChecked(value) {
    if (value==1) {
      this.ArticleSeriesAutoFlag = true;
    } else {
      this.ArticleSeriesAutoFlag = false;
      //this.ArticleSeriesAuto = 0;
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));

    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 9) {
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
        if (data[i].PageId == 9) {
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
  goBack (){
    window.history.back();
  }



}

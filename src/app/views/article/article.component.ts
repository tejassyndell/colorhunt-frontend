import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  public editarray = {};
  articleForm: FormGroup;
  articlePage: any;
  errorexit: string = "";
  accessdenied: boolean = true;
  public catedropdown: any = [];
  public subcatedropdown: any = [];

  public subcatrangedropdown: any = [];
  public seriesdropdown: any = [];
  SubCategoryDisabled: boolean = true;
  SeriesDisabled: boolean = true;
  ArticleShow: boolean = false;
  Month: number = 0;
  Year: number = 0;
  Orderset: number = 1;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  public brandropdown: any = [];
  public ArticleAutoGenerateFlag: boolean = false;

  ArticleSeriesAutoval: number = 0;
  ArticleAutoGenerateval: number = 0;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("Add Articlelaunch | Colorhunt");
    this.articleForm = this.formBuilder.group({
      CategoryId: ['', [Validators.required]],
      SubCategoryId: ['', [Validators.required]],
      SeriesId: ['', [Validators.required]],
      ArticleNumber: ['', [Validators.required]],
      StyleDescription: ['', [Validators.required]],
      BrandId: ['', [Validators.required]],
      LoggedId: [' ']
    });
  }

  ngOnInit() {
    this.userService.categorylist().subscribe((res) => {
      this.catedropdown = res;
    });

    this.userService.brandlist().subscribe((res) => {
      this.brandropdown = res;
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
      this.articlePage = "Add";
      let data = this.route.snapshot.paramMap.get('id');
      if (this.route.snapshot.paramMap.get('id')) {
        this.articlePage = "Edit";
        this.userService.getarticleidwise(data).subscribe((res) => {

          if (res != "" ) {

            this.userService.getcategoryidwise(res[0].CategoryId).subscribe((res) => {
              this.subcatedropdown = res;
            });

            this.userService.getartautogenerate(res[0].CategoryId).subscribe((res) => {
              //this.subcatedropdown = res;
              this.ArticleAutoGenerateval = res[0].ArticleAutoGenerate;
              this.ArticleSeriesAutoval = res[0].ArticleSeriesAuto;
            });

            this.userService.getrangeseriesarticle(res[0].CategoryId, res[0].SubCategoryId).subscribe((res) => {
              this.subcatrangedropdown = res;
            });

            this.userService.getarticleserial(res[0].Id, this.ArticleSeriesAutoval, res[0].CategoryId).subscribe((res) => {
              this.Month = res['Month'];
              this.Year = res['Year'];
              // this.Orderset = res['Orderset'];
              // this.editarray = {
              //   ArticleNumber: this.Month+'00'+this.Orderset+this.Year
              // }
              // this.articleForm.patchValue(this.editarray);


            });


            this.Orderset = res[0].Orderset;
            this.ArticleShow = true;
            this.editarray = {
              CategoryId: res[0].CategoryId,
              SubCategoryId: res[0].SubCategoryId,
              SeriesId: res[0].SeriesId,
              ArticleNumber: res[0].ArticleNumber,
              StyleDescription: res[0].StyleDescription,
              BrandId: res[0].BrandId,
            }
            this.articleForm.patchValue(this.editarray);
          }
        });
      }
      // else{
      //   this.userService.getarticleserial(0).subscribe((res) => {
      //     console.log(res);
      //     this.Month = res['Month'];
      //     this.Year = res['Year'];
      //     this.Orderset = res['Orderset'];
      //     if(this.ArticleAutoGenerateval==0){
      //       this.editarray = {

      //       }
      //     } else{
      //       this.editarray = {
      //         ArticleNumber: this.Month+'00'+this.Orderset+this.Year
      //       }
      //     }
      //     this.articleForm.patchValue(this.editarray);


      //   });

      // }
    }

  }


  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 33) {
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
        if (data[i].PageId == 33) {
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

  currentSlide(ArticleAutoGenerate){
    alert(ArticleAutoGenerate);
  }

  onChangeCategory(event) {

    //let value=JSON.parse(event.target.value)
    //let value = JSON.stringify(event.target.value);
    //alert(articleautogenerate11);

    //let value=JSON.parse(event.target.value)
    //console.log(value);

    //console.log(event.target.getAttribute('data-articleautogenerate'))
    //let target_element = event.target.dataset.articleautogenerate;
    //let target_element = event.option._getHostElement().getAttribute('data-ArticleAutoGenerate');
    if (event.target.value !== undefined && event.target.value !== null && event.target.value !== '') {
      var newVal = '';
      // if (event.Id === undefined) {
      //   newVal = event;
      // } else {
      //   newVal = event.target.value;
      // }

      newVal = event.target.value;

      this.SubCategoryDisabled  = false;

      // if(target_element==1){
      //   this.ArticleAutoGenerateFlag = true;
      // }else{
      //   this.ArticleAutoGenerateFlag = false;
      // }

      this.userService.getartautogenerate(newVal).subscribe((res) => {
        //this.subcatedropdown = res;
        this.ArticleAutoGenerateval = res[0].ArticleAutoGenerate;
        this.ArticleSeriesAutoval = res[0].ArticleSeriesAuto;

        this.userService.getarticleserial(0, this.ArticleSeriesAutoval, newVal).subscribe((res) => {
          this.Month = res['Month'];
          this.Year = res['Year'];
          this.Orderset = res['Orderset'];
          if(this.ArticleAutoGenerateval==0){
            this.editarray = {
              ArticleNumber: ''
            }
          } else{
            this.editarray = {
              ArticleNumber: this.Month+'00'+this.Orderset+this.Year
            }
          }
          this.articleForm.patchValue(this.editarray);


        });

      });


      this.subcatedropdown = [];
      this.subcatrangedropdown = [];
      this.articleForm.controls['SubCategoryId'].reset([null]);
      this.articleForm.controls['SeriesId'].reset([null]);


      this.userService.getcategoryidwise(newVal).subscribe((res) => {
        this.subcatedropdown = res;
      });

      this.ArticleShow = false;

    } else{
      this.subcatedropdown = [];
      this.subcatrangedropdown = [];
      this.articleForm.controls['SubCategoryId'].reset([null]);
      this.articleForm.controls['SeriesId'].reset([null]);
      this.ArticleShow = false;
    }
  }

  onChangeSubCategory(event) {
    if (event !== undefined && event !== null && event !== '') {
      var newVal = '';
      if (event.Id === undefined) {
        newVal = event;
      } else {
        newVal = event.Id;
      }
      this.SeriesDisabled  = false;

      this.userService.getsubcatrangeserieswise(newVal).subscribe((res) => {
        this.subcatrangedropdown = res;
      });
    } else{
      this.subcatrangedropdown = [];
      this.articleForm.controls['SeriesId'].reset([null]);
      this.ArticleShow = false;
    }
  }


  getSelectedOptionText(event) {

    if (event.target.value !== undefined && event.target.value !== null && event.target.value !== '') {
      let selectElementText = event.target['options']
        [event.target['options'].selectedIndex].text;

        if(this.ArticleAutoGenerateval==0){
          this.editarray = {
            ArticleNumber: ''
          }
        } else{
          this.editarray = {
            ArticleNumber: selectElementText+this.Month+'00'+this.Orderset+this.Year
          }
        }

        this.ArticleShow = true;
        this.articleForm.patchValue(this.editarray);
      } else{
        this.ArticleShow = false;
      }
 }

  doarticleadd() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    this.articleForm.value.Orderset = this.Orderset;
    let item = JSON.parse(localStorage.getItem('userdata'));

    this.articleForm.patchValue({LoggedId: item[0].Id});
    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        CategoryId: this.articleForm.value.CategoryId,
        SubCategoryId: this.articleForm.value.SubCategoryId,
        SeriesId: this.articleForm.value.SeriesId,
        BrandId: this.articleForm.value.BrandId,
        ArticleNumber: this.articleForm.value.ArticleNumber,
        StyleDescription: this.articleForm.value.StyleDescription,
        LoggedId: this.articleForm.value.LoggedId
      }
      this.userService.updatearticle(editobject).subscribe(
        userdata => {
          this.spinner.hide();
          this.successupdate(userdata);
          document.getElementById('submit-button').removeAttribute('disabled');
        }
      );
    } else {
      this.userService.doarticle(this.articleForm.value).subscribe(
        userdata => {
          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.errorexit = "Article already exists";
          } else {
            this.errorexit = "";
            this.success(userdata);
            document.getElementById('submit-button').removeAttribute('disabled');
          }
        }
      );
    }

  }

  // User Add success function
  success(data) {
    if (data.id != "") {
      this.router.navigate(['/articlelist']);
      this.toastr.success('Success', 'Article Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  successupdate(data) {
    if (data.id != "") {
      this.router.navigate(['/articlelist']);
      this.toastr.success('Success', 'Article Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }
  goBack (){
    window.history.back();
  }

}



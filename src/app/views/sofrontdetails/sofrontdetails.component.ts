import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Lightbox } from 'ngx-lightbox';
import { environment } from './../../../environments/environment';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sofrontdetails',
  templateUrl: './sofrontdetails.component.html',
  styleUrls: ['./sofrontdetails.component.scss']
})
export class SofrontdetailsComponent implements OnInit {
  cartitem: any = [];
  public details: any = [];
  public size = [];
  public color = [];
  allId = [];
  public maintitle: any;
  public _albums = [];
  totalcartitem: any;
  uploadURL: string = environment.getuploadURL;
  sets_label: string;
  soFrontForm: FormGroup;
  ///new
  GETNOPACKS: any;
  SoCurrentDate: Date;
  public partypdown: any = [];
  public colorcountdown = [];
  public itemcart = [];
  noofpackcount: boolean = false;
  noofpacksets: boolean = false;
  NoPacks: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  myFormValueChanges$;
  totalQuantity: number = 0;
  totalqualityLength: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private _lightbox: Lightbox,private titleService: Title) {
    this.titleService.setTitle("SO Front Details | Colorhunt");
    this.totalcartitem = 0;
    if (localStorage.getItem('CartIteam') !== null) {
      this.totalcartitem = JSON.parse(localStorage.getItem('CartIteam')).length;
    }
    this.soFrontForm = this.formBuilder.group({

      NoPacksNew: [''],
      NoPacks: [''],

    })
  }

  ngOnInit() {
    document.body.className = 'app sidebar-hidden sidebar-fixed aside-menu-fixed aside-menu-hidden';

    let i;
    let val;
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));

    if (rolerights != "" && rolerights != null && rolerights !== undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }

    if (this.itemcart.length == 0) {
      if (localStorage.getItem('CartIteam') !== null) {
        for (i = 0; i < JSON.parse(localStorage.getItem('CartIteam')).length; i++) {
          val = JSON.parse(localStorage.getItem('CartIteam'))[i];
          this.itemcart.push(val);
        }
      }
    }


    this.userService.partylist().subscribe((res) => {
      this.partypdown = res;
    });
    this.SoCurrentDate = new Date();
    let data = this.route.snapshot.paramMap.get('id');
    this.userService.getarticledetails(data).subscribe((res) => {

      this.details = res;


      ///new code
      let getdataassignnopacks = {};
      if (res[0].ArticleOpenFlag == 0) {
        this.size = JSON.parse(res[0].ArticleSize);
        this.color = JSON.parse(res[0].ArticleColor);

        const ratio = res[0].ArticleRatio.split(',');
        const noPacks = res[0].SalesNoPacks.split(',');
        this.GETNOPACKS = res[0].SalesNoPacks;

        for (let index = 0; index < ratio.length; index++) {
          this.size[index]['ratiocount'] = ratio[index];
        }

        this.sets_label = "Pieces";

        let assignnopacks = {};
        if (res[0].Colorflag == 1) {
          this.noofpackcount = true;
          this.noofpacksets = false;
          this.colorcountdown = this.color;
          let i;
          var Count1 = Object.keys(this.colorcountdown).length;
          var nameArr = res[0].SalesNoPacks.split(',');
          var nameNopacksArr = this.GETNOPACKS.split(',');

          let generatenopack;
          let getdatageneratenopack;
          for (i = 0; i < Count1; i++) {
            generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
            getdatageneratenopack = 'NoPacksNew_' + this.colorcountdown[i]['Id'];

            assignnopacks[generatenopack] = nameArr[i];
            getdataassignnopacks[getdatageneratenopack] = nameArr[i];
            this.soFrontForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
            this.soFrontForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());

            this.totalqualityLength = true;
            this.myFormValueChanges$ = this.soFrontForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
          // subscribe to the stream so listen to changes on units
          this.soFrontForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].reset();
            this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
          }
        } else {
          this.noofpackcount = false;
          this.noofpacksets = true;
          this.soFrontForm.addControl('NoPacks', new FormControl());
          this.NoPacks = res[0].SalesNoPacks;
        }

        this.soFrontForm.patchValue(assignnopacks);
      } else {
        this.noofpackcount = false;
        this.noofpacksets = false;
        this.soFrontForm.addControl('NoPacks', new FormControl());
        this.NoPacks = res[0].NoPacks;
      }

      //end

      if (res[0].Images != undefined && res[0].Images != null && res[0].Images != "") {
        var str = res[0].Images;
        var str_array = str.split(',');
        for (var i = 0; i < str_array.length; i++) {
          str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");

          const ia = this.uploadURL + str_array[i];
          const src = ia;
          const thumb = ia;
          const album = {
            src: src,
            thumb: thumb
          };

          this._albums.push(album);
        }
      } else {
        const album = {
          src: 'assets/img/no-image-available.png',
          thumb: 'assets/img/no-image-available.png'
        };

        this._albums.push(album);

      }

    });

  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 26) {
          let parameterInnerId = this.route.snapshot.paramMap.get('id');
          if (data[i].ListRights == 1) {
            if (parameterInnerId != "" && parameterInnerId != undefined && parameterInnerId != null) {
              this.accessdenied = false;
            } else {
              this.accessdenied = true;
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
  doSoFrontform() {
    setTimeout(() => this.spinner.show(), 25);
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    let cardtdata = JSON.parse(localStorage.getItem('CartIteam'));

    let removevl = this.details[0].Id;
    this.cartitem = [];
    this.allId = [];
    let i;

    if (cardtdata != null) {
      for (let index = 0; index < JSON.parse(localStorage.getItem('CartIteam')).length; index++) {
        let val = JSON.parse(localStorage.getItem('CartIteam'))[index]['Id'];
        this.allId.push(val)
      }
      var n = this.allId.includes(this.details[0].Id);
      if (n == false) {
        this.soFrontForm.value.ArticleOpenFlag = this.details[0].ArticleOpenFlag;
        this.soFrontForm.value.ArticleId = this.details[0].Id;
        this.soFrontForm.value.ArticleSelectedColor = this.details[0].ArticleColor;
        this.soFrontForm.value.ArticleRatio = this.details[0].ArticleRatio;
        this.soFrontForm.value.ArticleRate = this.details[0].ArticleRate;

        this.userService.cartnopackscheck(this.soFrontForm.value).subscribe((res) => {
          if (res['NoOfSetNotMatch'] == "true") {
            this.toastr.error('Failed', '\"Required Pieces\" greater than available pieces');
          } else if (res['ZeroNotAllow'] == "true") {
            this.toastr.error('Failed', 'Zero value not allow for "Required Pieces"');
          } else if (res['RequiredSet'] != "") {
            let body = {
              "ArticleData": this.details,
              "Carddata": this.soFrontForm.value,
              "RequiredNoPacks": res['RequiredSet'],
              "TotalNoPacks": res['TotalNoPacks'],
              "Amount": res['Amount'],
              "Id": this.details[0].Id
            }

            this.itemcart.push(body);
            localStorage.setItem('CartIteam', JSON.stringify(this.itemcart));
            this.toastr.success('Success', 'Added to bag');
            this.router.navigate(['socart']);
          } else {
            this.toastr.error('Failed', 'Please try agin later');
          }
          this.spinner.hide();
        });
      } else {
        for (let index = 0; index < JSON.parse(localStorage.getItem('CartIteam')).length; index++) {
          let val = JSON.parse(localStorage.getItem('CartIteam'))[index]['Id'];
          this.allId.push(val)
          let Alreadyexists = JSON.parse(localStorage.getItem('CartIteam'))[index]['AlreadyexistsID'];
          if (val == this.details[0].Id) {
            for (i = 0; i < JSON.parse(localStorage.getItem('CartIteam')).length; i++) {
              let Id = JSON.parse(localStorage.getItem('CartIteam'))[i]['Id'];
              let val = JSON.parse(localStorage.getItem('CartIteam'))[i];
              if (Id != removevl) {
                this.cartitem.push(val);
              }
            }

            this.soFrontForm.value.ArticleOpenFlag = this.details[0].ArticleOpenFlag;
            this.soFrontForm.value.ArticleId = this.details[0].Id;
            this.soFrontForm.value.ArticleSelectedColor = this.details[0].ArticleColor;
            this.soFrontForm.value.ArticleRatio = this.details[0].ArticleRatio;
            this.soFrontForm.value.ArticleRate = this.details[0].ArticleRate;

            this.userService.cartnopackscheck(this.soFrontForm.value).subscribe((res) => {
              if (res['NoOfSetNotMatch'] == "true") {
                this.toastr.error('Failed', '\"Required pieces\" greater than available Pieces');
              } else if (res['ZeroNotAllow'] == "true") {
                this.toastr.error('Failed', 'Zero value not allow for "Required Pieces"');
              } else if (res['RequiredSet'] != "") {
                let body = {
                  "ArticleData": this.details,
                  "Carddata": this.soFrontForm.value,
                  "RequiredNoPacks": res['RequiredSet'],
                  "TotalNoPacks": res['TotalNoPacks'],
                  "Amount": res['Amount'],
                  "Id": this.details[0].Id,
                  "AlreadyexistsID": 1
                }
                localStorage.removeItem('CartIteam');
                this.cartitem.push(body);
                localStorage.setItem('CartIteam', JSON.stringify(this.cartitem));
                this.toastr.success('Success', 'Added to bag');
                this.router.navigate(['socart']);
              } else {
                this.toastr.error('Failed', 'Please try agin later');
              }
              this.spinner.hide();
            });
            break

          }
        }
      }
    } else {
      this.soFrontForm.value.ArticleOpenFlag = this.details[0].ArticleOpenFlag;
      this.soFrontForm.value.ArticleId = this.details[0].Id;
      this.soFrontForm.value.ArticleSelectedColor = this.details[0].ArticleColor;
      this.soFrontForm.value.ArticleRatio = this.details[0].ArticleRatio;
      this.soFrontForm.value.ArticleRate = this.details[0].ArticleRate;

      this.userService.cartnopackscheck(this.soFrontForm.value).subscribe((res) => {

        if (res['NoOfSetNotMatch'] == "true") {
          this.toastr.error('Failed', '\"Required pieces\" greater than available Pieces');
        } else if (res['ZeroNotAllow'] == "true") {
          this.toastr.error('Failed', 'Zero value not allow for "Required Pieces"');
        } else if (res['RequiredSet'] != "") {
          let body = {
            "ArticleData": this.details,
            "Carddata": this.soFrontForm.value,
            "RequiredNoPacks": res['RequiredSet'],
            "TotalNoPacks": res['TotalNoPacks'],
            "Amount": res['Amount'],
            "Id": this.details[0].Id
          }

          this.itemcart.push(body);
          localStorage.setItem('CartIteam', JSON.stringify(this.itemcart));
          this.toastr.success('Success', 'Added to bag');
          this.router.navigate(['socart']);
        } else {
          this.toastr.error('Failed', 'Please try agin later');
        }
        this.spinner.hide();
      });

    }

    this.spinner.hide();



  }

  TotalQualityPeace() {
    let i;
    this.colorcountdown = this.color;
    var Count1 = Object.keys(this.colorcountdown).length;
    this.totalQuantity = 0;
    for (i = 0; i < Count1; i++) {
      const inputname = 'NoPacksNew_' + this.colorcountdown[i]['Id'];
      if(this.soFrontForm.controls[inputname].value!==null && this.soFrontForm.controls[inputname].value!=""){
        this.totalQuantity += parseInt(this.soFrontForm.controls[inputname].value);
      }
    }
    $(".totalquality").text(this.totalQuantity);
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

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index);
  }
  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }
}

import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { start } from 'repl';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

class Person {
  Id: number;
  OutwardNumber: string;
  SoNumber: string;
  Name: string;
  TotalOutwardPieces: string;
  OutwardDate: string;
  OutwardNumberId: string;
  SoId: string;
  Action: string
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}


@Component({
  selector: 'app-stocktransfer',
  templateUrl: './stocktransfer.component.html',
  styleUrls: ['./stocktransfer.component.scss']
})
export class StocktransferComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public startnumber: any;
  @ViewChild("myInputBox") myInputBox: ElementRef;
  public colordropdown: any = [];
  public sizedropdown: any = [];
  public ratiodropdown: any = [];

  public editarray = {};
  public articaldown: any = [];
  public stocktransferlist: any = [];
  accessdenied: boolean = true;
  //Table1
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  //end table
  //Table2
  public shortagetransferlist: any = [];
  // @ViewChild(DataTableDirective)
  dtElement2: DataTableDirective;
  dtOptions2: any;
  dtTrigger2: Subject<any> = new Subject();
  //end table
  StocktransferOrderLabel: boolean = false;

  dropdownSettings = {};
  stocktransfer: FormGroup;
  OutWordCurrentDate: Date;
  Status = 0;
  OutwardNumberId: any;
  StocktransferNumberId: any;
  DropdownSO: boolean = true;

  hideElement: boolean = true;
  articalData: boolean = false;
  productionarticalData: boolean = false;
  // OutwardWeightOpenFlag: boolean = false;
  Disabled = true;
  ProductionArticleDisabled: boolean = true;
  AddArticle = true;
  isEdit: any;
  isDelete: any;
  ST_Number: any;
  ST_Number_FinancialYear: any;
  SO_Number: any;
  ArtDisabled: boolean = false;
  noofpackcount: boolean = true;
  productionnoofpackcount: boolean = true;
  public colorcountdown = [];
  public productioncolorcountdown = [];
  ArticleNumber: any;
  ArticleOpenFlag: boolean = true;
  ArticleOpenFlagValue: any;
  productionArticleOpenFlag: boolean = true;
  productionArticleOpenFlagValue: any;
  sets_label: any;
  isDeleteandEdit: boolean = true;

  dropdownList = [];
  ArticleSelectedColor = [];
  ArticleSelectedSize = [];
  ArticleRatio: any;
  colorflag: any;
  NoPacks: any;
  ArticleNoPacks: any;
  GETNOPACKS: any = 0;

  pdropdownList = [];
  ProductionArticleSelectedColor = [];
  ProductionArticleSelectedSize = [];
  ProductionArticleRatio: any;
  productioncolorflag: any;
  ProductionNoPacks: any;
  ProductionArticleNoPacks: any;
  ProductionGETNOPACKS: any = 0;
  SOPAGE: any;
  getuserdata: any;
  UserWiseData: boolean = true;
  ArticleRate: any;
  // OutwardWeight: any;
  isList: any;
  isAdd: any;
  ArticleId: any;
  ProductionArticleId: any;
  myFormValueChanges$;
  totalQuantity: number = 0;
  productiontotalQuantity: number = 0;
  totalqualityLength: boolean = false;
  productiontotalqualityLength: boolean = false;
  // PartyDiscount: number = 0;
  // OutwardPartyDiscount: number = 0;
  value: string;
  isError = false;
  //GSTType: string = 'GST';
  totalpiecesflag: boolean = false;
  stocktransferflag: boolean = true;
  DropdownConsumptionArticleId: any;
  DropdownProductionArticleId: any;
  SourceArticleCategory: any;
  DesArticleCategory: any;
  dateDisabled: boolean = false;

  public partypdown: any = [];
  partyid: number = 0;
  disebval: boolean = false;
  accountpartyId: number = 0;


  ProArticleNumber: any;
  //statusdispaly:boolean=false;
  constructor( private http: HttpClient, private el: ElementRef, private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Add Stock Transfer | Colorhunt");
    this.stocktransfer = this.formBuilder.group({
      StocktransferNumberId: [''],
      StocktransferDate: ['', [Validators.required]],
      SoId: [''],
      TransferType: ['1'],
      Remarks: [''],

      ArticleId: ['', [Validators.required]],
      ArticleSelectedColor: [''],
      ArticleSelectedSize: [''],
      ArticleRatio: [''],
      NoPacks: [''],
      NoPacksNew: [''],

      ProductionArticleId: [''],//valid
      ProductionArticleSelectedColor: [''],
      ProductionArticleSelectedSize: [''],
      ProductionArticleRatio: [''],
      ProductionNoPacks: [''],
      ProductionNoPacksNew: [''],
      SourceArticleCategory: [''],
      DesArticleCategory: ['']
    });
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }



  ngOnInit() {

    //   let defaultId = 1;
    //  this.stocktransfer.controls['TransferType'].setValue(defaultId);

    this.stocktransfer.controls['ProductionArticleId'].disable();

    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (item[0].Role == 2) {
      this.dateDisabled = false;
    } else {
      this.dateDisabled = true;
    }
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }

    this.userService.remainingarticlelist().subscribe((res) => {
      // console.log('s',res)
      this.articaldown = res;
    });

    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 10);
      this.UserWiseData = true;
      this.SOPAGE = "Add";
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'Id',
        textField: 'Name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableCheckAll: false,
        itemsShowLimit: 2,
        disabled: true,
        allowSearchFilter: true
      };
      this.Status = 0;
      this.OutWordCurrentDate = new Date();
      this.userService.colorlist().subscribe((res) => {
        var Count = Object.keys(res).length;
        let articlecolor_dropdown;
        let i;
        let val;
        articlecolor_dropdown = [];
        for (i = 0; i < Count; i++) {
          val = { Id: res[i].Id, Name: res[i].Name }
          articlecolor_dropdown.push(val);
        }
        this.colordropdown = articlecolor_dropdown;
      });

      this.userService.sizelist().subscribe((res) => {
        var Count = Object.keys(res).length;
        let articlesize_dropdown;
        let i;
        let val;
        articlesize_dropdown = [];
        for (i = 0; i < Count; i++) {
          val = { Id: res[i].Id, Name: res[i].Name }
          articlesize_dropdown.push(val);
        }
        this.sizedropdown = articlesize_dropdown;
      });







        // start
        this.userService.getoutletpartystocktransfer(this.partyid).subscribe((res) => {
          this.partypdown = res;
          let PartyId = this.getuserdata[0].PartyId;
          let RoleId = this.getuserdata[0].Role;
          if (RoleId == 7) {
            this.editarray = {
              PartyId: PartyId
            }
            // this.OutletForm.patchValue(this.editarray);
            this.disebval = true;
            this.userService.getarticleofoutlet(PartyId).subscribe((res) => {
              this.articaldown = res;
            });
          } else {
            this.disebval = false;
          }
        });
        // end




      let data = this.route.snapshot.paramMap.get('STNO');
      let get_id = this.route.snapshot.paramMap.get('id');
      if (data == "Add") {
        this.StocktransferOrderLabel = false;
      } else {
        this.StocktransferNumberId = data;
        this.StocktransferOrderLabel = true;
        this.DropdownSO = false;
      }

      if (data != "" && data != undefined) {

        this.getOWList(this.route.snapshot.paramMap.get('STNO'));
      }
      if (get_id != "" && get_id != undefined) {
        this.edit(get_id);
      }
    }
    // this.getOWList(this.route.snapshot.paramMap.get('STNO'));

  }

  onChangeTranferType(event) {
    this.resetdataall()
    if (event.target.value == 2) {
      this.stocktransferflag = false;
      this.getshortage();
    } else {
      this.stocktransferflag = true;
      this.getOWList(this.route.snapshot.paramMap.get('STNO'));

    }
  }


//start
  onChangePartyId(event) {
    if (event.target.value != "") {
      this.spinner.show();
      const newVal = event.target.value;
      this.accountpartyId = event.target.value;

      this.userService.getarticleofoutlet(newVal).subscribe((res) => {
        console.log('fffff', res)
        this.articaldown = res;
      
      });

      this.spinner.hide();


    }
  }
//end



  resetdataall() {
    if (this.ArticleSelectedColor.length > 0) {
      for (let i = 0; i < this.ArticleSelectedColor.length; i++) {
        this.noofpackcount = true;
        const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
        const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

        this.stocktransfer.removeControl(inputname);
        this.stocktransfer.removeControl(inputname2);
      }
    }
    if (this.stocktransferflag == true) {
      // debugger
      if (this.ProductionArticleSelectedColor !== null) {
        if (this.ProductionArticleSelectedColor.length > 0) {

          for (let j = 0; j < this.ProductionArticleSelectedColor.length; j++) {
            this.productionnoofpackcount = true;
            const inputname = 'ProductionNoPacks_' + this.ProductionArticleSelectedColor[j]['Id'];
            const inputname2 = 'ProductionNoPacksNew_' + this.ProductionArticleSelectedColor[j]['Id'];
            this.stocktransfer.controls[inputname].reset();
            this.stocktransfer.controls[inputname2].reset();
            //this.stocktransfer.removeControl(inputname);
            //this.stocktransfer.removeControl(inputname2);
          }
        }
      }
      this.stocktransfer.controls['ProductionArticleId'].reset();
      if (this.productionArticleOpenFlagValue == 0) {
        this.stocktransfer.controls['ProductionArticleSelectedColor'].reset();
        this.stocktransfer.controls['ProductionArticleSelectedSize'].reset();
        this.stocktransfer.controls['ProductionArticleRatio'].reset();
      }
      this.productionArticleOpenFlag = true;
      this.stocktransfer.controls['ProductionNoPacksNew'].reset();


    }

    this.ArticleId = null;
    this.ProductionArticleId = null;
    this.stocktransfer.controls['ArticleId'].reset();
    if (this.ArticleOpenFlagValue == 0) {
      this.stocktransfer.controls['ArticleSelectedColor'].reset();
      this.stocktransfer.controls['ArticleSelectedSize'].reset();
      this.stocktransfer.controls['ArticleRatio'].reset();
    }

    this.stocktransfer.controls['NoPacksNew'].reset();



    this.ArticleRatio = '';
    this.AddArticle = true;
    // this.hideElement = true;
    this.ArticleOpenFlag = true;
    // this.OutwardWeightOpenFlag = false;

    this.ArticleSelectedColor = [];
    this.ArticleSelectedSize = [];
    this.colorcountdown = [];

    this.articalData = false;
  }


  onError(error) {
    console.error(error);
    this.isError = true;
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
    //  this.dtTrigger.complete();  
  }
    ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    // this.dtTrigger2.unsubscribe();
    }


  onStarted(started) {
    console.log(started);
  }


  onChangeSONumber(event) {
    if (event.target.value != "") {
      this.spinner.show();

      const newVal = event.target.value;
      const STNO_number = this.route.snapshot.paramMap.get('STNO');

      let i;
      if (this.ArticleSelectedColor.length > 0) {
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
          const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

          //   this.stocktransfer.reset(this.profileEditForm.value);

          this.stocktransfer.removeControl(inputname);
          this.stocktransfer.removeControl(inputname2);
        }
      }
      this.stocktransfer.controls['ArticleId'].reset();
      this.stocktransfer.controls['ArticleSelectedColor'].reset();
      this.stocktransfer.controls['ArticleSelectedSize'].reset();
      this.stocktransfer.controls['ArticleRatio'].reset();
      this.stocktransfer.controls['NoPacksNew'].reset();

      this.stocktransfer.controls['ProductionArticleId'].reset();
      this.stocktransfer.controls['ProductionArticleSelectedColor'].reset();
      this.stocktransfer.controls['ProductionArticleSelectedSize'].reset();
      this.stocktransfer.controls['ProductionArticleRatio'].reset();
      this.stocktransfer.controls['ProductionNoPacksNew'].reset();
      // this.stocktransfer.controls['OutwardWeight'].reset();
      // this.stocktransfer.controls['GST'].reset();
      // this.stocktransfer.controls['GST_Percentage'].reset();
      // this.stocktransfer.controls['GSTType'].reset();
      // this.stocktransfer.controls['PartyDiscount'].reset();
      // this.stocktransfer.controls['PartyDiscount'].reset(this.OutwardPartyDiscount);


      this.ArticleSelectedColor = [];
      this.ProductionArticleSelectedColor = [];
      this.ArticleSelectedSize = [];
      this.colorcountdown = [];
      this.productioncolorcountdown = [];
      this.userService.getsodata(STNO_number, newVal).subscribe((res) => {
        this.getdatafromso(res);
      });

      this.spinner.hide();
    } else {
      this.formrestvalue();
      this.articaldown = [];
    }
  }

  getdatafromso(res) {
    if (res.BasicDetails.length > 0) {



      //alert(res.BasicDetails[0].GSTType);
      let data = this.route.snapshot.paramMap.get('STNO');
      if (data == "Add") {
        this.editarray = {
          Remarks: res.BasicDetails[0].Remarks,
          //  PartyDiscount: res.BasicDetails[0].PartyDiscount,
          //  GSTType: res.BasicDetails[0].GSTType
        }

        // this.GSTType = res.BasicDetails[0].GSTType;
      } else {

        this.editarray = {
          Remarks: res.BasicDetails[0].Remarks,
          //  PartyDiscount: res.BasicDetails[0].PartyDiscount,
          //  GSTType: this.GSTType
        }
      }

      // this.OutwardPartyDiscount = res.BasicDetails[0].PartyDiscount;
      this.AddArticle = true;
      this.articaldown = res.Articles;


      this.stocktransfer.patchValue(this.editarray);
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 34) {
          let parameterInnerId = this.route.snapshot.paramMap.get('id');
          let parameterId = this.route.snapshot.paramMap.get('STNO');
          if (data[i].AddRights == 1 || data[i].EditRights == 1) {
            if (parameterId == 'Add' && data[i].AddRights == 1) {
              this.accessdenied = false;
            } else {
              if (parameterId != 'Add' && data[i].EditRights == 1) {
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
        if (data[i].PageId == 34) {
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



  resetdata(val) {
    if (val == 1) {
      $(".totalquality").text(0);
      if (this.ArticleSelectedColor.length > 0) {
        for (let i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
          const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];
          //this.stocktransfer.controls[inputname].reset();
          //this.stocktransfer.controls[inputname2].reset();
          this.stocktransfer.removeControl(inputname);
          this.stocktransfer.removeControl(inputname2);
        }
      }
    } else {
      $("#isproduction").text(0);
      if (this.ProductionArticleSelectedColor.length > 0) {
        // debugger
        for (let i = 0; i < this.ProductionArticleSelectedColor.length; i++) {
          this.productionnoofpackcount = true;
          const inputname = 'ProductionNoPacks_' + this.ProductionArticleSelectedColor[i]['Id'];
          const inputname2 = 'ProductionNoPacksNew_' + this.ProductionArticleSelectedColor[i]['Id'];
          //this.stocktransfer.controls[inputname].reset();
          //this.stocktransfer.controls[inputname2].reset();
          this.stocktransfer.removeControl(inputname);
          this.stocktransfer.removeControl(inputname2);
        }
      }
    }

  }

  onChangartical(event) {
    if (event !== undefined && event !== null) {
      this.resetdata(1)
      $(".totalquality").text(0);
      this.GETNOPACKS = 0;
      this.spinner.show();
      this.articalData = true;

      if (event.Id !== undefined) {
        const newVal = event.Id;
        const outletId = this.accountpartyId;


        console.log('On change', outletId)

        this.DropdownConsumptionArticleId = event.Id;
        // alert(event.Id);
        //  this.stocktransfer.controls['ProductionArticleId'].disable("false");
        this.stocktransfer.controls['ProductionArticleId'].enable();
        this.userService.getinwardarticledata(newVal).subscribe((res) => {
          this.SourceArticleCategory = res[0].Category;
          if (res[0].ArticleOpenFlag == 0) {
            this.sets_label = "Pieces";
            this.ArticleOpenFlag = true;
            this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
            this.Disabled = true;
            this.ProductionArticleDisabled = true;
            this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
            this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
            this.ArticleRatio = res[0].ArticleRatio;

            let assignnopacks = {};


            if (res[0].Colorflag == 1) {
              this.noofpackcount = true;
              this.colorcountdown = this.ArticleSelectedColor;
              let i;
              var Count1 = Object.keys(this.colorcountdown).length;
              var nameArr = res[0].SalesNoPacks.split(',');
              //alert("ss");
              let generatenopack;
              for (i = 0; i < Count1; i++) {
                generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
                assignnopacks[generatenopack] = nameArr[i];
                this.stocktransfer.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
                this.stocktransfer.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());

                this.totalqualityLength = true;
                this.myFormValueChanges$ = this.stocktransfer.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
                // subscribe to the stream so listen to changes on units
                this.stocktransfer.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].reset();
                this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
              }
            } else {
              //alert("asdas");
              this.totalqualityLength = false;
              this.noofpackcount = false;
              this.stocktransfer.addControl('NoPacks', new FormControl());
              this.NoPacks = res[0].SalesNoPacks;
            }

            this.stocktransfer.patchValue(assignnopacks);
          } else {
            //alert("asdasd");
            this.sets_label = "pieces";
            this.ArticleOpenFlag = false;
            this.totalqualityLength = false;
            this.noofpackcount = false;
            this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
            this.stocktransfer.addControl('NoPacks', new FormControl());
            this.NoPacks = res[0].NoPacks;
          }
          this.spinner.hide();

        });
      }

    } else {
      this.articalData = false;
    }

  }
  onChangeproductionartical(event) {
    if (event !== undefined && event !== null) {
      //   this.resetdata(2)
      $("#isproduction").text(0);
      this.ProductionGETNOPACKS = 0;
      this.spinner.show();
      this.productionarticalData = true;

      if (event.Id !== undefined) {
        const newVal = event.Id;
        // if (this.DropdownConsumptionArticleId == newVal) {
        //   //  alert("Same Article Id");
        //   this.spinner.hide();
        //   this.toastr.error('Failed', 'Same Article Id');
        //   return;
        // } else {
        this.ProductionArticleDisabled = false;
        this.userService.getinwardarticledata(newVal).subscribe((res) => {
          this.DesArticleCategory = res[0].Category;
          if (res[0].ArticleOpenFlag == 0) {
            this.sets_label = "Pieces";
            this.productionArticleOpenFlag = true;
            this.productionArticleOpenFlagValue = res[0].ArticleOpenFlag;
            this.Disabled = true;
            this.ProductionArticleSelectedColor = JSON.parse(res[0].ArticleColor);
            this.ProductionArticleSelectedSize = JSON.parse(res[0].ArticleSize);
            this.ProductionArticleRatio = res[0].ArticleRatio;
            let assignnopacks = {};


            if (res[0].Colorflag == 1) {
              this.productionnoofpackcount = true;
              this.productioncolorcountdown = this.ProductionArticleSelectedColor;
              let i;
              var Count1 = Object.keys(this.productioncolorcountdown).length;
              var nameArr = res[0].SalesNoPacks.split(',');
              //alert("ss");
              let generatenopack;
              for (i = 0; i < Count1; i++) {
                generatenopack = 'ProductionNoPacks_' + this.productioncolorcountdown[i]['Id'];
                assignnopacks[generatenopack] = nameArr[i];
                this.stocktransfer.addControl('ProductionNoPacks_' + this.productioncolorcountdown[i]['Id'], new FormControl());
                this.stocktransfer.addControl('ProductionNoPacksNew_' + this.productioncolorcountdown[i]['Id'], new FormControl());

                this.productiontotalqualityLength = true;
                this.myFormValueChanges$ = this.stocktransfer.controls['ProductionNoPacksNew_' + this.productioncolorcountdown[i]['Id']].valueChanges;
                // subscribe to the stream so listen to changes on units
                this.stocktransfer.controls['ProductionNoPacksNew_' + this.productioncolorcountdown[i]['Id']].reset();
                this.myFormValueChanges$.subscribe(units => this.TotalQualityPeaceProduction());
              }
            } else {
              //alert("asdas");
              this.productiontotalqualityLength = false;
              this.productionnoofpackcount = false;
              this.stocktransfer.addControl('ProductionNoPacks', new FormControl());
              this.ProductionNoPacks = res[0].SalesNoPacks;
            }

            this.stocktransfer.patchValue(assignnopacks);
          } else {
            //alert("asdasd");
            this.sets_label = "pieces";
            this.productionArticleOpenFlag = false;
            this.productiontotalqualityLength = false;
            this.productionnoofpackcount = false;
            this.productionArticleOpenFlagValue = res[0].ArticleOpenFlag;
            this.stocktransfer.addControl('ProductionNoPacks', new FormControl());
            this.ProductionNoPacks = res[0].NoPacks;
          }
          this.spinner.hide();

        });
        // }
      }

    } else {
      this.productionarticalData = false;
    }

  }



  cancelform() {
    let data = this.route.snapshot.paramMap.get('STNO');
    this.router.navigate(['/stocktransfer', { STNO: data }]);
    this.formrestvalue();
  }

  formrestvalue() {
    let i;
    if (this.ArticleSelectedColor.length > 0) {
      for (i = 0; i < this.ArticleSelectedColor.length; i++) {
        this.noofpackcount = true;
        const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
        const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

        this.stocktransfer.removeControl(inputname);
        this.stocktransfer.removeControl(inputname2);
      }
    }

    if (this.ProductionArticleSelectedColor.length > 0) {
      for (i = 0; i < this.ProductionArticleSelectedColor.length; i++) {
        this.productionnoofpackcount = true;
        const inputname = 'ProductionNoPacks_' + this.ProductionArticleSelectedColor[i]['Id'];
        const inputname2 = 'ProductionNoPacksNew_' + this.ProductionArticleSelectedColor[i]['Id'];

        this.stocktransfer.removeControl(inputname);
        this.stocktransfer.removeControl(inputname2);
      }
    }



    let data = this.route.snapshot.paramMap.get('STNO');
    if (data == "ADD") {
      this.stocktransfer.controls['Remarks'].reset();
      //  this.stocktransfer.controls['GST'].reset();
      //  this.stocktransfer.controls['GST_Percentage'].reset();
      //  this.stocktransfer.controls['GSTType'].reset();
    }

    this.ArticleId = null;
    this.ProductionArticleId = null;
    this.stocktransfer.controls['ArticleId'].reset();
    this.stocktransfer.controls['ProductionArticleId'].reset();
    if (this.ArticleOpenFlagValue == 0) {
      this.stocktransfer.controls['ArticleSelectedColor'].reset();
      this.stocktransfer.controls['ArticleSelectedSize'].reset();
      this.stocktransfer.controls['ArticleRatio'].reset();
    }
    this.stocktransfer.controls['NoPacksNew'].reset();
    if (this.productionArticleOpenFlagValue == 0) {
      this.stocktransfer.controls['ProductionArticleSelectedColor'].reset();
      this.stocktransfer.controls['ProductionArticleSelectedSize'].reset();
      this.stocktransfer.controls['ProductionArticleRatio'].reset();
    }
    // this.stocktransfer.controls['OutwardWeight'].reset();
    //alert(this.OutwardPartyDiscount);
    // this.stocktransfer.controls['PartyDiscount'].reset(this.OutwardPartyDiscount);
    this.ArticleRatio = '';
    this.AddArticle = true;
    this.hideElement = true;
    this.ArticleOpenFlag = true;
    this.productionArticleOpenFlag = true;
    // this.OutwardWeightOpenFlag = false;

    this.ArticleSelectedColor = [];
    this.ProductionArticleSelectedColor = [];
    this.ArticleSelectedSize = [];
    this.colorcountdown = [];

    this.articalData = false;

  }

  public delete(id, type) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    //debugger
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {
        this.userService.deletestocktransfer(id, type , item[0].Id).subscribe((res) => {
          if (res) {
            if (type == 1) {
              this.toastr.success('Success', 'Stock Transfer Delete Successfully');
              this.getOWList(this.route.snapshot.paramMap.get('STNO'));

            } else {
              this.toastr.success('Success', 'Stock Shortage Delete Successfully');
              this.getshortage();

            }
            this.router.navigate(['/stocktransfer', { STNO: this.route.snapshot.paramMap.get('STNO') }]);
            this.formrestvalue();

          }
        });
      } else {

      }
    });
  }

  getOWList(STNO) {

  
    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 25);
      //add new call
      const that = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        columnDefs: [{
          "targets": 'no-sort',
          "orderable": false,
        }], "order": [[1,"desc"]],

        ajax: (dataTablesParameters: any, callback) => {
          that.http.post<DataTablesResponse>(
              this.ApiURL+`/stocktransferlistfromstno/${STNO}`,
              dataTablesParameters, {}
            ).subscribe(resp => {
              that.stocktransferlist = resp.data;
              that.shortagetransferlist = resp.data;
              console.log('sadsad', resp.data)
              that.startnumber = resp.startnumber;
              this.spinner.hide();
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: []
              });
            });
        },
        columns: [{ data: 'No' }, { data: 'Name' },{ data: 'ArticleNumber' }, { data: 'ReturnNoPacks' },{data:'CreatedDate' },{ data: 'Action' }]

        // columns: [{ data: 'No' }, { data: 'GRN' },{ data: 'VendorName' }, { data: 'ArticleNumber' },{data:'Category' },{data:'Pieces' },{data:'CreatedDate' },{ data: 'Action' }]
      };
      //end

    } else {
      this.spinner.hide();
    }

    this.userService.stocktransferfromstno(STNO).subscribe((res) => {
      if (res["length"] > 0) {
        this.editarray = {
          StocktransferDate: res[0].StocktransferDate,
          Remarks: res[0].Remarks
        }

        this.ST_Number = res[0].StocktransferNumber;
        this.ST_Number_FinancialYear = res[0].ST_Number_FinancialYear;
        this.stocktransfer.patchValue(this.editarray);
      }
    });


  
  }

  getshortage() {
    let STNO = this.route.snapshot.paramMap.get('STNO');
    this.userService.stockshortagelistfromstno(STNO).subscribe((res) => {
      const data = res;
      if (typeof this.dtElement2 !== 'undefined' && typeof this.dtElement2.dtInstance !== 'undefined') {
        this.dtElement2.dtInstance.then((dtInstance2: DataTables.Api) => {
          // Destroy the table first
          dtInstance2.destroy();
          this.shortagetransferlist = data;
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();         
           this.spinner.hide();
        });
      } else {
        setTimeout(() => {
          this.shortagetransferlist = data;
          this.dtTrigger.next();
          this.spinner.hide();
        }, 100);

      }

    }, (errror => {
      this.spinner.hide();
      console.log(errror);
    }));
  }

  TotalQualityPeace() {
    let i;
    if (this.ArticleSelectedColor !== null) {
      if (this.ArticleSelectedColor.length > 0) {
        this.totalQuantity = 0;
        this.totalqualityLength = true;
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];
          if (this.stocktransfer.controls[inputname].value !== null && this.stocktransfer.controls[inputname].value != "") {
            this.totalQuantity += parseInt(this.stocktransfer.controls[inputname].value);
          }
        }

        this.noofpackcount = true;
        // alert(this.totalQuantity);

        $(".totalquality").text(this.totalQuantity);


      }
    }
  }


  TotalQualityPeaceProduction() {
    let i;
    if (this.ProductionArticleSelectedColor !== null) {
      if (this.ProductionArticleSelectedColor.length > 0) {
        this.productiontotalQuantity = 0;
        this.totalqualityLength = true;
        for (i = 0; i < this.ProductionArticleSelectedColor.length; i++) {
          this.productionnoofpackcount = true;
          const inputname = 'ProductionNoPacksNew_' + this.ProductionArticleSelectedColor[i]['Id'];
          if (this.stocktransfer.controls[inputname].value !== null && this.stocktransfer.controls[inputname].value != "") {
            this.productiontotalQuantity += parseInt(this.stocktransfer.controls[inputname].value);
          }
        }

        this.productionnoofpackcount = true;
        // alert(this.totalQuantity);

        $(".productiontotalquality").text(this.productiontotalQuantity);


      }
    }
  }

  onchangesets(id) {

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

  // Initicate user add
  doStocktransfer() {
    {
      document.getElementById('submit-button').setAttribute('disabled', 'true');
      this.spinner.show();
      let userdata = JSON.parse(localStorage.getItem('logindata'));

      if (this.route.snapshot.paramMap.get('id')) {
        this.stocktransfer.value.id = this.route.snapshot.paramMap.get('id');
        this.stocktransfer.value.UserId = userdata[0].Id;
        this.stocktransfer.value.ArticleOpenFlag = this.ArticleOpenFlagValue;
        this.stocktransfer.value.productionArticleOpenFlag = this.productionArticleOpenFlagValue;
        this.stocktransfer.value.productionArticleOpenFlagValue = this.productionArticleOpenFlagValue;
        // Validation code
        let source = Number($(".totalquality").text());
        let sourceno = Number(this.GETNOPACKS);
        let production = Number($("#isproduction").text());
        let productionno = Number(this.ProductionGETNOPACKS);
        if (this.stocktransferflag == true) {
          //Stock transfer updation
          this.stocktransfer.value.ProductionArticleId = this.ProductionArticleId;
          this.stocktransfer.value.ProductionArticleOpenFlag = this.productionArticleOpenFlagValue;
          this.stocktransfer.value.ArticleId = this.ArticleId
          if ((source != 0 || sourceno != 0) && (production != 0 || productionno != 0)) {
            if ((source != 0 || sourceno != 0) && (production != 0 || productionno != 0)
              && (source == production && source != 0 && production != 0) || (sourceno == productionno && sourceno != 0 && productionno != 0) || (sourceno == production && sourceno != 0 && production != 0) || (source == productionno && source != 0 && productionno != 0)) {
              this.userService.updateStockTransfer(this.stocktransfer.value).subscribe(
                userdata => {
                  this.spinner.hide();
                  document.getElementById('submit-button').removeAttribute('disabled');
                  this.successupdate(userdata, 1);
                }
              );
              this.spinner.hide();
              document.getElementById('submit-button').removeAttribute('disabled');
              // this.toastr.error('Sucess', 'OK');
            } else {
              this.spinner.hide();
              document.getElementById('submit-button').removeAttribute('disabled');
              this.toastr.error('Failed', 'No of pieces Source is not equal to Destination pieces');

            }
          } else {

            this.spinner.hide();
            document.getElementById('submit-button').removeAttribute('disabled');
            this.toastr.error('Failed', 'No of piecesis is zero,Please add the No of pieces');

          }
        } else {
          //Shortage updation


          // if (source != 0 || sourceno != 0) {
          //   this.userService.updateOutward(this.stocktransfer.value).subscribe(
          //     userdata => {
          //       this.spinner.hide();
          //       this.success(userdata, 2);
          //       document.getElementById('submit-button').removeAttribute('disabled');
          //     }
          //   );
          //   this.spinner.hide();
          //   document.getElementById('submit-button').removeAttribute('disabled');
          //   //this.toastr.error('Sucess', 'OK');
          // } else {
          //   this.spinner.hide();
          //   document.getElementById('submit-button').removeAttribute('disabled');
          //   this.toastr.error('Failed', 'No of piecesis is zero,Please add the No of pieces');

          // }

        }

      } else {
        this.stocktransfer.value.StocktransferNumberId = this.route.snapshot.paramMap.get('STNO');
        this.stocktransfer.value.UserId = userdata[0].Id;
        this.stocktransfer.value.ArticleOpenFlag = this.ArticleOpenFlagValue;
        this.stocktransfer.value.ArticleId = this.ArticleId.ArticleId ? this.ArticleId.ArticleId : this.ArticleId.Id;
        // Validation code
        let source = Number($(".totalquality").text());
        let sourceno = Number(this.GETNOPACKS);
        let production = Number($("#isproduction").text());
        let productionno = Number(this.ProductionGETNOPACKS);
        if (this.stocktransferflag == true) {
          if (this.ProductionArticleId.Id) {
            this.stocktransfer.value.ProductionArticleId = this.ProductionArticleId.Id;
            this.stocktransfer.value.ProductionArticleOpenFlag = this.productionArticleOpenFlagValue;

            if ((source != 0 || sourceno != 0) && (production != 0 || productionno != 0)) {

              if ((source != 0 || sourceno != 0) && (production != 0 || productionno != 0)
                && (source == production && source != 0 && production != 0) || (sourceno == productionno && sourceno != 0 && productionno != 0) || (sourceno == production && sourceno != 0 && production != 0) || (source == productionno && source != 0 && productionno != 0)) {
                this.userService.dostocktransferadd(this.stocktransfer.value).subscribe(
                  userdata => {
                    this.spinner.hide();
                    this.success(userdata, 1);

                    document.getElementById('submit-button').removeAttribute('disabled');
                  }
                );
                this.spinner.hide();
                document.getElementById('submit-button').removeAttribute('disabled');
                // this.toastr.error('Sucess', 'OK');
              } else {
                this.spinner.hide();
                document.getElementById('submit-button').removeAttribute('disabled');
                this.toastr.error('Failed', 'No of pieces Source is not equal to Destination pieces');

              }
            } else {
              this.spinner.hide();
              document.getElementById('submit-button').removeAttribute('disabled');
              this.toastr.error('Failed', 'No of piecesis is zero,Please add the No of pieces');

            }
          } else {
            this.spinner.hide();
            document.getElementById('submit-button').removeAttribute('disabled');
            this.toastr.error('Failed', 'Production data is not selected');
          }

        } else {
          if (source != 0 || sourceno != 0) {
            this.userService.dostocktransferadd(this.stocktransfer.value).subscribe(
              userdata => {
                this.spinner.hide();
                this.success(userdata, 1);
                document.getElementById('submit-button').removeAttribute('disabled');
              }
            );
            this.spinner.hide();
            document.getElementById('submit-button').removeAttribute('disabled');
          } else {
            this.spinner.hide();
            this.toastr.error('Failed', 'No of piecesis is zero,Please add the No of pieces');
            document.getElementById('submit-button').removeAttribute('disabled');
          }

        }
        // this.spinner.hide();
      }

    }

  }
  // User Add success function
  success(data, flag) {
    if (data.id != "") {
      //this.router.navigate(['/outwardlist']);
      let stnumberId = "";
      if (flag == 1) {
        this.toastr.success('Success', 'Stock transfer Add Successfully');
        stnumberId = data.StocktransferNumberId;
        this.DropdownSO = false;
      } else {
        this.toastr.success('Success', 'Stock transfer Update Successfully');
        stnumberId = this.route.snapshot.paramMap.get('STNO');
        this.DropdownSO = false;
      }
      this.StocktransferOrderLabel = true;
      this.router.navigate(['/stocktransfer', { STNO: stnumberId }]);
      if (this.stocktransferflag == true) {
        this.getOWList(stnumberId);
      } else {
        this.getshortage();
      }
      this.formrestvalue();
    } else if (data.NoOfSetNotMatch == "true") {
      this.toastr.error('Failed', 'No of pieces greater than original value');
    } else if (data.ProductionNoOfSetNotMatch == "true") {
      this.toastr.error('Failed', 'Production No of pieces greater than original value');
    } else if (data.ZeroNotAllow == "true") {
      this.toastr.error('Failed', 'Zero value not allow for "no of pieces"');
    } else if (data.ProductionZeroNotAllow == "true") {
      this.toastr.error('Failed', 'Production Zero value not allow for "no of pieces"');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  error() {
    this.toastr.error('Failed', 'Please enter valid value');
  }
  goBack() {
    window.history.back();
  }

  edit(id) {
    this.resetdata(1)
    $(".totalquality").text(0);
    this.GETNOPACKS = 0;
    this.spinner.show();
    this.articalData = true;
    this.AddArticle = false;
    this.productionarticalData = true;
    this.stocktransfer.controls['ProductionArticleId'].enable();
    this.stocktransfer.get('ArticleId').clearValidators()
    this.userService.getstocktransferidwise(id).subscribe((res) => {
      this.SourceArticleCategory = res[0].ConsumedTitle;
      this.DesArticleCategory = res[0].TransferTitle
      this.ProArticleNumber = res[0].TransferArticleNumber
      this.ArticleNumber = res[0].ConsumedArticleNumber
      this.ProductionArticleId = res[0].TransferArticleId
      this.ArticleId = res[0].ConsumedArticleId
      if (res[0].ConsumedArticleOpenFlag == 0) {
        //Consumption
        this.sets_label = "Pieces";
        this.ArticleOpenFlag = true;
        this.ArticleOpenFlagValue = res[0].ConsumedArticleOpenFlag;
        this.Disabled = true;

        this.ArticleSelectedColor = JSON.parse(res[0].ConsumedArticleColor);
        this.ArticleSelectedSize = JSON.parse(res[0].ConsumedArticleSize);

        this.ArticleRatio = res[0].ConsumeArticleRatio;
        //Production
        $("#isproduction").text(0);
        this.ProductionGETNOPACKS = 0;

        this.ProductionArticleDisabled = false;
        //Consumption
        let assignnopacks = {};
        if (res[0].ConsumeColorflag == 1) {
          this.noofpackcount = true;
          this.colorcountdown = this.ArticleSelectedColor;
          let i;
          var Count1 = Object.keys(this.colorcountdown).length;
          var nameArr = res[0].ConNoPacks.split(',');
          var connameArr = res[0].ConsumedNoPacks.split(',')
          let generatenopack;
          let congeneratenopack;
          for (i = 0; i < Count1; i++) {
            generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
            congeneratenopack = 'NoPacksNew_' + this.colorcountdown[i]['Id'];
            assignnopacks[generatenopack] = nameArr[i];
            assignnopacks[congeneratenopack] = connameArr[i];
            this.stocktransfer.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
            this.stocktransfer.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());
            this.totalqualityLength = true;
            this.myFormValueChanges$ = this.stocktransfer.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
            this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
          }
        } else {
          this.totalqualityLength = false;
          this.noofpackcount = false;
          this.stocktransfer.addControl('NoPacks', new FormControl());
          this.NoPacks = res[0].ConNoPacks;
          this.GETNOPACKS = res[0].ConsumedNoPacks;
        }
        this.stocktransfer.patchValue(assignnopacks);
      } else {
        this.GETNOPACKS = res[0].ConsumedNoPacks;
        this.sets_label = "pieces";
        this.ArticleOpenFlag = false;
        this.totalqualityLength = false;
        this.noofpackcount = false;
        this.ArticleOpenFlagValue = res[0].ConsumedArticleOpenFlag;
        this.stocktransfer.addControl('NoPacks', new FormControl());
        this.NoPacks = res[0].ConNoPacks;
      }
      //Prodution
      if (res[0].TransferArticleOpenFlag == 0) {
        this.sets_label = "Pieces";
        this.productionArticleOpenFlag = true;
        this.productionArticleOpenFlagValue = res[0].TransferArticleOpenFlag;
        this.Disabled = true;
        this.ProductionArticleSelectedColor = JSON.parse(res[0].TransferArticleColor);
        this.ProductionArticleSelectedSize = JSON.parse(res[0].TransferArticleSize);
        this.ProductionArticleRatio = res[0].TransferArticleRatio;
        let proassignnopacks = {};
        if (res[0].TransferColorflag == 1) {
          this.productionnoofpackcount = true;
          this.productioncolorcountdown = this.ProductionArticleSelectedColor;
          let i;
          var Count1 = Object.keys(this.productioncolorcountdown).length;
          var pronameArr = res[0].ProSalesNoPacks.split(',');
          var tranameArr = res[0].TransferNoPacks.split(',');
          let progeneratenopack;
          let trageneratenopack;
          for (i = 0; i < Count1; i++) {
            progeneratenopack = 'ProductionNoPacks_' + this.productioncolorcountdown[i]['Id'];
            proassignnopacks[progeneratenopack] = pronameArr[i];
            trageneratenopack = 'ProductionNoPacksNew_' + this.productioncolorcountdown[i]['Id'];
            proassignnopacks[trageneratenopack] = tranameArr[i];
            this.stocktransfer.addControl('ProductionNoPacks_' + this.productioncolorcountdown[i]['Id'], new FormControl());
            this.stocktransfer.addControl('ProductionNoPacksNew_' + this.productioncolorcountdown[i]['Id'], new FormControl());

            this.productiontotalqualityLength = true;
            this.myFormValueChanges$ = this.stocktransfer.controls['ProductionNoPacksNew_' + this.productioncolorcountdown[i]['Id']].valueChanges;
            // subscribe to the stream so listen to changes on units
            this.myFormValueChanges$.subscribe(units => this.TotalQualityPeaceProduction());
          }
        } else {
          this.productiontotalqualityLength = false;
          this.productionnoofpackcount = false;
          this.stocktransfer.addControl('ProductionNoPacks', new FormControl());
          this.ProductionNoPacks = res[0].ProSalesNoPacks;
          this.ProductionGETNOPACKS = res[0].TransferNoPacks
        }
        this.stocktransfer.patchValue(proassignnopacks);
      } else {
        this.ProductionGETNOPACKS = res[0].TransferNoPacks
        this.sets_label = "pieces";
        this.productionArticleOpenFlag = false;
        this.productiontotalqualityLength = false;
        this.productionnoofpackcount = false;
        this.productionArticleOpenFlagValue = res[0].TransferArticleOpenFlag;
        this.stocktransfer.addControl('ProductionNoPacks', new FormControl());
        this.ProductionNoPacks = res[0].ProSalesNoPacks;
      }
      this.spinner.hide();
    });
  }

  successupdate(data, type) {
    if (data['status'] == "failed") {
      if (data['articleType'] == 0) {
        this.toastr.error('Failed', 'Stock is going minus in Source Article');
      }
      else {
        this.toastr.error('Failed', 'Stock is going minus in Destination Article');
      }
    }
    else {
      let stnumberId = "";
      this.toastr.success('Success', 'Stock transfer updated successfully');
      this.StocktransferOrderLabel = true;
      stnumberId = data['id'] ;
      this.router.navigate(['/stocktransfer', { STNO: stnumberId}]);
      if (this.stocktransferflag == true) {
        this.getOWList(stnumberId);
      } else {
        this.getshortage();
      }
      this.productionarticalData = false;
      this.formrestvalue();
    }
  }
}


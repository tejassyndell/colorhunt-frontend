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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


class Person {
  Id: number;
  OutwardNumber: string;
  SoNumber: string;
  Name: string;
  TotalOutwardPieces: string;
  TotalAmount: string;
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
  selector: 'app-outward',
  templateUrl: './outward.component.html',
  styleUrls: ['./outward.component.scss']
})
export class OutwardComponent implements OnInit {

  @ViewChild("myInputBox") myInputBox: ElementRef;
  @ViewChild(BarecodeScannerLivestreamComponent)
  barecodeScanner: BarecodeScannerLivestreamComponent;

  ApiURL: string = environment.apiURL;
  public outwardlist: Person[];
  public startnumber: any;


  barcodeValue;

  barcodediv: boolean = false;
  scannerbutton: boolean = false;
  scannerclosebutton: boolean = false;
  public colordropdown: any = [];
  public sizedropdown: any = [];
  public ratiodropdown: any = [];

  public editarray = {};
  public partypdown: any = [];
  public articaldown: any = [];
  accessdenied: boolean = true;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
  OutwardOrderLabel: boolean = false;
    dtTrigger: Subject<any> = new Subject<any>();

  dropdownSettings = {};
  outwordForm: FormGroup;
  partyaddForm: FormGroup;
  OutWordCurrentDate: Date;
  Status = 0;
  OutwardNumberId: any;
  DropdownSO: boolean = true;
  notAdmin : boolean = true;
  hideElement: boolean = true;
  articalData: boolean = false;
  OutwardWeightOpenFlag: boolean = false;
  Disabled = true;
  AddArticle = true;
  isEdit: any;
  isDelete: any;
  OW_Number: any;
  OW_Number_FinancialYear: any;
  SO_Number: any;
  ArtDisabled: boolean = false;
  noofpackcount: boolean = true;
  public colorcountdown = [];
  ArticleNumber: any;
  ArticleOpenFlag: boolean = true;
  ArticleOpenFlagValue: any;
  sets_label: any;
  isDeleteandEdit: boolean = true;

  dropdownList = [];
  ArticleSelectedColor = [];
  ArticleSelectedSize = [];
  ArticleRatio: any;
  colorflag: any;
  NoPacks: any;
  OutwardBox: any;
  ArticleNoPacks: any;
  GETNOPACKS: any;
  SOPAGE: any;
  getuserdata: any;
  UserWiseData: boolean = true;
  public remainingso: any = [];
  ArticleRate: any;
  OutwardWeight: any;
  isList: any;
  isAdd: any;
  ArticleId: any;
  myFormValueChanges$;
  totalQuantity: number = 0;
  totalqualityLength: boolean = false;
  PartyDiscount: number = 0;
  OutwardPartyDiscount: number = 0;
  value: string;
  isError = false;
  GSTType: string = 'GST';
  totalpiecesflag: boolean = false;
  Category:any;
  dateDisabled:boolean = false;
 

  //statusdispaly:boolean=false;
  constructor(private http: HttpClient, private el: ElementRef, private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("Add Outward | Colorhunt");
    this.outwordForm = this.formBuilder.group({
      OutwardNumberId: [''],
      OutwardDate: ['', [Validators.required]],
      SoId: ['', [Validators.required]],
      PartyId: [''],
      Name: [''],
      Destination: [''],
      Transporter: [''],
      GST: [''],
      GST_Percentage: ['', [Validators.min(0), Validators.max(50)]],
      GSTType: [''],
      Discount: [0, [ Validators.min(0), Validators.max(10)]],
      Discount_amount: [0, [ Validators.min(0), Validators.max(5000)]],
      // PartyDiscount_amount : [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      Remarks: [''],
      ArticleId: ['', [Validators.required]],
      ArticleSelectedColor: [''],
      ArticleSelectedSize: [''],
      ArticleRatio: [''],
      PartyDiscount: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      OutwardBox: ['', [Validators.required]],
      OutwardRate: ['', [Validators.required]],
      OutwardWeight: [''],
      NoPacks: [''],
      NoPacksNew: [''],
      Category:['']
    });

    this.partyaddForm = this.formBuilder.group({
      PartyName: ['', [Validators.required]],
      PartyContact: ['', [Validators.required]],
      PartyAddress: ['', [Validators.required]]
    });

    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }



  ngOnInit() {
    // setTimeout(() => {
    //   // const ele = this.el.nativeElement["OutwardBox"];
    //   // if (ele) {
    //   //   ele.focus();
    //   // }
    //   // alert("asdas");



    //   //  this.myInputBox.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    //     this.myInputBox.nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: 'nearest' });
    //     setTimeout(() => {
    //     this.myInputBox.nativeElement.focus();
    //   }, 1000);
    //   // this.renderer.invokeElementMethod(this.el.nativeElement["myInputBox"],
    //   //   'focus');
    // }, 10000);


    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (item[0].Role == 2) {
      this.notAdmin = false ;
      this.dateDisabled = false;
    } else {
      this.notAdmin = true ;
      this.dateDisabled = true;
    }
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
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
      this.outwordForm.value.OutwardDate = this.OutWordCurrentDate
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

      this.userService.outwardpartylist().subscribe((res) => {
        this.partypdown = res;
      });

      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }
      this.userService.remainingso([year, month, day].join('-')).subscribe((res) => {
        this.remainingso = res;
      });
      let data = this.route.snapshot.paramMap.get('OWNO');
      let get_id = this.route.snapshot.paramMap.get('id');
      if (data == "Add") {
        this.OutwardOrderLabel = false;
      } else {
        this.OutwardNumberId = data;
        this.OutwardOrderLabel = true;
        this.DropdownSO = false;
        this.scannerbutton = true;
      }

      if (data != "" && data != undefined) {
        this.SOPAGE = "Edit";
        this.OW_Number = data;
        this.getOWList(this.OW_Number);
        if (get_id !== null) {
          setTimeout(() => {
            this.edit(get_id);
          }, 1000);
        }
      }



    }
  }


  onError(error) {
    console.error(error);
    this.isError = true;
  }

  selectdatewiseso() {
    if(this.outwordForm.value.OutwardDate){
      this.userService.remainingso(this.outwordForm.value.OutwardDate).subscribe((res) => {
        this.remainingso = res;
      });
    }
  }

  barcodeclick() {
    $(".barcodediv").show();

    //this.barcodediv = true;
    this.barecodeScanner.start();
    this.scannerclosebutton = true;
    this.scannerbutton = false;

    // setTimeout(() => this.spinner.hide(), 25);
    // setTimeout(() => this.spinner.hide(), 100);
    // setTimeout(() => this.spinner.hide(), 500);
    setTimeout(() => this.spinner.hide(), 1000);
  }
  ngAfterViewInit() {
    //this.barecodeScanner.stop();
  }

  barcodescanclose() {
    this.barecodeScanner.stop();
    $(".barcodediv").hide();
    this.scannerclosebutton = false;
    this.scannerbutton = true;
    setTimeout(() => this.spinner.hide(), 25);
    setTimeout(() => this.spinner.hide(), 100);
    setTimeout(() => this.spinner.hide(), 500);
    setTimeout(() => this.spinner.hide(), 1000);
  }

  onValueChanges(result) {
    this.barcodeValue = result.codeResult.code;

    //alert("Article Number is "+this.barcodeValue);
    // this.onChangartical(21);
    var Count = Object.keys(this.articaldown).length;
    let i;
    for (i = 0; i < Count; i++) {
      if (this.articaldown[i].ArticleNumber == this.barcodeValue) {
        this.onChangartical(this.articaldown[i].ArticleId);
        // this.getsoarticledata(this.articaldown[i].ArticleId, 0);

        // this.editarray = {
        //   ArticleId: this.articaldown[i].ArticleId
        // }

        // this.outwordForm.patchValue(this.editarray);
        // this.ArticleNumber = this.articaldown[i].ArticleNumber;
        this.ArticleId = { ArticleId: this.articaldown[i].ArticleId, ArticleNumber: this.articaldown[i].ArticleNumber };
        this.barecodeScanner.stop();
        this.scannerclosebutton = false;
        this.scannerbutton = true;
        setTimeout(() => {
          this.myInputBox.nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: 'nearest' });
          setTimeout(() => {
            this.myInputBox.nativeElement.focus();
          }, 1000);
        }, 2000);

        //alert(this.ArticleId);
        setTimeout(() => this.spinner.hide(), 25);
        $(".barcodediv").hide();
        return false;
      }
    }

    alert("Article " + this.barcodeValue + " is not Found in Sales Order");
    // this.colordropdown = articlecolor_dropdown;

    //alert(this.barcodeValue);
  }

  onStarted(started) {
    // console.log(started);
  }


  onChangeSONumber(event) {
    if (event.target.value != "") {
      this.spinner.show();
      const newVal = event.target.value;
      const OWNO_number = this.route.snapshot.paramMap.get('OWNO');

      let i;
      if (this.ArticleSelectedColor.length > 0) {
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
          const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

          this.outwordForm.removeControl(inputname);
          this.outwordForm.removeControl(inputname2);
        }
      }
      this.outwordForm.controls['ArticleId'].reset();
      this.outwordForm.controls['ArticleSelectedColor'].reset();
      this.outwordForm.controls['ArticleSelectedSize'].reset();
      this.outwordForm.controls['ArticleRatio'].reset();
      this.outwordForm.controls['NoPacksNew'].reset();
      this.outwordForm.controls['OutwardBox'].reset();
      this.outwordForm.controls['OutwardRate'].reset();
      this.outwordForm.controls['OutwardWeight'].reset();
      this.outwordForm.controls['GST'].reset();
      this.outwordForm.controls['GST_Percentage'].reset();
      this.outwordForm.controls['GSTType'].reset();
      this.outwordForm.controls['PartyDiscount'].reset();
      // this.outwordForm.controls['PartyDiscount_amount'].reset();
      this.outwordForm.controls['Remarks'].reset();
      // this.outwordForm.controls['PartyDiscount'].reset(this.OutwardPartyDiscount);

      this.ArticleSelectedColor = [];
      this.ArticleSelectedSize = [];
      this.colorcountdown = [];
      this.scannerbutton = true;

      this.userService.getsodata(OWNO_number, newVal).subscribe((res) => {
        this.getdatafromso(res);
        // console.log('Data',res)
      });

      this.spinner.hide();
    } else {
      this.formrestvalue();
      this.scannerbutton = false;
      this.articaldown = [];
    }
  }

  getdatafromso(res) {
    if (res.BasicDetails.length > 0) {
      //alert(res.BasicDetails[0].GSTType);
      let data = this.route.snapshot.paramMap.get('OWNO');
      if (data == "Add") {
        this.editarray = {
          PartyId: res.BasicDetails[0].PartyId,
          Name: res.BasicDetails[0].Name,
          Transporter: res.BasicDetails[0].Transporter,
          Destination: res.BasicDetails[0].Destination,
          PartyDiscount: res.BasicDetails[0].PartyDiscount,
          // PartyDiscount_amount: res.BasicDetails[0].PartyDiscount_amount,
          GSTType: res.BasicDetails[0].GSTType,
          GST: res.BasicDetails[0].GSTAmount,
          GST_Percentage: res.BasicDetails[0].GSTPercentage,
          Remarks: res.BasicDetails[0].Remarks,

        }

        this.GSTType = res.BasicDetails[0].GSTType;
      } else {

        this.editarray = {
          PartyId: res.BasicDetails[0].PartyId,
          Name: res.BasicDetails[0].Name,
          Transporter: res.BasicDetails[0].Transporter,
          Destination: res.BasicDetails[0].Destination,
          PartyDiscount: res.BasicDetails[0].PartyDiscount,
          // PartyDiscount_amount: res.BasicDetails[0].PartyDiscount_amount,
          GSTType: this.GSTType,
          GST: res.BasicDetails[0].GSTAmount,
          GST_Percentage: res.BasicDetails[0].GSTPercentage,
          Remarks: res.BasicDetails[0].Remarks,
        }
      }

      this.OutwardPartyDiscount = res.BasicDetails[0].PartyDiscount;
      // this.OutwardPartyDiscount_amount = res.BasicDetails[0].PartyDiscount_amount;
      this.AddArticle = true;
      this.articaldown = res.Articles;


      this.outwordForm.patchValue(this.editarray);
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 4) {
          let parameterInnerId = this.route.snapshot.paramMap.get('id');
          let parameterId = this.route.snapshot.paramMap.get('OWNO');
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
        if (data[i].PageId == 4) {
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

  SONumberAssign(res) {
    this.OW_Number = res.OutwardNumberId;
    this.OW_Number_FinancialYear = res.OW_Number_FinancialYear;
    this.OutwardNumberId = res.Id;
    this.router.navigate(['/so', { SONO: this.OW_Number }]);
    this.getOWList(this.OutwardNumberId);
  }

  onChangartical(event) {

    if (event !== undefined && event !== null) {
      this.spinner.show();
      this.articalData = true;

      if (event.ArticleId !== undefined) {
        var newVal = event.ArticleId;
      } else {
        var newVal = event;
      }


      if (this.route.snapshot.paramMap.get('id') === null) {
        this.getsoarticledata(newVal, 0);
      }
      //this.getsoarticledata(newVal);


    } else {
      this.articalData = false;
    }

  }

  getsoarticledata(newVal, OutwardId) {
    this.userService.getsoarticledata($("#SoId").val(), newVal, OutwardId).subscribe((res) => {
      if (res[0].ArticleOpenFlag == 0) {
        this.sets_label = "Pieces";
        this.ArticleOpenFlag = true;
        this.OutwardWeightOpenFlag = false;
        this.articalData = true;
        this.Disabled = true;
        this.ArticleSelectedColor = [];
        this.ArticleSelectedSize = [];
        this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
        this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
        this.OutwardBox = res[0].OutwardBox;
        this.ArticleRatio = res[0].ArticleRatio;
        this.ArticleNumber = res[0].ArticleNumber;
        this.Category = res[0].Category;
        //alert(OutwardId);
        if (this.route.snapshot.paramMap.get('id') === null) {
          this.ArticleRate = res[0].ArticleRate;
        } else {
          this.ArticleRate = res[0].OutwardRate;
          this.PartyDiscount = res[0].PartyDiscount;
          // this.PartyDiscount_amount = res[0].PartyDiscount_amount;
          //alert(this.PartyDiscount);
        }

        let assignnopacks = {};
        let assignnopacksnew = {};
        this.colorcountdown = [];

        this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;

        if (res[0].Colorflag == 1) {
          this.noofpackcount = true;
          this.totalpiecesflag = true;
          this.colorcountdown = this.ArticleSelectedColor;
          let i;
          var Count1 = Object.keys(this.colorcountdown).length;
          var nameArr = res[0].SalesNoPacks.split(',');
          if (this.route.snapshot.paramMap.get('id') !== null) {
            var nameNopacksArr = this.GETNOPACKS.split(',');
          }


          let generatenopack;
          let generatenopacknew;
          for (i = 0; i < Count1; i++) {
            generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
            generatenopacknew = 'NoPacksNew_' + this.colorcountdown[i]['Id'];
            assignnopacks[generatenopack] = nameArr[i];
            if (this.route.snapshot.paramMap.get('id') !== null) {
              assignnopacksnew[generatenopacknew] = nameNopacksArr[i];
            }

            this.outwordForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
            this.outwordForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());

            this.totalqualityLength = true;
            this.myFormValueChanges$ = this.outwordForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
            // subscribe to the stream so listen to changes on units
            this.outwordForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].reset();
            this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
          }

        } else {
          this.totalqualityLength = false;
          this.noofpackcount = false;
          this.outwordForm.addControl('NoPacks', new FormControl());
          this.outwordForm.addControl('NoPacksNew', new FormControl());
          this.NoPacks = res[0].SalesNoPacks;
          this.GETNOPACKS = this.GETNOPACKS;
        }


        this.outwordForm.patchValue(assignnopacks);
        if (this.route.snapshot.paramMap.get('id') !== null) {
          this.outwordForm.patchValue(assignnopacksnew);
        }

      }
      else {
        this.sets_label = "pieces";
        this.ArticleOpenFlag = false;
        this.totalqualityLength = false;
        this.OutwardWeightOpenFlag = true;
        this.noofpackcount = false;
        this.articalData = true;
        this.OutwardBox = res[0].OutwardBox;
        this.Category = res[0].Category;
        if (this.route.snapshot.paramMap.get('id') === null) {
          this.ArticleRate = res[0].ArticleRate;
        } else {
          this.ArticleRate = res[0].OutwardRate;
        }

        if (this.route.snapshot.paramMap.get('id') !== null) {
          this.PartyDiscount = res[0].PartyDiscount;
        }
        // if (this.route.snapshot.paramMap.get('id') !== null) {
        //   this.PartyDiscount_amount = res[0].PartyDiscount_amount;
        // }

        this.ArticleNumber = res[0].ArticleNumber;
        this.outwordForm.addControl('NoPacks', new FormControl());
        this.NoPacks = res[0].SalesNoPacks;
        this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
      }
      this.spinner.hide();
    });
  }

  // ngOnDestroy() {
  //   this.myFormValueChanges$.unsubscribe();
  // }

  cancelform() {
    let data = this.route.snapshot.paramMap.get('OWNO');
    this.router.navigate(['/outward', { OWNO: data }]);
    this.formrestvalue();
  }

  formrestvalue() {
    let i;
    if (this.ArticleSelectedColor.length > 0) {
      for (i = 0; i < this.ArticleSelectedColor.length; i++) {
        this.noofpackcount = true;
        const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
        const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

        this.outwordForm.removeControl(inputname);
        this.outwordForm.removeControl(inputname2);
      }
    }


    let data = this.route.snapshot.paramMap.get('OWNO');
    if (data == "ADD") {
      this.outwordForm.controls['PartyId'].reset([null]);
      this.outwordForm.controls['Destination'].reset();
      this.outwordForm.controls['Transporter'].reset();
      this.outwordForm.controls['GST'].reset();
      this.outwordForm.controls['GST_Percentage'].reset();
      this.outwordForm.controls['GSTType'].reset();
      this.outwordForm.controls['Remarks'].reset();
    }

    this.ArticleId = null;
    this.outwordForm.controls['ArticleId'].reset();
    if (this.ArticleOpenFlagValue == 0) {
      this.outwordForm.controls['ArticleSelectedColor'].reset();
      this.outwordForm.controls['ArticleSelectedSize'].reset();
      this.outwordForm.controls['ArticleRatio'].reset();
    }
    this.outwordForm.controls['NoPacksNew'].reset();
    this.outwordForm.controls['OutwardBox'].reset();
    this.outwordForm.controls['OutwardRate'].reset();
    this.outwordForm.controls['OutwardWeight'].reset();
    //alert(this.OutwardPartyDiscount);
    this.outwordForm.controls['PartyDiscount'].reset(this.OutwardPartyDiscount);
    // this.outwordForm.controls['PartyDiscount_amount'].reset(this.OutwardPartyDiscount_amount);
    this.ArticleRatio = '';
    this.AddArticle = true;
    this.hideElement = true;
    this.ArticleOpenFlag = true;
    this.OutwardWeightOpenFlag = false;

    this.ArticleSelectedColor = [];
    this.ArticleSelectedSize = [];
    this.colorcountdown = [];

    this.articalData = false;

  }

  public delete(id, ArticleId) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {
        this.userService.deleteoutward(id, ArticleId , item[0].Id).subscribe((res) => {
            // Re-render the DataTable
            if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.draw();
              
              });
            }
          if (res) {
            this.toastr.success('Success', 'Outward Delete Successfully');
            this.getOWList(this.route.snapshot.paramMap.get('OWNO'));
            this.router.navigate(['/outward', { OWNO: this.route.snapshot.paramMap.get('OWNO') }]);
            this.formrestvalue();
          }
        });
      } else {

      }
    });
  }

  getOWList(OWNO) {
    localStorage.setItem('OWNO', OWNO);

    this.userService.outwarddategstfromowno(OWNO).subscribe((res) => {
      if (res["length"] > 0) {


        //alert("112312 "+this.GSTType);
        this.userService.getsodata(OWNO, res[0].SoId).subscribe((res1) => {

          //res.Outwardstatus
          this.isDeleteandEdit = res1['Outwardstatus'];
          this.getdatafromso(res1);

          setTimeout(() => {
            this.editarray = {
              OutwardDate: res[0].OutwardDate,
              SoId: res[0].SoId,
              GST: res[0].GSTAmount,
              GST_Percentage: res[0].GSTPercentage,
              GSTType: res[0].GSTType,
              OutwardNumberId: res[0].OutwardNumber,
              Discount: res[0].Discount,
              Discount_amount: res[0].Discount_amount,
              Remarks: res[0].Remarks
            }

            this.GSTType = res[0].GSTType;
            this.OW_Number = res[0].OutwardNumber;
            this.SO_Number = res[0].SoNumber;
            this.OW_Number_FinancialYear = res[0].OW_Number_FinancialYear;
            this.outwordForm.patchValue(this.editarray);
          }, 200);

        });

        // this.editarray = {
        //   OutwardDate: res[0].OutwardDate,
        //   SoId: res[0].SoId,
        //   GST: res[0].GSTAmount,
        //   GST_Percentage: res[0].GSTPercentage,
        //   GSTType: res[0].GSTType,
        //   OutwardNumberId: res[0].OutwardNumber,
        //   Discount: res[0].Discount,
        //   Remarks: res[0].Remarks
        // }

        // this.GSTType = res[0].GSTType;
        // this.OW_Number = res[0].OutwardNumber;
        // this.SO_Number = res[0].SoNumber;
        // this.OW_Number_FinancialYear = res[0].OW_Number_FinancialYear;
        // this.outwordForm.patchValue(this.editarray);

      }
    });

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
          const data = localStorage.getItem('OWNO');
          that.http.post<DataTablesResponse>(
              this.ApiURL+`/outwardlistfromowno/${data}`,
              dataTablesParameters, {}
            ).subscribe(resp => {
              that.outwardlist = resp.data;
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


    // this.userService.outwardlistfromowno(OWNO).subscribe((res) => {
    //   const data = res;
    //   if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //       // Destroy the table first
    //       dtInstance.destroy();
    //       this.outwardlist = data;
    //       // Call the dtTrigger to rerender again
    //       this.dtTrigger.complete();
    //       this.spinner.hide();
    //     });
    //   } else {
    //     setTimeout(() => {
    //       this.outwardlist = data;
    //       this.dtTrigger.complete();
    //       this.spinner.hide();
    //     }, 100);

    //   }

    // });
  }

  public edit(id) {

    {
      this.spinner.show();
      this.DropdownSO = false;
      this.userService.getoutwardidwise(id).subscribe((res) => {
        if (this.route.snapshot.paramMap.get('id')) {
          this.AddArticle = false;
          this.hideElement = false;
        } else {
          this.AddArticle = true;
          this.hideElement = true;
        }


        if (res['length'] > 0) {

          this.editarray = {
            OutwardNumberId: res[0].OutwardNumberId,
            ArticleId: res[0].ArticleId,
            NoPacks: res[0].NoPacks
          }
          this.outwordForm.patchValue(this.editarray);
          this.OutwardNumberId = res[0].OutwardNumberId;
          this.OW_Number = res[0].OutwardNumber;
          this.OW_Number_FinancialYear = res[0].OutwardNumber;
          this.GETNOPACKS = res[0].NoPacks;
          this.OutwardWeight = res[0].OutwardWeight;

          //alert("OK");
          //alert(this.route.snapshot.paramMap.get('id'));
          this.getsoarticledata(res[0].ArticleId, this.route.snapshot.paramMap.get('id'));

          // setTimeout(() => {
          //   this.myInputBox.nativeElement.focus();
          //   this.myInputBox.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: 'nearest' });
          // }, 5000 );

          // this.userService.getsoarticledata($("#SoId").val(), res[0].ArticleId, this.route.snapshot.paramMap.get('id')).subscribe((res) => {
          //   if (res[0].ArticleOpenFlag == 0) {
          //     this.sets_label = "Pieces";
          //     this.ArticleOpenFlag = true;
          //     this.OutwardWeightOpenFlag = false;
          //     this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
          //     this.articalData = true;
          //     this.Disabled = true;
          //     this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
          //     this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
          //     this.OutwardBox = res[0].OutwardBox;
          //     this.ArticleRatio = res[0].ArticleRatio;
          //     this.ArticleNumber = res[0].ArticleNumber;
          //     this.ArticleRate = res[0].OutwardRate;
          //     let assignnopacks = {};
          //     let getdataassignnopacks = {};


          //     if (res[0].Colorflag == 1) {
          //       this.noofpackcount = true;
          //       this.colorcountdown = this.ArticleSelectedColor;
          //       let i;
          //       var Count1 = Object.keys(this.colorcountdown).length;
          //       var nameArr = res[0].SalesNoPacks.split(',');
          //       var nameNopacksArr = this.GETNOPACKS.split(',');

          //       let generatenopack;
          //       let getdatageneratenopack;
          //       for (i = 0; i < Count1; i++) {
          //         generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
          //         getdatageneratenopack = 'NoPacksNew_' + this.colorcountdown[i]['Id'];
          //         assignnopacks[generatenopack] = nameArr[i];
          //         getdataassignnopacks[getdatageneratenopack] = nameNopacksArr[i];
          //         this.outwordForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
          //         this.outwordForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());

          //         this.totalqualityLength = true;
          //         this.myFormValueChanges$ = this.outwordForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
          //         // subscribe to the stream so listen to changes on units
          //         this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
          //       }
          //     } else {
          //       this.totalqualityLength = false;
          //       this.noofpackcount = false;
          //       this.outwordForm.addControl('NoPacks', new FormControl());
          //       this.outwordForm.addControl('NoPacksNew', new FormControl());

          //       this.NoPacks = res[0].SalesNoPacks;
          //       this.GETNOPACKS = this.GETNOPACKS;
          //     }

          //     this.outwordForm.patchValue(assignnopacks);
          //     this.outwordForm.patchValue(getdataassignnopacks);
          //   } else {
          //     this.sets_label = "pieces";
          //     this.ArticleOpenFlag = false;
          //     this.totalqualityLength = false;
          //     this.OutwardWeightOpenFlag = true;
          //     this.noofpackcount = false;
          //     this.articalData = true;
          //     this.OutwardBox = res[0].OutwardBox;
          //     this.ArticleRate = res[0].OutwardRate;
          //     this.ArticleNumber = res[0].ArticleNumber;

          //     this.outwordForm.addControl('NoPacks', new FormControl());
          //     this.NoPacks = res[0].SalesNoPacks;
          //     this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
          //   }
          //   this.spinner.hide();

          // });

        }

      });

    }

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
          if (this.outwordForm.controls[inputname].value !== null && this.outwordForm.controls[inputname].value != "") {
            this.totalQuantity += parseInt(this.outwordForm.controls[inputname].value);
          }
        }

        this.noofpackcount = true;
        // alert(this.totalQuantity);

        $(".totalquality").text(this.totalQuantity);


      }
    }
  }

  onPercentageDiscountChange(event: any) {
    this.outwordForm.controls['Discount_amount'].setValue(null);

    let input;
    if (event.metaKey || event.ctrlKey) {
      return true;
    }
    if (event.which === 32) {
      return false;
    }
    if (event.which === 0) {
      return true;
    }
    if (event.which < 33) {
      return true;
    }
    input = String.fromCharCode(event.which);
    return !!/[\d\s]/.test(input);

  }
  
  onAmountDiscountChange(event: any) {
      this.outwordForm.controls['Discount'].setValue(null);
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

  dopartyaddform() {
    this.partyaddForm.value.SoAddParty = 0;
    this.userService.dopartyadd(this.partyaddForm.value).subscribe(
      userdata => {
        this.spinner.hide();
        this.toastr.success('Success', 'Party Add Successfully');
        this.router.navigate(['/outwardlist']);
      }
    );
  }

  // Initicate user add
  doOutword() {
    {
      document.getElementById('submit-button').setAttribute('disabled' ,'true');
      this.spinner.show();
      let userdata = JSON.parse(localStorage.getItem('logindata'));


      if (this.route.snapshot.paramMap.get('id')) {

        this.outwordForm.value.id = this.route.snapshot.paramMap.get('id');
        this.outwordForm.value.UserId = userdata[0].Id;
        this.outwordForm.value.ArticleOpenFlag = this.ArticleOpenFlagValue;
        this.outwordForm.value.OutwardRate  = this.ArticleRate


        // if(this.outwordForm.value.Discount != null || this.outwordForm.value.Discount != 0 || this.outwordForm.value.Discount != '0'){
        //   this.outwordForm.value.Discount = this.outwordForm.value.Discount;
        //   this.outwordForm.value.Discount_amount = 0;
        // }

        if(this.outwordForm.value.Discount == null || this.outwordForm.value.Discount == 0 || this.outwordForm.value.Discount == '0'){
          this.outwordForm.value.Discount_amount = this.outwordForm.value.Discount_amount;
          this.outwordForm.value.Discount = 0;
        }



        this.userService.updateOutward(this.outwordForm.value).subscribe(
          userdata => {
            this.spinner.hide();
              // Re-render the DataTable
              if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance.draw();
                
                });
              }
            this.success(userdata, 2);
            document.getElementById('submit-button').removeAttribute('disabled');
          }
        );
      } else {


        this.outwordForm.value.OutwardNumberId = this.route.snapshot.paramMap.get('OWNO');
        this.outwordForm.value.UserId = userdata[0].Id;
        this.outwordForm.value.ArticleOpenFlag = this.ArticleOpenFlagValue;
        this.outwordForm.value.ArticleId = this.ArticleId.ArticleId;
        this.userService.dooutwardadd(this.outwordForm.value).subscribe(
          userdata => {
            this.spinner.hide();
              // Re-render the DataTable
              if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance.draw();
                
                });
              }
            this.success(userdata, 1);
            document.getElementById('submit-button').removeAttribute('disabled');
          }
        );
      }

    }

  }
  // User Add success function
  success(data, flag) {
    if(!data.errorparty){
      if(!data.errorpartysales){
        if (data.id != "") {
          //this.router.navigate(['/outwardlist']);
          let ownumberId = "";
          if (flag == 1) {
            this.toastr.success('Success', 'Outward Add Successfully');
            ownumberId = data.OutwardNumberId;
            this.DropdownSO = false;
          } else {
            this.toastr.success('Success', 'Outward Update Successfully');
            ownumberId = this.route.snapshot.paramMap.get('OWNO');
            this.DropdownSO = false;
          }
          this.OutwardOrderLabel = true;
          this.router.navigate(['/outward', { OWNO: ownumberId }]);
          this.getOWList(ownumberId);
          this.formrestvalue();
        } else if (data.NoOfSetNotMatch == "true") {
          this.toastr.error('Failed', 'No of pieces greater than original value');
        } else if (data.ZeroNotAllow == "true") {
          this.toastr.error('Failed', 'Zero value not allow for "no of pieces"');
        } else {
          this.toastr.error('Failed', 'Please try agin later');
        }
      }
      else{
        this.toastr.error('Failed', 'Please assign sales person first to the party');
      }
    }
    else{
      this.toastr.error('Failed', 'This party is disabled');
    }

  }

  error() {
    this.toastr.error('Failed', 'Please enter valid value');
  }

  goBack (){
    window.history.back();
  }

}


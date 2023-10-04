import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


class Person {
  Id: number;
  OutletName:string;
  PartyName:string;
  TotalPieces:number;
  OutletDate:string;
  OutletNumber: string;
  Action:string
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}


@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public startnumber:  any;


  public colordropdown: any = [];
  public sizedropdown: any = [];
  public ratiodropdown: any = [];

  public editarray = {};
  public partypdown: any = [];
  public articaldown: any = [];
  public solist: Person[];
  accessdenied: boolean = true;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
  SalesOrderLabel: boolean = false;
    dtTrigger: Subject<any> = new Subject<any>();
  disebval: boolean = false;
  dropdownSettings = {};
  OutletForm: FormGroup;
  SoCurrentDate: Date;
  OutletNumberId: any;
  hideElement: boolean = true;
  articalData: boolean = false;
  Disabled = true;
  AddArticle = true;
  isEdit: any;
  isDelete: any;
  OTL_Number: any;
  Outlet_Number_FinancialYear: any;
  ArticleOpenFlag: boolean = true;
  noofpackcount: boolean = false;
  public colorcountdown = [];
  ArticleNumber: any;
  RoleId: any;
  artID: any;
  dropdownList = [];
  ArticleSelectedColor = [];
  ArticleSelectedSize = [];
  ArticleRatio: any;
  // colorflag: any;
  NoPacks: any;
  ArticleNoPacks: any;
  GETNOPACKS: any;
  SOPAGE: any;
  getuserdata: any;
  UserWiseData: boolean = true;
  ArticleOpenFlagValue: any;
  sets_label: any;
  Colorflag: any;
  isList: any;
  isAdd: any;
  ArticleRate: any;
  butDisabled: boolean = false;
  ArticleId: any;
  partyid: number = 0;
  allpartylist: any = [];
  accountpartyId: number = 0;
  totalqualityLength: boolean = false;
  myFormValueChanges$;
  totalQuantity: number = 0;
  Category:any;
  Discount_amount:any;
  dateDisabled:boolean = false;
  addressFeild:boolean = false;
  //statusdispaly:boolean=false;
  constructor( private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("Add Outlet | Colorhunt");
    this.OutletForm = this.formBuilder.group({
      OutletNumberId: [''],
      PartyId: ['', [Validators.required]],
      Date: ['', [Validators.required]],
      ArticleId: ['', [Validators.required]],
      ArticleRate: [''],
      Remarks: [''],
      NoPacks: [''],
      Discount_amount: [0, [ Validators.min(0), Validators.max(5000)]],
      NoPacksNew: [''],
      Colorflag: [''],
      OutletPartyId: ['', [Validators.required]],
      GSTAmount: [''],
      GSTPercentage: [''],
      Discount: [''],
      Address: [''],
      Contact: [''],
      ArticleSelectedColor: [''],
      ArticleSelectedSize: [''],
      ArticleRatio: [''],
      Category:['']
    });
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }

  ngOnInit() {
    this.Discount_amount = 20;
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
      setTimeout(() => this.spinner.show(), 10);

      this.sets_label = "Pieces";
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


      this.SoCurrentDate = new Date();
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


      if (item[0].Role == 2) {
        this.partyid = 0;
      } else {
        this.partyid = item[0].PartyId;

      }

      this.userService.getoutletparty(this.partyid).subscribe((res) => {
        this.partypdown = res;
        let PartyId = this.getuserdata[0].PartyId;
        let RoleId = this.getuserdata[0].Role;
        if (RoleId == 7) {
          this.editarray = {
            PartyId: PartyId
          }
          this.OutletForm.patchValue(this.editarray);
          this.disebval = true;
          this.userService.getarticleofoutlet(PartyId).subscribe((res) => {
            this.articaldown = res;
          });
        } else {
          this.disebval = false;
        }
      });

      this.userService.getparty().subscribe((res) => {
        this.allpartylist = res;
      });



      let data = this.route.snapshot.paramMap.get('OTLNO');
      let get_id = this.route.snapshot.paramMap.get('id');
      if (data == "Add") {
        this.addressFeild = false;
        this.SalesOrderLabel = false;
      } else {
        this.addressFeild = true;
        this.OutletNumberId = data;
        this.SalesOrderLabel = true;
      }

      if (data != "" && data != undefined) {
        this.SOPAGE = "Edit";

        this.OTL_Number = data;

        this.getOutletList(this.OTL_Number);
      }



    }
  }

  onChangeSellPartyId(event) {
    if (event != "") {
      this.spinner.show();
      const newVal = event;

      if (this.accountpartyId == newVal) {
        this.spinner.hide();
        this.OutletForm.controls['OutletPartyId'].reset();
        this.toastr.error('Failed', 'Outlet and party are same');
        return;
      }
      this.spinner.hide();

    } else {

      //this.formrestvalue();
      //this.articaldown = [];
      this.spinner.hide();
    }
  }

  onChangePartyId(event) {
    if (event.target.value != "") {
      this.spinner.show();
      const newVal = event.target.value;
      this.accountpartyId = event.target.value;
      this.userService.getarticleofoutlet(newVal).subscribe((res) => {
        if (Object.keys(res).length > 0) {
          this.articaldown = res;
        } else {
          this.formrestvalue();
          this.articaldown = [];
        }

      });

      this.spinner.hide();

    } else {

      this.formrestvalue();
      this.articaldown = [];
      this.spinner.hide();
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 21) {
          let parameterInnerId = this.route.snapshot.paramMap.get('id');
          let parameterId = this.route.snapshot.paramMap.get('OTLNO');
          if (data[i].AddRights == 1 || data[i].EditRights == 1) {
            if (parameterId == "Add" && data[i].AddRights == 1) {
              this.accessdenied = false;
            } else {
              if (parameterId != "Add" && data[i].EditRights == 1) {
                this.accessdenied = false;
              } else {
                this.accessdenied = true;
              }
            }
          } else {
            this.accessdenied = true;
          }
          if (item[0].Role == 2) {
            this.dateDisabled = false;
          } else {
            this.dateDisabled = true;
          }
          if (item[0].Role == 7) {
            this.butDisabled = true;
          } else {
            this.butDisabled = false;
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
        if (data[i].PageId == 21) {
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
    this.OTL_Number = res.OutletNumberId;
    this.OutletNumberId = res.Id;
    this.router.navigate(['/outlet', { OTLNO: this.OTL_Number }]);
    this.getOutletList(this.OutletNumberId);
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

  onChangartical(event) {
      console.log("qqq",event);
    if (event != "") {
      this.spinner.show();
      this.articalData = true;
      const newVal = event.ArticleId;
      this.artID = event.ArticleId
      let i;
      if (this.ArticleSelectedColor.length > 0) {
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];

          const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

          this.OutletForm.removeControl(inputname);
          this.OutletForm.removeControl(inputname2);
        }
      }

      this.OutletForm.value.OutletPartyId = '';

      // this.userService.getoutletsinglearticle($("#PartyId").val(), newVal, $('#OutletPartyId').val()).subscribe((res) => {
      this.userService.getoutletsinglearticle($("#PartyId").val(), newVal, 'this.OutletForm.value.OutletPartyId').subscribe((res) => {
        this.totalQuantity = 0;
        $(".totalquality").text(this.totalQuantity);
        if (res[0].ArticleOpenFlag == 0) {
          this.sets_label = "Pieces";
          this.ArticleOpenFlag = true;
          this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
          this.Disabled = true;
          this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
          this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
          this.ArticleRatio = res[0].ArticleRatio;
          this.Colorflag = res[0].Colorflag;
          this.ArticleRate = res[0].ArticleRate;
          this.Category = res[0].Category;
          let assignnopacks = {};


          if (res[0].Colorflag == 1) {
            this.noofpackcount = true;
            this.colorcountdown = this.ArticleSelectedColor;
            let i;
            var Count1 = Object.keys(this.colorcountdown).length;
            var nameArr = res[0].SalesNoPacks.split(',');

            let generatenopack;
            for (i = 0; i < Count1; i++) {
              generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
              assignnopacks[generatenopack] = nameArr[i];
              this.OutletForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
              this.OutletForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());
              this.totalqualityLength = true;
              this.myFormValueChanges$ = this.OutletForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
              // subscribe to the stream so listen to changes on units
              this.OutletForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].reset();
              this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
            }
          } else {
            this.totalqualityLength = false;
            this.noofpackcount = false;
            this.OutletForm.addControl('NoPacks', new FormControl());
            this.NoPacks = res[0].SalesNoPacks;
            this.ArticleRate = res[0].ArticleRate;
            this.Category = res[0].Category;

          }

          this.OutletForm.patchValue(assignnopacks);
        } else {
          this.totalqualityLength = false;
          this.sets_label = "pieces";
          this.ArticleOpenFlag = false;
          this.noofpackcount = false;
          this.Colorflag = res[0].Colorflag;
          this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
          this.ArticleRate = res[0].ArticleRate;
          this.Category = res[0].Category;
          this.OutletForm.addControl('NoPacks', new FormControl());
          this.NoPacks = res[0].SalesNoPacks;
        }
        this.spinner.hide();

      });



    } else {
      this.formrestvalue();
      this.articalData = false;
    }

  }

  cancelform() {
    let data = this.route.snapshot.paramMap.get('OTLNO');
    this.router.navigate(['/outlet', { OTLNO: data }]);
    this.formrestvalue();
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
          if (this.OutletForm.controls[inputname].value !== null && this.OutletForm.controls[inputname].value != "") {
            this.totalQuantity += parseInt(this.OutletForm.controls[inputname].value);
          }
        }

        this.noofpackcount = true;
        // alert(this.totalQuantity);

        $(".totalquality").text(this.totalQuantity);


      }
    }
  }
  formrestvalue() {
    let i;
    if (this.ArticleSelectedColor.length > 0) {
      if (this.Colorflag == 1) {
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
          const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

          this.OutletForm.controls[inputname2].reset();
          this.OutletForm.removeControl(inputname);
          this.OutletForm.removeControl(inputname2);
        }
      }
    }

    this.OutletForm.controls['ArticleId'].reset([null]);
    if (this.ArticleOpenFlagValue == 0) {
      this.OutletForm.controls['ArticleSelectedColor'].reset();
      this.OutletForm.controls['ArticleSelectedSize'].reset();
      this.OutletForm.controls['ArticleRatio'].reset();
    }

    this.OutletForm.controls['NoPacksNew'].reset();
    this.OutletForm.controls['ArticleRate'].reset();
    this.OutletForm.controls['Category'].reset();

    this.AddArticle = true;
    this.hideElement = true;
    this.articalData = false;
    this.ArticleOpenFlag = true;
    this.ArticleRatio = "";
    this.ArticleSelectedColor = [];
    this.ArticleSelectedSize = [];
    this.colorcountdown = [];
    this.spinner.hide();
  }

  public delete(id, ArticleOpenFlag) {
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
        this.userService.deleteoutlet(id, ArticleOpenFlag , item[0].Id).subscribe((res) => {
          // Re-render the DataTable
           if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            
            });
          }
          if (res) {
            this.toastr.success('Success', 'Outlet Delete Successfully');
            this.getOutletList(this.OutletNumberId);
            this.router.navigate(['/outlet', { OTLNO: this.OutletNumberId }]);
            this.formrestvalue();
          }
        });
      } else {

      }
    });
  }

  getOutletList(OTLNO) {
    localStorage.setItem('OTLNO', OTLNO);

    setTimeout(() => this.spinner.show(), 10);
    this.userService.outletdatepartyfromotlno(OTLNO).subscribe((res) => {
      if (res["length"] > 0) {
        this.editarray = {
          Date: res[0].OutletDate,
          PartyId: res[0].PartyId,
          OutletPartyId: res[0].PartyName,
          GSTAmount: res[0].GSTAmount,
          GSTPercentage: res[0].GSTPercentage,
          Discount: res[0].Discount,
          Address: res[0].Address,
          Contact: res[0].Contact,
          Remarks: res[0].Remarks
        }
        this.OTL_Number = res[0].Id;
        this.Outlet_Number_FinancialYear = res[0].Outlet_Number_FinancialYear;
        this.OutletForm.patchValue(this.editarray);


        this.userService.getarticleofoutlet(res[0].PartyId).subscribe((res) => {
          this.articaldown = res;
        });
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
          const data = localStorage.getItem('OTLNO');

          that.http.post<DataTablesResponse>(
              this.ApiURL+`/outletlistfromotlno/${data}`,
              dataTablesParameters, {}
            ).subscribe(resp => {
              that.solist = resp.data;
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

    // this.userService.outletlistfromotlno(OTLNO).subscribe((res) => {
    //   const data = res;
    //   if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //       // Destroy the table first
    //       dtInstance.destroy();
    //       this.solist = data;
    //       // Call the dtTrigger to rerender again
    //       this.dtTrigger.complete();
    //       this.spinner.hide();
    //     });
    //   } else {
    //     setTimeout(() => {
    //       this.solist = data;
    //       this.dtTrigger.complete();
    //       this.spinner.hide();
    //     }, 300);

    //   }

    // });
  }

  public edit(id) {
    this.spinner.show();
    let i;
    if (this.ArticleSelectedColor.length > 0) {
      for (i = 0; i < this.ArticleSelectedColor.length; i++) {
        this.noofpackcount = true;
        const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
        const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

        this.OutletForm.removeControl(inputname);
        this.OutletForm.removeControl(inputname2);
      }
    }

    this.userService.getoutletidwise(id).subscribe((res) => {
      if (this.route.snapshot.paramMap.get('id')) {
        this.AddArticle = false;
        this.hideElement = false;
      } else {
        this.AddArticle = true;
        this.hideElement = true;
      }


      if (res['length'] > 0) {
        this.editarray = {
          OutletNumberId: res[0].OutletNumberId,
          ArticleId: res[0].ArticleId,
          NoPacks: res[0].NoPacks
        }
        this.OutletNumberId = res[0].OutletNumberId;
        this.OTL_Number = res[0].OutletNumber;
        this.Outlet_Number_FinancialYear = res[0].OutletNumber;
        this.GETNOPACKS = res[0].NoPacks;
        this.ArticleRate = res[0].ArticleRate;
        this.Category = res[0].Category;
        // this.userService.getoutletsinglearticle($("#PartyId").val(), res[0].ArticleId, $("#OutletPartyId").val()).subscribe((res) => {
        this.userService.getoutletsinglearticle($("#PartyId").val(), res[0].ArticleId, this.OutletForm.value.OutletPartyId).subscribe((res) => {
          if (res[0].ArticleOpenFlag == 0) {
            this.sets_label = "Pieces";
            this.ArticleOpenFlag = true;
            this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
            this.articalData = true;
            this.Disabled = true;
            this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
            this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
            this.ArticleRatio = res[0].ArticleRatio;
            this.ArticleNumber = res[0].ArticleNumber;
            this.Colorflag = res[0].Colorflag;
            this.Category = res[0].Category;
            let assignnopacks = {};
            let getdataassignnopacks = {};


            if (res[0].Colorflag == 1) {
              this.noofpackcount = true;
              this.colorcountdown = this.ArticleSelectedColor;
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
                getdataassignnopacks[getdatageneratenopack] = nameNopacksArr[i];
                this.OutletForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
                this.OutletForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());
                this.totalqualityLength = true;
                this.myFormValueChanges$ = this.OutletForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
              // subscribe to the stream so listen to changes on units
               this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
              }
            } else {
              this.totalqualityLength = false;
              this.noofpackcount = false;
              this.OutletForm.addControl('NoPacks', new FormControl());
              this.OutletForm.addControl('NoPacksNew', new FormControl());

              this.NoPacks = res[0].SalesNoPacks;
              this.GETNOPACKS = this.GETNOPACKS;
            }

            this.OutletForm.patchValue(assignnopacks);
            this.OutletForm.patchValue(getdataassignnopacks);
          } else {
            this.totalqualityLength = false;
            this.sets_label = "pieces";
            this.articalData = true;
            this.ArticleOpenFlag = false;
            this.noofpackcount = false;
            this.Colorflag = res[0].Colorflag;
            this.ArticleNumber = res[0].ArticleNumber;
            this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
            this.GETNOPACKS = this.GETNOPACKS;
            this.Category = res[0].Category;
            this.OutletForm.addControl('NoPacks', new FormControl());
            this.NoPacks = res[0].SalesNoPacks;
          }
          this.spinner.hide();
        });
        this.OutletForm.patchValue(this.editarray);
      }
    });
  }

  onchangesets(id) {

  }

  // Initicate user add
  doOutletForm() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    this.OutletForm.value.Colorflag = this.Colorflag;
    this.OutletForm.value.UserId = userdata[0].Id;
    this.OutletForm.value.ArticleOpenFlag = this.ArticleOpenFlagValue;
    this.OutletForm.value.ArticleId = this.artID;

    // console.log('dfgdfgdfPPP', this.OutletForm.value)

    if (this.route.snapshot.paramMap.get('id')) {
      this.OutletForm.value.id = this.route.snapshot.paramMap.get('id');
      this.userService.updateOutlet(this.OutletForm.value).subscribe(
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
      this.OutletForm.value.OutletNumberId = this.OTL_Number;
      this.userService.dooutletform(this.OutletForm.value).subscribe(
        userdata => {
          // console.log('userdata', userdata)
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
  // User Add success function
  success(data, flag) {
    if (data == "") {
      this.toastr.error('Failed', 'Please try agin later');
    } else {
      if (data.id != "") {
        //this.router.navigate(['/solist']);
        let OutletNumberId = "";
        if (flag == 1) {
          this.toastr.success('Success', 'Outlet Add Successfully');
          OutletNumberId = data.OutletNumberId;
        } else {
          this.toastr.success('Success', 'Outlet Update Successfully');
          OutletNumberId = this.route.snapshot.paramMap.get('OTLNO');
        }
        this.SalesOrderLabel = true;
        this.router.navigate(['/outlet', { OTLNO: OutletNumberId }]);
        this.getOutletList(OutletNumberId);
        this.formrestvalue();
        this.spinner.hide();
      } else if (data.NoOfSetNotMatch == "true") {
        this.toastr.error('Failed', 'No of pieces greater than original value');
      } else if (data.ZeroNotAllow == "true") {
        this.toastr.error('Failed', 'Zero value not allow for "no of pieces"');
      } else {
        this.toastr.error('Failed', 'Please try agin later');
      }
    }

  }

  error() {
    this.toastr.error('Failed', 'Please enter valid value');
  }
  goBack (){
    window.history.back();
  }

}




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
import { debug } from 'util';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

class Person {
  Id: number;
  Name: string;
  OutwardNumber:string;
  OutletPartyName: string;
  ArticleNumber:string;;
  NoPacks:string;
  CreatedDate:string;
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
  selector: 'app-outletsalesreturn',
  templateUrl: './outletsalesreturn.component.html',
  styleUrls: ['./outletsalesreturn.component.scss']
})
export class OutletsalesreturnComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public srolist: Person[];
  public startnumber:  any;
  [x: string]: any;
  SalesReturnForm: FormGroup;
  public getarticleno: any = [];
  public partylist: any = [];
  public outletpartylist: any = [];
  public articleoutwordlist: any = [];
  public colordropdown: any = [];
  public sizedropdown: any = [];
  public editarray = {};

  GETNOPACKS: any;
  getuserdata: any;
  dropdownSettings = {};
  AddArticle = true;
  ArticleOpenFlag: boolean = true;
  Disabled = true;
  ArticleOpenFlagValue: any;
  SRNumberId: any;
  apiId:any;
  apiName:any;
  selId: any;
  SalesReturnOrderLabel: boolean = false;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  SRO_Number_FinancialYear: any;
  SRO_Number: any;
  OutletId: any;
  sets_label: any;
  dropdownList = [];
  ArticleSelectedColor = [];
  ArticleSelectedSize = [];
  ArticleRatio: any;
  ArticleRate: any;
  colorflag: any;
  NoPacks: any;
  ArticleNoPacks: any;
  ArticleColorFlag: any;
  noofpackcount: boolean = false;
  public colorcountdown = [];
  articalData: boolean = false;
  partyflag: boolean = false;
  ArticleId: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  ArticleNumber: any;
  isDisabled: boolean = false;
  partyid: number = 0;
  NoPacks_TotalOutlet: any;
  OutletPartyflag: boolean = false;
  outletparyselect: number = 0;
  totalqualityLength: boolean = false;
  myFormValueChanges$;
  totalQuantity: number = 0;
  Category: any;
  PartyId: any;
  OutletNumber:any;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Add Outlet Sales Return | Colorhunt");
    this.SalesReturnForm = this.formBuilder.group({
      SRNumberId: [''],
      PartyId: ['', [Validators.required]],
      ArticleId: ['', [Validators.required]],
      OutwardNumberId: ['', [Validators.required]],
      Remark: ['', [Validators.required]],
      ArticleSelectedColor: [''],
      ArticleSelectedSize: [''],
      ArticleRatio: [''],
      ArticleRate: [''],
      NoPacks: [''],
      NoPacksNew: [''],
      ArticleColorFlag: [''],
      OutletPartyId: ['', [Validators.required]],
      Category: ['']
    });
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
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
    this.Disabled = true;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true
    };
    // this.userService.getparty().subscribe((res) => {
    //   this.partylist = res;
    // });

    if (item[0].Role == 2) {
      this.partyid = 0;
    } else {
      this.partyid = item[0].PartyId;
    }
    this.userService.getoutletparty(this.partyid).subscribe((res) => {
      this.outletpartylist = res;
    });

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


    let data = this.route.snapshot.paramMap.get('OSRONO');
    let get_id = this.route.snapshot.paramMap.get('id');
    if (data == "Add") {
      this.SalesReturnOrderLabel = false;
    } else {
      this.userService.getparty().subscribe((res) => {
        this.partylist = res;
      });
      this.OutletPartyflag = true;
      this.SRNumberId = data;
      this.SalesReturnOrderLabel = true;
    }

    if (data != "" && data != undefined) {
      //alert("asd");
      // this.SOPAGE = "Edit";
      this.SRO_Number = data;
      this.getSROList(this.SRO_Number);
    }
    if (this.route.snapshot.paramMap.get('id')) {
      this.edit(get_id);
    }
  }

  getSROList(OSRONO) {
    localStorage.setItem('OSRONO', OSRONO);

    setTimeout(() => this.spinner.show(), 10);
    this.userService.srodateremarkfromsrono(OSRONO).subscribe((res) => {
      this.apiId = res[0].PartyId
      this.apiName = res[0].NAME
      if (res["length"] > 0) {
        this.editarray = {
          // Date: res[0].SoDate,
          PartyId: res[0].NAME,
          OutletPartyId: res[0].OutletPartyId,
          // Destination: res[0].Destination,
          Remark: res[0].Remarks,
          SRNumberId: res[0].Id
        }

        let newVal = (this.apiId == undefined) ? this.selId : this.apiId;
        this.PartyId = res[0].PartyId;

        if (this.OutletPartyflag == false) {
          this.userService.salesreturnarticle(newVal).subscribe((res) => {
            this.getarticleno = res;
            this.spinner.hide();
          });
        } else {
          this.userService.salesreturn_outletarticle(newVal).subscribe((res) => {
            this.getarticleno = res;
            this.spinner.hide();
          });
        }

        this.SalesReturnForm.controls['PartyId'].disable();
        this.SRO_Number = res[0].Id;

        this.SRO_Number_FinancialYear = res[0].SRO_Number_FinancialYear;
        this.SalesReturnForm.patchValue(this.editarray);
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
          const data = localStorage.getItem('OSRONO');

          this.http.post<DataTablesResponse>(
              this.ApiURL+`/srolistfromsronumber/${data}`,
              dataTablesParameters, {}
            ).subscribe(resp => {
              // console.log('JP',that.sostatuslist);
              that.startnumber = resp.startnumber;
              this.spinner.hide();
              this.srolist = resp.data;
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

    // this.userService.srolistfromsronumber(OSRONO).subscribe((res) => {
    //   const data = res;

    //   if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //       // Destroy the table first
    //       dtInstance.destroy();
    //       this.srolist = data;
    //       // Call the dtTrigger to rerender again
    //       this.dtTrigger.complete();
    //       this.spinner.hide();
    //     });
    //   } else {
    //     setTimeout(() => {
    //       this.srolist = data;
    //       this.dtTrigger.complete();
    //       this.spinner.hide();
    //     }, 100);

    //   }

    // });
  }


  TotalQualityPeace() {
    let i;
    if (this.ArticleSelectedColor !== null) {
      if (this.ArticleSelectedColor.length > 0) {
        this.totalQuantity = 0;
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];
          if (this.SalesReturnForm.controls[inputname].value !== null && this.SalesReturnForm.controls[inputname].value != "") {
            this.totalQuantity += parseInt(this.SalesReturnForm.controls[inputname].value);
          }
        }
        $(".totalquality").text(this.totalQuantity);
      }
    }
  }
  public delete(id) {
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
        this.userService.deleteoutletsalesreturn(id , item[0].Id).subscribe((res) => {

           // Re-render the DataTable
           if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            
            });
          }
          if (res) {
            this.toastr.success('Success', 'Sales Return Delete Successfully');
            this.getSROList(this.route.snapshot.paramMap.get('OSRONO'));
            this.router.navigate(['/outletsalesreturn', { OSRONO: this.route.snapshot.paramMap.get('OSRONO') }]);
            this.formrestvalue();
          }
        });
      } else {

      }
    });
  }

  cancelform() {
    this.SalesReturnForm.controls['OutwardNumberId'].reset([null]);
    this.getarticleno = null;
    $('.salesreturnfields_outward').hide();
    this.formrestvalue();
  }

  onChangeOutletParty(event) {

    this.getarticleno = [];
    this.partylist = [];
    //this.SalesReturnForm.controls['PartyId'].reset();
    this.SalesReturnForm.controls['ArticleId'].reset(null);
    $(".salesreturnfields").hide();
    $('.salesreturnfields_outlet').hide();
    this.SalesReturnForm.controls['ArticleSelectedColor'].reset();
    this.SalesReturnForm.controls['ArticleSelectedSize'].reset();
    this.SalesReturnForm.controls['ArticleRatio'].reset();
    this.getarticleno = [];
    if (event.target.value != "") {
      this.OutletPartyflag = true;
      this.spinner.show();

      const newVal = event.target.value;
      this.outletparyselect = event.target.value;
      this.userService.salesreturnoutlet(newVal).subscribe((res) => {

        this.partylist = res;
        this.spinner.hide();
      });
    } else {
      this.OutletPartyflag = false;
      this.outletparyselect = 0;
      this.SalesReturnForm.controls['PartyId'].reset(null);

    }
  }

  onChangeParty(event) {
    event = event.Id
    this.selId = event
    this.getarticleno = [];
    this.SalesReturnForm.controls['ArticleId'].reset(null);
    $(".salesreturnfields").hide();
    $('.salesreturnfields_outlet').hide();
    this.SalesReturnForm.controls['ArticleSelectedColor'].reset();
    this.SalesReturnForm.controls['ArticleSelectedSize'].reset();
    this.SalesReturnForm.controls['ArticleRatio'].reset();
    this.getarticleno = [];
    if (event != "") {
      this.spinner.show();

      let newVal = (this.apiId == undefined) ? this.selId : this.apiId;
      // const newVal = event;
      //alert(this.outletparyselect);
      if (this.outletparyselect == newVal) {
        //  alert("Same Article Id");
        this.spinner.hide();
        this.toastr.error('Failed', 'Outlet and party are same');
        return;
      } else {
        //debugger;
        if (this.OutletPartyflag == false) {
          this.userService.salesreturnarticle(newVal).subscribe((res) => {
            this.getarticleno = res;
            this.spinner.hide();
          });
        } else {
          
          this.userService.salesreturn_outletarticle(newVal).subscribe((res) => {
            this.getarticleno = res;
            this.spinner.hide();
          });
        }
      }
    }
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

  onChangeOutletNumber(event) {
    if (event.target.value != "") {
      this.spinner.show();
      let OutwardNumberId = event.target.value;
      this.partyflag = false;

      var partyId = (this.apiId == undefined) ? this.selId : this.apiId

      this.userService.salesreturnoutletgetdata(partyId, this.ArticleId.Id, OutwardNumberId).subscribe((res) => {
        this.OutletId = res[0].OutletId;
        if (res[0].ArticleOpenFlag == 0) {
          $(".salesreturnfields").show();
          this.sets_label = "Pieces";
          this.ArticleOpenFlag = true;
          this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;

          this.Disabled = true;
          this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
          this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
          this.ArticleRatio = res[0].ArticleRatio;
          this.ArticleRate = res[0].ArticleRate;
          this.Category = res[0].Category;
          if (res[0].Colorflag == 1) {
            this.ArticleColorFlag = "Yes"
          } else {
            this.ArticleColorFlag = "No"
          }
          let assignnopacks = {};
          let assignpending_outletnopacks = {};


          if (res[0].Colorflag == 1) {
            this.noofpackcount = true;
            this.colorcountdown = this.ArticleSelectedColor;
            let i;


            var Count1 = Object.keys(this.colorcountdown).length;
            var nameArr = res[0].OutletNoPacks.split(',');

            let generatenopack;
            for (i = 0; i < Count1; i++) {
              generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
              console.log('generatenopack', generatenopack)
              assignnopacks[generatenopack] = nameArr[i];

              this.SalesReturnForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
              this.SalesReturnForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());
              this.totalqualityLength = true;
              this.myFormValueChanges$ = this.SalesReturnForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
              // subscribe to the stream so listen to changes on units
              this.SalesReturnForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].reset();
              this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace())
            }
            setTimeout(() => {
              $(".totalquality").text(this.totalQuantity);
            }, 200);
          } else {
            this.totalqualityLength = false;
            this.noofpackcount = false;
            this.SalesReturnForm.addControl('NoPacks', new FormControl());
            this.NoPacks = res[0].OutletNoPacks;

          }

          this.SalesReturnForm.patchValue(assignnopacks);
        } else {
          this.Category = res[0].Category;
          this.totalqualityLength = false;
          $(".salesreturnfields").show();
          this.sets_label = "pieces";
          this.ArticleOpenFlag = false;
          this.noofpackcount = false;
          this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
          this.SalesReturnForm.addControl('NoPacks', new FormControl());

          this.NoPacks = res[0].OutletNoPacks;
        }

        this.spinner.hide();
      });
    } else {
      //alert("asss");
      $(".salesreturnfields").hide();
    }
  }

  onChangeOutwardNumber(event) {
    if (event.target.value != "") {
      this.spinner.show();
      let OutwardNumberId = event.target.value;
      this.partyflag = false;

      this.userService.salesreturnoutwardgetdata(this.PartyId, this.ArticleId.Id, OutwardNumberId).subscribe((res) => {
        this.OutletId = res[0].OutletId;
        let getdataoutletpending = {};
        if (res[0].ArticleOpenFlag == 0) {
          $(".salesreturnfields").show();
          this.sets_label = "Pieces";
          this.ArticleOpenFlag = true;
          this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;

          this.Disabled = true;
          this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
          this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
          this.ArticleRatio = res[0].ArticleRatio;
          if (res[0].Colorflag == 1) {
            this.ArticleColorFlag = "Yes"
          } else {
            this.ArticleColorFlag = "No"
          }
          let assignnopacks = {};
          let assignpending_outletnopacks = {};


          if (res[0].Colorflag == 1) {
            this.noofpackcount = true;
            this.colorcountdown = this.ArticleSelectedColor;
            let i;


            var Count1 = Object.keys(this.colorcountdown).length;
            var nameArr = res[0].OutletNoPacks_New.split(',');

            let generatenopack;
            let getdataoutletpending;
            for (i = 0; i < Count1; i++) {
              generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
              assignnopacks[generatenopack] = nameArr[i];
              if (res[0].OutletParty == 1) {
                var pending_nameArr = res[0].Outlet_Total_PNoPacks.split(',');
                getdataoutletpending = 'NoPacks_TotalOutlet_' + this.colorcountdown[i]['Id'];
                assignpending_outletnopacks[getdataoutletpending] = pending_nameArr[i];
              }
              this.SalesReturnForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
              this.SalesReturnForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());
              if (res[0].OutletParty == 1) {
                this.partyflag = true;
                this.SalesReturnForm.addControl('NoPacks_TotalOutlet_' + this.colorcountdown[i]['Id'], new FormControl());
              } else {
                this.partyflag = false;
              }
            }
          } else {
            this.noofpackcount = false;
            this.SalesReturnForm.addControl('NoPacks', new FormControl());
            this.NoPacks = res[0].OutletNoPacks_New;
            if (res[0].OutletParty == 1) {
              this.partyflag = true;
              this.SalesReturnForm.addControl('NoPacks_TotalOutlet', new FormControl());
              this.NoPacks_TotalOutlet = res[0].Outlet_Total_PNoPacks;
            } else {
              this.partyflag = false;
            }
          }

          this.SalesReturnForm.patchValue(assignnopacks);
          this.SalesReturnForm.patchValue(assignpending_outletnopacks);
        } else {
          $(".salesreturnfields").show();
          this.sets_label = "pieces";
          this.ArticleOpenFlag = false;
          this.noofpackcount = false;
          this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
          this.SalesReturnForm.addControl('NoPacks', new FormControl());
          if (res[0].OutletParty == 1) {
            this.partyflag = true;
            this.SalesReturnForm.addControl('NoPacks_TotalOutlet', new FormControl());
            this.NoPacks_TotalOutlet = res[0].Outlet_Total_PNoPacks;
          } else {
            this.partyflag = false;
          }
          this.NoPacks = res[0].OutletNoPacks_New;
        }

        this.spinner.hide();
      });



    } else {
      $(".salesreturnfields").hide();
      this.spinner.hide();
    }

  }

  onChangartical(event) {
    $('.salesreturnfields').hide();
    this.SalesReturnForm.controls['OutwardNumberId'].reset([null]);
    if (event !== undefined && event !== null) {
      this.spinner.show();
      this.articalData = true;
      const newVal = event.Id;
      if (this.OutletPartyflag == false) {
        var type = 0;
      } else {
        var type = 1;
      }
      console.log('type', type)

      var partyId = (this.apiId == undefined) ? this.selId : this.apiId
      this.userService.salesreturngetoutwardnumber(partyId, newVal, type).subscribe((res) => {
        this.articleoutwordlist = res;
        this.totalQuantity = 0;
        $(".totalquality").text(this.totalQuantity);
        var ArticleOutwardCount = Object.keys(res).length;
        //alert(this.OutletPartyflag);
        //alert(type);

        if (ArticleOutwardCount > 0) {
          $('.salesreturnfields_outlet').show();
          this.spinner.hide();
        } else {
          this.articleoutwordlist = [];
          this.ArticleSelectedColor = [];
          this.ArticleSelectedSize = [];
          this.ArticleRatio = [];
          this.articalData = false;
          this.ArticleColorFlag = "";
          this.spinner.hide();
          $(".salesreturnfields").hide();
          $('.salesreturnfields_outlet').hide();
        }


      });


    } else {
      this.ArticleSelectedColor = [];
      this.ArticleSelectedSize = [];
      this.ArticleRatio = [];
      this.articalData = false;
      this.ArticleColorFlag = "";
    }
  }

  dosalesReturn() {
    document.getElementById('submit-button').setAttribute('disabled', 'true');
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    this.spinner.show();
    this.SalesReturnForm.value.SRNumberId = this.SRO_Number;
    this.SalesReturnForm.value.UserId = userdata[0].Id;
    this.SalesReturnForm.value.ArticleOpenFlag = this.ArticleOpenFlagValue;

    this.SalesReturnForm.value.OutletId = this.OutletId;
    this.SalesReturnForm.value.partyflag = this.partyflag;
    this.SalesReturnForm.value.PartyId = this.PartyId;

    if(this.route.snapshot.paramMap.get('id')){
      this.SalesReturnForm.value.ArticleId = this.ArticleId;


      var partyId = (this.apiId == undefined) ? this.selId : this.apiId;
      this.SalesReturnForm.value.PartyId = partyId;
      this.userService.updateOutletSalesReturnForm(this.SalesReturnForm.value).subscribe(
        userdata => {
          console.log('update', userdata)
           // Re-render the DataTable
           if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            
            });
          }
         this.spinner.hide();
         this.updatesuccess(userdata);
         document.getElementById('submit-button').removeAttribute('disabled');
        }
      );
    }
    else{
      this.SalesReturnForm.value.ArticleId = this.ArticleId.Id;
      var partyId = (this.apiId == undefined) ? this.selId : this.apiId;
      this.SalesReturnForm.value.PartyId = partyId;
      this.userService.doOutletSalesReturnForm(this.SalesReturnForm.value).subscribe(
        userdata => {
          console.log('add', userdata)
           // Re-render the DataTable
           if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            
            });
          }
          this.spinner.hide();
          this.success(userdata);
          document.getElementById('submit-button').removeAttribute('disabled');
        }
      );
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 36) {
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
        if (data[i].PageId == 36) {
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

  // deletesuccess(data){

  //   if (data.id != "") {
  //     this.toastr.success('Success', 'Sales Return Delete Successfully');
  //     this.getSROList(SrnumberId);
  //   }
  // }

  success(data) {
    if (data.id != "") {
      this.toastr.success('Success', 'Sales Return Add Successfully');
      let SrnumberId = "";
      SrnumberId = data.SRNumberId;
      this.router.navigate(['/outletsalesreturn', { OSRONO: SrnumberId }]);
      this.getSROList(SrnumberId);
      //this.router.navigate(['/salesreturnlist']);
      this.formrestvalue();
    } else if (data.NoOfSetNotMatch == "true") {
      this.toastr.error('Failed', 'No of pieces greater than original value');
    } else if (data.ZeroNotAllow == "true") {
      this.toastr.error('Failed', 'Zero value not allow for "no of pieces"');
    } else if (data.OutletNoOfSetNotMatch == "true") {
      this.toastr.error('Failed', 'No of pieces greater than outlet value');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  formrestvalue() {
    let i;
    if (this.partyflag == true) {
      if (this.ArticleSelectedColor.length > 0) {
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
          const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];
          const inputname3 = 'NoPacks_TotalOutlet_' + this.ArticleSelectedColor[i]['Id'];

          this.SalesReturnForm.removeControl(inputname);
          this.SalesReturnForm.removeControl(inputname2);
          this.SalesReturnForm.removeControl(inputname3);
        }
      } else {
        this.SalesReturnForm.removeControl("NoPacks");
        // this.SalesReturnForm.removeControl("NoPacksNew");
        this.SalesReturnForm.removeControl("NoPacks_TotalOutlet");
      }
    } else {
      // debugger;
      if (this.ArticleSelectedColor.length > 0) {
        // debugger;
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          // debugger;
          this.noofpackcount = true;
          const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
          const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

          this.SalesReturnForm.removeControl(inputname);
          this.SalesReturnForm.removeControl(inputname2);
        }
      } else {
        this.SalesReturnForm.removeControl("NoPacks");
        // this.SalesReturnForm.removeControl("NoPacksNew");
        // this.SalesReturnForm.removeControl("NoPacks_TotalOutlet");
      }
    }


    let data = this.route.snapshot.paramMap.get('OSRONO');
    if (data == "Add") {
      this.SalesReturnForm.controls['PartyId'].reset([null]);
    }

    $('.salesreturnfields_outward').hide();
    $('.salesreturnfields_outlet').hide();
    this.ArticleId = null;
    this.SalesReturnForm.controls['ArticleId'].reset();
    this.SalesReturnForm.controls['ArticleSelectedColor'].reset();
    this.SalesReturnForm.controls['ArticleSelectedSize'].reset();
    this.SalesReturnForm.controls['ArticleRatio'].reset();
  }
  public edit(id) {
    this.spinner.show();
    this.SalesReturnForm.get('OutwardNumberId').clearValidators()
    this.SalesReturnForm.get('ArticleId').clearValidators()
    this.partyflag = false;
    this.userService.getoutletsalesreturnidwise(id).subscribe((res) => {
      $('.salesreturnfields_outlet').show();
      this.articalData = true;
      this.AddArticle = false;
      $(".salesreturnfields").show();
      this.OutletId = res[0].OutletId;
      this.ArticleNumber = res[0].ArticleNumber;
      this.OutletNumber = res[0].OutletNumber;
      this.ArticleId = res[0].ArticleId
      if (res[0].ArticleOpenFlag == 0) {
        this.sets_label = "Pieces";
        this.ArticleOpenFlag = true;
        this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
        this.Disabled = true;
        this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
        this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
        this.ArticleRatio = res[0].ArticleRatio;
        this.ArticleRate = res[0].ArticleRate;
        this.Category = res[0].Category;
        if (res[0].Colorflag == 1) {
          this.ArticleColorFlag = "Yes"
        } else {
          this.ArticleColorFlag = "No"
        }
        let assignnopacks = {};
        if (res[0].Colorflag == 1) {
          this.noofpackcount = true;
          this.colorcountdown = this.ArticleSelectedColor;
          let i;
          var Count1 = Object.keys(this.colorcountdown).length;
          var nameArr = res[0].OutletNoPacks.split(',');
          var newnameArr = res[0].OutletSalesReturn.split(',')
          let generatenopack;
          let newgeneratenopack;
          for (i = 0; i < Count1; i++) {
            generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
            newgeneratenopack ='NoPacksNew_' + this.colorcountdown[i]['Id'];
            assignnopacks[generatenopack] = nameArr[i];
            assignnopacks[newgeneratenopack] = newnameArr[i];
            this.SalesReturnForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
            this.SalesReturnForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());
            this.totalqualityLength = true;
            this.myFormValueChanges$ = this.SalesReturnForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
            // subscribe to the stream so listen to changes on units
            this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace())
          }
          setTimeout(() => {
            $(".totalquality").text(this.totalQuantity);
          }, 200);
        } else {
          this.totalqualityLength = false;
          this.noofpackcount = false;
          this.SalesReturnForm.addControl('NoPacks', new FormControl());
          this.SalesReturnForm.addControl('NoPacksNew', new FormControl());
          this.NoPacks = res[0].OutletNoPacks;
          this.GETNOPACKS = res[0].OutletSalesReturn;
        }

        this.SalesReturnForm.patchValue(assignnopacks);
      } else {
        this.Category = res[0].Category;
        this.totalqualityLength = false;
        $(".salesreturnfields").show();
        this.sets_label = "pieces";
        this.ArticleOpenFlag = false;
        this.noofpackcount = false;
        this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
        this.SalesReturnForm.addControl('NoPacks', new FormControl());
        this.SalesReturnForm.addControl('NoPacksNew', new FormControl());
        this.GETNOPACKS = res[0].OutletSalesReturn;
        this.NoPacks = res[0].OutletNoPacks;
      }
      this.spinner.hide();
    });

  }


  updatesuccess(data) {
    if (data['status'] == "failed") {
      if (data['NoOfSetNotMatch'] == true) {
        this.toastr.error('Failed', 'No of pieces greater than original value');
      }
      else if(data['ZEROvalue'] == true){
        this.toastr.error('Failed', 'Zero value not allow for "no of pieces"');
      }
    }
    else if (data['status'] == "success") {
      this.SalesReturnOrderLabel = true;
      this.toastr.success('Success', 'Outlet Sales Return is updated Successfully');
      let SRNumberId = "";
      SRNumberId = data['id'];
      this.AddArticle = true;
      this.articalData = false;
      this.getSROList(SRNumberId);
      this.router.navigate(['/outletsalesreturn', { OSRONO: SRNumberId }]);
      this.formrestvalue();

    }
  }
}
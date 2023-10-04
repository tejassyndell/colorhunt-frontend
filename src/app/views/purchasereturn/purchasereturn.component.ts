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
  Name: string;
  ArticleNumber:string;
  ReturnNoPacks:string;
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
  selector: 'app-purchasereturn',
  templateUrl: './purchasereturn.component.html',
  styleUrls: ['./purchasereturn.component.scss']
})

export class PurchasereturnComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public startnumber:  any;
  public colordropdown: any = [];
  public sizedropdown: any = [];
  public ratiodropdown: any = [];
  public vendordropdown: any = [];
  public purchasereturn:  Person[];

  public editarray = {};
  public partypdown: any = [];
  public articaldown: any = [];
  public articleinwardlist: any = [];
  public prolist: any = [];

  ArticleId: any;
  InwardNumberId: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();

  accessdenied: boolean = true;
  dropdownSettings = {};
  PurchaseReturnForm: FormGroup;
  PurchaseReturnOrderLabel: boolean = false;
  PRO_Number_FinancialYear: any;
  PRO_Number: any;
  SoCurrentDate: Date;
  SoNumberId: any;
  hideElement: boolean = true;
  articalData: boolean = false;
  Disabled = true;
  AddArticle = true;
  isEdit: any;
  isDelete: any;
  SO_Number: any;
  ArticleOpenFlag: boolean = true;
  noofpackcount: boolean = false;
  Submitbutton: boolean = false;
  public colorcountdown = [];
  ArticleNumber: any;

  dropdownList = [];
  ArticleSelectedColor = [];
  ArticleSelectedSize = [];
  ArticleRatio: any;
  ArticleRate: any;
  colorflag: any;
  NoPacks: any;
  ArticleNoPacks: any;
  GETNOPACKS: any;
  SOPAGE: any;
  vName : any;
  vId : any;
  getuserdata: any;
  UserWiseData: boolean = true;
  ArticleOpenFlagValue: any;
  sets_label: any;
  PRNumberId: any;
  PRId: any;
  isDisabled: boolean = false;
  totalqualityLength: boolean = false;
  myFormValueChanges$;
  totalQuantity: number = 0;
  Category: any;
  VendorId: any;
  GRNnumber: any;
  editPurchase: boolean = false;
  //statusdispaly:boolean=false;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Add Purchase Return | Colorhunt");
    this.PurchaseReturnForm = this.formBuilder.group({
      PRNumberId: [''],
      PRId: [''],
      VendorId: ['', [Validators.required]],
      ArticleId: ['', [Validators.required]],
      InwardNumberId: ['', [Validators.required]],
      Remark: [''],
      NoPacks: [''],
      NoPacksNew: [''],
      ArticleSelectedColor: [''],
      ArticleSelectedSize: [''],
      ArticleRatio: [''],
      ArticleRate: [''],
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

    this.userService.partylist().subscribe((res) => {
      this.partypdown = res;
    });
    // this.userService.remainingarticlelist().subscribe((res) => {
    //   this.articaldown = res;
    // });

    this.userService.vendorlist().subscribe((res) => {
      this.vendordropdown = res;
    });



    let data = this.route.snapshot.paramMap.get('PRONO');
    let get_id = this.route.snapshot.paramMap.get('id');
    if (data == "Add") {
      this.PurchaseReturnOrderLabel = false;
    } else {
      this.PRNumberId = data;
      this.PRId = get_id;
      this.PurchaseReturnOrderLabel = true;
    }

    if (data != "" && data != undefined) {
      //alert("asd");
      // this.SOPAGE = "Edit";
      this.PRO_Number = data;
      this.getPROList(this.PRO_Number);

    }
    if (get_id != "" && get_id != undefined) {
      this.edit(get_id);
    }


    $('.purchasereturnfields_outward').hide();
  
  
    
  
  }

  getPROList(PRONO) {
    localStorage.setItem('PRONO', PRONO);

    setTimeout(() => this.spinner.show(), 10);
    this.userService.prdateremarkfromprono(PRONO).subscribe((res) => {
      this.vId = res[0].VendorId
      console.log('dddd:',this.vId)
      if (res["length"] > 0) {
        this.editarray = {
          // Date: res[0].SoDate,
          VendorId: res[0].Name,
          Remark: res[0].Remark,
          PRNumberId: res[0].Id
        }
        this.VendorId = res[0].VendorId;
        let newVal = res[0].VendorId;

        // this.userService.prdateremarkfromprono(newVal).subscribe((res) => {
        //   this.articaldown = res;
        //   //this.spinner.hide();
        // });

        // this.userService.getpurchasereturnarticle(newVal).subscribe((res) => {
        //   this.articaldown = res;

        // })
        this.userService.getpurchasereturnarticle(newVal).subscribe((res) => {
          this.articaldown = res;

        })
        this.PurchaseReturnForm.controls['VendorId'].disable();
        this.isDisabled = true;
        this.PRO_Number = res[0].Id;
        this.PRO_Number_FinancialYear = res[0].PRO_Number_FinancialYear;
        this.PurchaseReturnForm.patchValue(this.editarray);
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
          const data = localStorage.getItem('PRONO');
          that.http.post<DataTablesResponse>(
              this.ApiURL+`/prlistfrompronumber/${data}`,
              dataTablesParameters, {}
            ).subscribe(resp => {
              that.prolist = resp.data;
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




    
    // this.userService.prlistfrompronumber(PRONO).subscribe((res) => {
    //   const data = res;
    //   if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //       // Destroy the table first
    //       dtInstance.destroy();
    //       this.prolist = data;
    //       // Call the dtTrigger to rerender again
    //       this.dtTrigger.next();
    //       this.spinner.hide();
    //     });
    //   } else {
    //     setTimeout(() => {
    //       this.prolist = data;
    //       this.dtTrigger.next();
    //       this.spinner.hide();
    //     }, 100);

    //   }

    // });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
        this.userService.deletepurchasereturnrecord(id , item[0].Id).subscribe((res) => {
          // Re-render the DataTable
          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            
            });
          }
          if (res) {
            this.toastr.success('Success', 'Purchase Return Delete Successfully');
            this.getPROList(this.route.snapshot.paramMap.get('PRONO'));
            this.router.navigate(['/purchasereturn', { PRONO: this.route.snapshot.paramMap.get('PRONO') }]);
            this.formrestvalue();
          }
        });
      } else {

      }
    });
  }

  // rightscheck(data) {
  //   for (let i = 0; i < data.length; i++) {
  //     if (data[i].PageId == 5) {
  //       this.isEdit = data[i].EditRights;
  //       this.isDelete = data[i].DeleteRights;
  //     }
  //   }
  // }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 25) {
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

          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = true;
        }

      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 25) {
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
          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = true;
        }

      }

    }
  }

  onChangeVendor(event) { 
    this.vId = (event.Id == undefined) ? this.vId : event.Id
    this.vName = event.Name
    event = event.Id
    console.log("qqq",event)
    this.articaldown = [null];
    if (this.route.snapshot.paramMap.get('id')) {
      this.AddArticle = false;
      this.articalData = true;
      $('.purchasereturnfields_outward').show();
      this.Submitbutton = true;
    }
    else {
      this.PurchaseReturnForm.controls['ArticleId'].reset(null);
      $('.purchasereturnfields_outward').hide();
      this.articalData = false;
    }

    this.PurchaseReturnForm.controls['InwardNumberId'].reset([null]);
    this.userService.getpurchasereturnarticle(event).subscribe((res) => {
      this.articaldown = res;

    })

    // this.userService.remainingarticlelist().subscribe((res) => {
    //     this.articaldown = res;
    //   });

  }
  onChangartical(event) {

    // console.log('yashvi',event)

    $('.salesreturnfields').hide();
    this.articalData = false;
    this.PurchaseReturnForm.controls['InwardNumberId'].reset([null]);

    //alert("asd");
    if (event !== undefined && event !== null) {
      let venderid = this.vId;
      if (event != "") {
        this.userService.getpurchasereturngetinwardnumber(venderid, event.ArticleId).subscribe((res) => {
          this.totalQuantity = 0;
          $(".totalquality").text(this.totalQuantity);
          this.articleinwardlist = res;
          var ArticleOutwardCount = Object.keys(res).length;
          if (ArticleOutwardCount > 0) {
            $('.purchasereturnfields_outward').show();
          } else {
            if (this.route.snapshot.paramMap.get('id')) {
              this.AddArticle = false;
              this.articalData = true;
              $('.purchasereturnfields_outward').show();
              this.Submitbutton = true;
            }
            else {
              this.articalData = false;
              $('.purchasereturnfields_outward').hide();
            }

          }
        });
      }
    }


  }

  onChangeInwardNumber(event) {
    console.log('tester', this.colorcountdown);
    if (event.currentTarget.value != "") {
      this.spinner.show();
      this.articalData = true;
      const newVal = event;
      // const VendorId = this.PurchaseReturnForm.value.VendorId;
      const ArticleId = this.PurchaseReturnForm.value.ArticleId.ArticleId;
      const InwardNumberId = event.currentTarget.value;
      this.PurchaseReturnForm.value.VendorId = this.vId
      this.userService.getpurcahsereturninwardgetdata(this.vId, ArticleId, InwardNumberId).subscribe((res) => {
        console.log('res', res)
        this.Submitbutton = true;
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
              this.PurchaseReturnForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
              this.PurchaseReturnForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());
              this.totalqualityLength = true;
              this.myFormValueChanges$ = this.PurchaseReturnForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
              this.PurchaseReturnForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].reset();
              this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
            }
            setTimeout(() => {
              $(".totalquality").text(this.totalQuantity);
            }, 200);
          } else {
            this.totalqualityLength = false;
            this.noofpackcount = false;
            this.PurchaseReturnForm.addControl('NoPacks', new FormControl());
            this.NoPacks = res[0].SalesNoPacks;
          }

          this.PurchaseReturnForm.patchValue(assignnopacks);
        } else {
          this.totalqualityLength = false;
          this.sets_label = "Pieces";
          this.ArticleOpenFlag = false;
          this.noofpackcount = false;
          this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
          this.PurchaseReturnForm.addControl('NoPacks', new FormControl());
          this.NoPacks = res[0].NoPacks;
        }
        this.spinner.hide();

      });
    } else {
      this.articalData = false;
    }

  }
  TotalQualityPeace() {
    let i;
    if (this.ArticleSelectedColor !== null) {
      if (this.ArticleSelectedColor.length > 0) {
        this.totalQuantity = 0;
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];
          if (this.PurchaseReturnForm.controls[inputname].value !== null && this.PurchaseReturnForm.controls[inputname].value != "") {
            this.totalQuantity += parseInt(this.PurchaseReturnForm.controls[inputname].value);
          }
        }
        $(".totalquality").text(this.totalQuantity);
      }
    }
  }
  cancelform() {
    this.router.navigate(['/purchasereturn']);
    this.formrestvalue();
  }

  formrestvalue() {
    this.Submitbutton = false;
    let data = this.route.snapshot.paramMap.get('PRONO');
    if (data == "Add") {
      this.PurchaseReturnForm.controls['VendorId'].reset([null]);
    }

    $('.purchasereturnfields_outward').hide();
    let i;
    if (this.ArticleSelectedColor.length > 0) {
      for (i = 0; i < this.ArticleSelectedColor.length; i++) {
        this.noofpackcount = true;
        const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
        const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

        this.PurchaseReturnForm.removeControl(inputname);
        this.PurchaseReturnForm.removeControl(inputname2);
      }
    }
    this.ArticleId = null;
    if (this.VendorId) {
      this.userService.getpurchasereturnarticle(event).subscribe((res) => {
        this.articaldown = res;
      })
    } else {
      this.userService.remainingarticlelist().subscribe((res) => {
        this.articaldown = res;
      });
    }

    this.PurchaseReturnForm.controls['ArticleId'].reset();
    if (this.ArticleOpenFlagValue == 0) {
      this.PurchaseReturnForm.controls['ArticleSelectedColor'].reset();
      this.PurchaseReturnForm.controls['ArticleSelectedSize'].reset();
      this.PurchaseReturnForm.controls['ArticleRatio'].reset();
      this.PurchaseReturnForm.controls['ArticleRate'].reset();
      this.PurchaseReturnForm.controls['Category'].reset();
    }

    this.PurchaseReturnForm.controls['NoPacksNew'].reset();

    this.AddArticle = true;
    this.hideElement = true;
    this.articalData = false;
    this.ArticleOpenFlag = true;
    this.ArticleRatio = "";
    this.ArticleRate = "";
    this.Category = "";
    this.ArticleSelectedColor = [];
    this.ArticleSelectedSize = [];
    this.colorcountdown = [];

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
  doPurchaseReturn() {
    document.getElementById('submit-button').setAttribute('disabled', 'true');
    this.spinner.show();
    // this.PurchaseReturnForm.get('ArticleId').clearValidators()
    // this.PurchaseReturnForm.get('VendorId').clearValidators()
    // this.PurchaseReturnForm.get('InwardNumberId').clearValidators()
console.log('test2323',this.ArticleSelectedColor)
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    this.PurchaseReturnForm.value.PRNumberId = this.PRO_Number;
    this.PurchaseReturnForm.value.PRId = this.PRId;
    this.PurchaseReturnForm.value.UserId = userdata[0].Id;
    this.PurchaseReturnForm.value.ArticleOpenFlag = this.ArticleOpenFlagValue;
    this.PurchaseReturnForm.value.VendorId = this.vId;
    if (this.route.snapshot.paramMap.get('id')) {
      this.PurchaseReturnForm.value.ArticleId = this.ArticleId;
      this.PurchaseReturnForm.value.PRId = this.PRId;
      this.userService.updatepurchasereturnform(this.PurchaseReturnForm.value).subscribe(
        userdata => {
          console.log('userdata', userdata)
          // Re-render the DataTable
          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            
            });
          }
          document.getElementById('submit-button').removeAttribute('disabled');
          this.successUpdate(userdata);
          this.spinner.hide();
        }
      );
    }
    else {
      this.PurchaseReturnForm.value.ArticleId = this.ArticleId.ArticleId;
    this.PurchaseReturnForm.value.VendorId = this.vId;

      this.userService.dopurchasereturnform(this.PurchaseReturnForm.value).subscribe(
        userdata => {
          console.log('userdata', userdata)
          // Re-render the DataTable
          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            
            });
          }
          this.spinner.hide();
          document.getElementById('submit-button').removeAttribute('disabled');
          this.success(userdata);
        }
      );
    }




  }
  // User Add success function
  success(data) {
    if (data.id != "") {
      this.PurchaseReturnOrderLabel = true;
      this.toastr.success('Success', 'Purchase Number Add Successfully');
      let PrnumberId = "";
      PrnumberId = data.PRNumberId;
      this.router.navigate(['/purchasereturn', { PRONO: PrnumberId }]);
      this.getPROList(PrnumberId);
      this.formrestvalue();
      //this.router.navigate(['/purchasereturnlist']);
    } else if (data.NoOfSetNotMatch == "true") {
      this.toastr.error('Failed', 'No of pieces greater than original value');
    } else if (data.ZeroNotAllow == "true") {
      this.toastr.error('Failed', 'Zero value not allow for "no of pieces"');
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
    this.spinner.show();
    this.PurchaseReturnForm.get('ArticleId').clearValidators()
    this.PurchaseReturnForm.get('VendorId').clearValidators()
    this.PurchaseReturnForm.get('InwardNumberId').clearValidators()
    this.userService.getpurchasereturnidwise(id).subscribe((res) => {
      console.log('res', res)

      this.PRId = res[0].PRId;
      this.ArticleNumber = res[0].ArticleNumber
      this.ArticleId = res[0].ArticleId
      this.InwardNumberId = res[0].InwardNumberId
      this.VendorId = res[0].VendorId
      this.GRNnumber = res[0].GRNnumber
      this.ArticleRate = res[0].ArticleRate
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
        let assignnopacks = {};
        if (res[0].Colorflag == 1) {
          this.noofpackcount = true;
          this.colorcountdown = this.ArticleSelectedColor;
          let i;
          var Count1 = Object.keys(this.colorcountdown).length;
          var nameArr = res[0].SalesNoPacks.split(',');
          var nameReturnArr = res[0].ReturnNoPacks.split(',');
          let generatenopack;
          let generatenewnopack;
          for (i = 0; i < Count1; i++) {
            generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
            generatenewnopack = 'NoPacksNew_' + this.colorcountdown[i]['Id'];
            assignnopacks[generatenopack] = nameArr[i];
            assignnopacks[generatenewnopack] = nameReturnArr[i];
            this.PurchaseReturnForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
            this.PurchaseReturnForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());
            this.totalqualityLength = true;
            this.myFormValueChanges$ = this.PurchaseReturnForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
            this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
          }
          setTimeout(() => {
            $(".totalquality").text(this.totalQuantity);
          }, 200);
        } else {
          this.totalqualityLength = false;
          this.noofpackcount = false;
          this.PurchaseReturnForm.addControl('NoPacks', new FormControl());
          this.NoPacks = res[0].SalesNoPacks;
        }
        this.PurchaseReturnForm.patchValue(assignnopacks);
        this.editarray = {
          Remark: res[0].Remark,
          ArticleId: res[0].ArticleId,
          InwardNumberId: res[0].InwardNumberId,
          VendorId: res[0].vname,
          Category: res[0].Category
        }
        this.PurchaseReturnForm.patchValue(this.editarray);
        this.AddArticle = false;
        this.articalData = true;
        this.Submitbutton = true;
        // this.editPurchase = true;
        $('.purchasereturnfields_outward').show();
        this.spinner.hide();
      }
      else {
        this.totalqualityLength = false;
        this.sets_label = "Pieces";
        this.ArticleOpenFlag = false;
        this.noofpackcount = false;
        this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
        this.PurchaseReturnForm.addControl('NoPacks', new FormControl());
        this.NoPacks = res[0].SalesNoPacks; //Remaining To Add
        this.GETNOPACKS = res[0].ReturnNoPacks
        this.Category = res[0].Category;
        this.editarray = {
          Remark: res[0].Remark,
          ArticleId: res[0].ArticleId,
          InwardNumberId: res[0].InwardNumberId,
          VendorId: res[0].VendorId,
          Category: res[0].Category
        }
        this.PurchaseReturnForm.patchValue(this.editarray);
        this.AddArticle = false;
        this.articalData = true;
        this.Submitbutton = true;
        // this.editPurchase = true;
        $('.purchasereturnfields_outward').show();
        this.spinner.hide();
      }
    });
  }


  successUpdate(data) {
    if (data['status'] == "failed") {
      if (data['NoOfSetNotMatch'] == true) {
        this.toastr.error('Failed', 'No of pieces greater than original value');
      }
    }
    else if (data['status'] == "success") {
      this.PurchaseReturnOrderLabel = true;
      this.toastr.success('Success', 'Purchase return is updated Successfully');
      let PrnumberId = "";
      PrnumberId = data['id'];
      this.AddArticle = false;
      this.articalData = true;
      this.Submitbutton = true;
      this.getPROList(PrnumberId);
      this.router.navigate(['/purchasereturn', { PRONO: PrnumberId }]);
      this.formrestvalue();

    }
  }
}

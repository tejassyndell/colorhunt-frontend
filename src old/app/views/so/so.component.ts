import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
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

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}

class Person {
  Id: number;
  SoNumber: string;
  Name: string;
  TotalSoPieces: string;
  SoDate: string;
  Destination: string;
  Transporter: string;
  OWID: number;
  Action: string
}

@Component({
  selector: 'app-so',
  templateUrl: './so.component.html',
  styleUrls: ['./so.component.scss']
})

export class SoComponent implements OnInit {
  ApiURL: string = environment.apiURL;

  public colordropdown: any = [];
  public sizedropdown: any = [];
  public ratiodropdown: any = [];

  public solist: Person[];
  public startnumber: any;

  public editarray = {};
  public partypdown: any = [];
  public articaldown: any = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
  SalesOrderLabel: boolean = false;
  dtTrigger: Subject<any> = new Subject();

  dropdownSettings = {};
  soForm: FormGroup;
  partyaddForm: FormGroup;
  SoCurrentDate: Date;
  SoNumberId: any;
  hideElement: boolean = true;
  articalData: boolean = false;
  Disabled = true;
  AddArticle = true;
  isEdit: any;
  isDelete: any;
  SO_Number: any;
  SO_Number_FinancialYear: any;
  ArticleOpenFlag: boolean = true;
  noofpackcount: boolean = false;
  public colorcountdown = [];
  ArticleNumber: any;
  ArticleId: any;
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
  getuserdata: any;
  UserWiseData: boolean = true;
  ArticleOpenFlagValue: any;
  sets_label: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  myFormValueChanges$;
  totalQuantity: number = 0;
  totalqualityLength: boolean = false;
  GSTType: string = 'GST';
  SelectedPartyId: number;
  Category: any;
  dateDisabled: boolean = false;

  constructor(private http: HttpClient,private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Add SO | Colorhunt");
    this.soForm = this.formBuilder.group({
      SoNumberId: [''],
      PartyId: [''],
      Date: ['', [Validators.required]],
      ArticleId: ['', [Validators.required]],
      Remarks: [''],
      NoPacks: [''],
      NoPacksNew: [''],
      Destination: ['', [Validators.required]],
      Transporter: ['', [Validators.required]],
      ArticleSelectedColor: [''],
      ArticleSelectedSize: [''],
      ArticleRatio: [''],
      ArticleRate: ['', [Validators.required, Validators.min(1)]],
      GST: [''],
      GST_Percentage: ['', [Validators.min(0), Validators.max(50)]],
      GSTType: [''],
      Category: ['']
    });

    this.partyaddForm = this.formBuilder.group({
      PartyName: ['', [Validators.required]],
      PartyContact: ['', [Validators.required]],
      PartyAddress: ['', [Validators.required]]
    });

    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }

  ngOnInit() {
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



      this.userService.partylist().subscribe((res) => {
        this.partypdown = res;
      });



      let data = this.route.snapshot.paramMap.get('SONO');
      let get_id = this.route.snapshot.paramMap.get('id');
      if (data == "Add") {
        this.SalesOrderLabel = false;
      } else {
        this.SoNumberId = data;
        this.SalesOrderLabel = true;
      }

      console.log('sdfsdfsd', this.SO_Number)

      if (data != "" && data != undefined) {
        this.SOPAGE = "Edit";
        if (data != "Add") {
          // this.userService.remainingarticlelist().subscribe((res) => {
          //   this.articaldown = res;
          // });
          this.userService.remainingarticlelistsyn(get_id).subscribe((res) => {
            this.articaldown = res;
          });
        }
        this.SO_Number = data;

        this.getSOList(this.SO_Number);
      }



    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 5) {
          let parameterInnerId = this.route.snapshot.paramMap.get('id');
          let parameterId = this.route.snapshot.paramMap.get('SONO');
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
        if (data[i].PageId == 5) {
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
    this.SO_Number = res.SoNumberId;
    this.SO_Number_FinancialYear = res.SONumber_Financial;
    this.SoNumberId = res.Id;
    this.router.navigate(['/so', { SONO: this.SO_Number }]);
    this.getSOList(this.SoNumberId);
  }

  onChangePartyId(event) {
    // debugger;

    console.log('ddd', event)
    if (event.Id != "") {
      this.SelectedPartyId = event.Id;
    }
    this.userService.remainingarticlelistsyn(event.Id).subscribe((res) => {
      this.articaldown = res;
    });
    this.totalqualityLength = false;
    let i;
    if (this.ArticleSelectedColor.length > 0) {
      for (i = 0; i < this.ArticleSelectedColor.length; i++) {
        this.noofpackcount = true;
        const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
        const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

        this.soForm.removeControl(inputname);
        this.soForm.removeControl(inputname2);
      }
    }
    let data = this.route.snapshot.paramMap.get('SONO');
    if (data == "ADD") {
      this.soForm.controls['GST'].reset();
      this.soForm.controls['GST_Percentage'].reset();
      this.soForm.controls['GSTType'].reset();
    }
    this.ArticleId = null;
    this.soForm.controls['ArticleId'].reset();
    if (this.ArticleOpenFlagValue == 0) {
      this.soForm.controls['ArticleSelectedColor'].reset();
      this.soForm.controls['ArticleSelectedSize'].reset();
      this.soForm.controls['ArticleRatio'].reset();
      this.soForm.controls['ArticleRate'].reset();
      this.soForm.controls['Category'].reset();
    }
    this.soForm.controls['NoPacksNew'].reset();
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
  onChangartical(event) {
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    if (event.Id !== undefined && event.Id !== null) {
      this.spinner.show();
      this.articalData = true;
      if (event.Id !== undefined) {
        const newVal = event.Id;
        this.userService.getinwardarticledataso(userdata[0].Id, this.SelectedPartyId, newVal).subscribe((res) => {
          console.log('res', res)
          // this.userService.getinwardarticledata(newVal).subscribe((res) => {
          if (res[0].ArticleOpenFlag == 0) {
            console.log('zero')
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
              //alert("ss");
              let generatenopack;
              for (i = 0; i < Count1; i++) {
                generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
                assignnopacks[generatenopack] = nameArr[i];
                this.soForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
                this.soForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());

                this.totalqualityLength = true;
                this.myFormValueChanges$ = this.soForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].valueChanges;
                // subscribe to the stream so listen to changes on units
                this.soForm.controls['NoPacksNew_' + this.colorcountdown[i]['Id']].reset();
                this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
              }
            } else {
              //alert("asdas");
              this.totalqualityLength = false;
              this.noofpackcount = false;
              this.soForm.addControl('NoPacks', new FormControl());
              this.NoPacks = res[0].SalesNoPacks;
            }

            this.soForm.patchValue(assignnopacks);
          } else {
            console.log('one')
            //alert("asdasd");
            this.sets_label = "pieces";
            this.ArticleOpenFlag = false;
            this.totalqualityLength = false;
            this.noofpackcount = false;
            this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
            this.ArticleRate = res[0].ArticleRate;
            this.Category = res[0].Category;
            this.soForm.addControl('NoPacks', new FormControl());

            this.NoPacks = res[0].NoPacks;
          }
          this.spinner.hide();

        });
      }




    } else {
      this.articalData = false;
    }

  }

  cancelform() {
    let data = this.route.snapshot.paramMap.get('SONO');
    this.router.navigate(['/so', { SONO: data }]);
    this.formrestvalue();
  }

  TotalQualityPeace() {
    let i;
    if (this.ArticleSelectedColor !== null) {
      if (this.ArticleSelectedColor.length > 0) {
        this.totalQuantity = 0;
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];
          if (this.soForm.controls[inputname].value !== null && this.soForm.controls[inputname].value != "") {
            this.totalQuantity += parseInt(this.soForm.controls[inputname].value);
          }
        }
        $(".totalquality").text(this.totalQuantity);
      }
    }
  }

  formrestvalue() {
    this.totalqualityLength = false;
    let i;
    if (this.ArticleSelectedColor.length > 0) {
      for (i = 0; i < this.ArticleSelectedColor.length; i++) {
        this.noofpackcount = true;
        const inputname = 'NoPacks_' + this.ArticleSelectedColor[i]['Id'];
        const inputname2 = 'NoPacksNew_' + this.ArticleSelectedColor[i]['Id'];

        this.soForm.removeControl(inputname);
        this.soForm.removeControl(inputname2);
      }
    }

    this.userService.remainingarticlelist().subscribe((res) => {
      this.articaldown = res;
    });

    let data = this.route.snapshot.paramMap.get('SONO');
    if (data == "ADD") {
      this.soForm.controls['GST'].reset();
      this.soForm.controls['GST_Percentage'].reset();
      this.soForm.controls['GSTType'].reset();
    }

    this.ArticleId = null;
    this.soForm.controls['ArticleId'].reset();
    if (this.ArticleOpenFlagValue == 0) {
      this.soForm.controls['ArticleSelectedColor'].reset();
      this.soForm.controls['ArticleSelectedSize'].reset();
      this.soForm.controls['ArticleRatio'].reset();
      this.soForm.controls['ArticleRate'].reset();
      this.soForm.controls['Category'].reset();
    }

    this.soForm.controls['NoPacksNew'].reset();

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
        this.userService.deleteso(id, ArticleOpenFlag , item[0].Id).subscribe((res) => {
          // Re-render the DataTable
          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            
            });
          }
          if (res) {
            this.toastr.success('Success', 'SO Delete Successfully');
            this.getSOList(this.route.snapshot.paramMap.get('SONO'));
            this.router.navigate(['/so', { SONO: this.route.snapshot.paramMap.get('SONO') }]);
            this.formrestvalue();
          }
        });
      } else {

      }
    });
  }

  getSOList(SONO) {
    console.log('SONOOOOO:', SONO)

    localStorage.setItem('SONO', SONO);

    setTimeout(() => this.spinner.show(), 10);
    this.userService.sodateremarkfromsono(SONO).subscribe((res) => {
      if (res["length"] > 0) {
        this.editarray = {
          Date: res[0].SoDate,
          PartyId: res[0].Name,
          Transporter: res[0].Transporter,
          Destination: res[0].Destination,
          Remarks: res[0].Remarks,
          GST: res[0].GSTAmount,
          GST_Percentage: res[0].GSTPercentage,
          GSTType: res[0].GSTType,
          SoNumberId: res[0].Id
        }

        this.GSTType = res[0].GSTType;
        this.SO_Number = res[0].Id;
        this.SO_Number_FinancialYear = res[0].SO_Number_FinancialYear;
        this.SelectedPartyId = res[0].PartyId;
        this.soForm.patchValue(this.editarray);
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
          const data = localStorage.getItem('SONO');
          console.log('SONOset:', SONO)

          that.http.post<DataTablesResponse>(
              this.ApiURL+`/solistfromsonumber/${data}`,
              dataTablesParameters, {}
            ).subscribe(resp => {
              that.solist = resp.data;
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



    // this.userService.solistfromsonumber(SONO).subscribe((res) => {
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
    //     }, 100);

    //   }

    // });
  }

  public edit(id) {
    this.spinner.show();
    this.userService.getsoidwise(id).subscribe((res) => {
      if (this.route.snapshot.paramMap.get('id')) {
        this.AddArticle = false;
        this.hideElement = false;
      } else {
        this.AddArticle = true;
        this.hideElement = true;
      }


      if (res['length'] > 0) {
        this.editarray = {
          SoNumberId: res[0].SoNumberId,
          ArticleId: res[0].ArticleId,
          NoPacks: res[0].NoPacks
        }

        this.SoNumberId = res[0].SoNumberId;
        this.SO_Number_FinancialYear = res[0].SoNumber;
        this.SO_Number = res[0].SoNumber;
        this.GETNOPACKS = res[0].NoPacks;
        let userdata = JSON.parse(localStorage.getItem('logindata'));

        this.userService.getinwardarticledataso(userdata[0].Id, this.SelectedPartyId, res[0].ArticleId).subscribe((res) => {
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
            this.ArticleRate = res[0].ArticleRate;
            this.Category = res[0].Category;
            let assignnopacks = {};
            let getdataassignnopacks = {};
            if (res[0].Colorflag == 1) {
              this.noofpackcount = true;
              this.totalqualityLength = true;
              this.colorcountdown = this.ArticleSelectedColor;
              let i;
              var Count1 = Object.keys(this.colorcountdown).length;
              var nameArr = res[0].SalesNoPacks.split(',');
              var nameNopacksArr = this.GETNOPACKS.split(',');

              let generatenopack;
              let getdatageneratenopack;
              this.totalQuantity = 0;
              for (i = 0; i < Count1; i++) {
                generatenopack = 'NoPacks_' + this.colorcountdown[i]['Id'];
                getdatageneratenopack = 'NoPacksNew_' + this.colorcountdown[i]['Id'];
                assignnopacks[generatenopack] = nameArr[i];
                getdataassignnopacks[getdatageneratenopack] = nameNopacksArr[i];
                this.soForm.addControl('NoPacks_' + this.colorcountdown[i]['Id'], new FormControl());
                this.soForm.addControl('NoPacksNew_' + this.colorcountdown[i]['Id'], new FormControl());

                this.totalQuantity += parseInt(nameArr[i]);
                this.myFormValueChanges$ = this.soForm.controls[getdatageneratenopack].valueChanges;
                // subscribe to the stream so listen to changes on units
                this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
              }

              setTimeout(() => {
                $(".totalquality").text(this.totalQuantity);
              }, 200);
            } else {
              this.totalqualityLength = false;
              this.noofpackcount = false;
              this.soForm.addControl('NoPacks', new FormControl());
              this.soForm.addControl('NoPacksNew', new FormControl());

              this.NoPacks = res[0].SalesNoPacks;
              this.GETNOPACKS = this.GETNOPACKS;
            }

            this.soForm.patchValue(assignnopacks);
            this.soForm.patchValue(getdataassignnopacks);
          } else {
            this.sets_label = "pieces";
            this.articalData = true;
            this.ArticleOpenFlag = false;
            this.noofpackcount = false;
            this.ArticleNumber = res[0].ArticleNumber;
            this.ArticleOpenFlagValue = res[0].ArticleOpenFlag;
            this.ArticleRate = res[0].ArticleRate;
            this.Category = res[0].Category;
            this.GETNOPACKS = this.GETNOPACKS;
            this.soForm.addControl('NoPacks', new FormControl());
            this.NoPacks = res[0].NoPacks;
          }
          this.spinner.hide();
        });
        this.soForm.patchValue(this.editarray);
      }
    });
  }

  onchangesets(id) {

  }

  restrictNumeric(e) {
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
        this.router.navigate(['/solist']);
      }
    );
  }
  // Initicate user add
  doSoform() {

          console.log('Form submitted!', this.soForm.value);



    document.getElementById('submit-button').setAttribute('disabled', 'true');
    this.spinner.show();

    let userdata = JSON.parse(localStorage.getItem('logindata'));


    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        PartyId: this.soForm.value.PartyId,
        Date: this.soForm.value.Date,
        ArticleId: this.soForm.value.ArticleId.Id,
        Remarks: this.soForm.value.Remarks,
        NoPacks: this.soForm.value.NoPacks.Id,
        Destination: this.soForm.value.Destination,
        Transporter: this.soForm.value.Transporter,
        UserId: userdata[0].Id
      }

      this.soForm.value.id = this.route.snapshot.paramMap.get('id');
      this.soForm.value.UserId = userdata[0].Id;
      this.soForm.value.ArticleOpenFlag = this.ArticleOpenFlagValue;
      this.soForm.value.GSTType = this.GSTType;
      
      
      this.soForm.value.PartyId = this.SelectedPartyId;
      this.userService.updateSo(this.soForm.value).subscribe(
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
      this.soForm.value.SoNumberId = this.SO_Number;
      this.soForm.value.UserId = userdata[0].Id;
      this.soForm.value.ArticleId = this.ArticleId.Id;
      this.soForm.value.ArticleOpenFlag = this.ArticleOpenFlagValue;
      this.soForm.value.GSTType = this.GSTType;

      this.soForm.value.PartyId = this.SelectedPartyId;
      this.userService.dosoform(this.soForm.value).subscribe(

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
  // User Add success function
  success(data, flag) {
    if (data.id != "") {
      let SonumberId = "";
      if (flag == 1) {
        this.toastr.success('Success', 'SO Add Successfully');
        SonumberId = data.SoNumberId;

      } else {
        this.toastr.success('Success', 'SO Update Successfully');
        SonumberId = this.route.snapshot.paramMap.get('SONO');

      }
      this.SalesOrderLabel = true;
      this.router.navigate(['/so', { SONO: SonumberId }]);
      this.getSOList(SonumberId);
      this.formrestvalue();
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




}

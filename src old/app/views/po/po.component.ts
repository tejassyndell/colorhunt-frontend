import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';


class Person {
  Id: number;
  PurchaseNumber: string;
  FinancialYear: string;
  ArticleNumber: string;;
  Name: string;
  Title: number;
  NumPacks: number;
  WorkStatusName: string;
  InwardArticleId: string;
  POId: string;
  ArticleId: string;
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
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.scss']
})
export class PoComponent implements OnInit {

  ApiURL: string = environment.apiURL;
  public startnumber: any;

  public vendordropdown: any = [];
  public workorderdropdown: any = [];
  public catedropdown: any = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();

  PO_Number: any;
  PO_Number_FinancialYear: any;
  PoOrderLabel: boolean = false;
  PoCurrentDate: Date;
  poForm: FormGroup;
  public editarray = {};
  errorexit: string = "";
  ArtId: any;
  POId: any;
  vndId: any;
  CheckFileUpload: boolean;
  POPAGE: any;
  FileuploadformData: any;
  Disabled: boolean = false;
  SubCategoryDisabled = true;
  isDisabled: boolean = false;
  POImage: any;
  BaseURL: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  vendor = [];
  public brandropdown: any = [];
  public subcatedropdown: any = [];
  public podatalist: any = [];
  public articledropdown: any = [];
  VendorId: any;
  POIMAGES: boolean = true;
  imageflag: boolean = false;
  MultipleImage: boolean = false;
  // Categorydisable: boolean = false;
  // SubCategorydisable: boolean = false;
  // Seriesdisable: boolean = false;
  DropdownArticle: boolean = true;
  ArticleNumber: any;

  CategoryId: number;
  SubCategoryId: number;
  SeriesId: number;
  CategoryName: any;
  SubCategoryName: any;
  StyleDescription: any;
  Series: any;
  BrandName: any;
  BrandId: number;
  ArticalVal: any;
  dateDisabled: boolean = false;

  constructor(private http: HttpClient,private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Add PO | Colorhunt");


    this.poForm = this.formBuilder.group({
      PO_Number: [''],
      VendorId: ['', [Validators.required]],
      // CategoryId: ['', [Validators.required]],
      //  SubCategoryId: [''],
      ArticleId: ['', [Validators.required]],
      NumPacks: ['', [Validators.required]],
      PoDate: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
      // StyleDescription: ['', [Validators.required]],
      PO_Image: [''],
      WorkOrderStatusId: [''],
      // BrandId: ['', [Validators.required]],
      MultipleImage: [''],
      WorkOrderDate: ['']
    });
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    this.userService.getarticlepopending().subscribe((res) => {
      this.articledropdown = res;
    });
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
      this.POPAGE = "Add";
      this.BaseURL = environment.UploadBaseURL;
      this.POIMAGES = true;
      this.poForm.controls["PO_Image"].enable();

      //this.Disabled = false;
      this.CheckFileUpload = false;


      this.userService.workorderlist().subscribe((res) => {
        this.workorderdropdown = res;
      });

      this.userService.vendorlist().subscribe((res) => {
        this.vendordropdown = res;
      });

      this.userService.categorylist().subscribe((res) => {
        this.catedropdown = res;
      });

      this.userService.brandlist().subscribe((res) => {
        this.brandropdown = res;
      });

      //let data = this.route.snapshot.paramMap.get('id');

      let data = this.route.snapshot.paramMap.get('PO');
      let get_id = this.route.snapshot.paramMap.get('id');


      if (data == "Add") {
        // this.poForm.controls['VendorId'].enable();
        this.isDisabled = false;
        this.PoCurrentDate = new Date();
        this.PoOrderLabel = false;
      } else {
        this.isDisabled = true;
        // this.poForm.controls['VendorId'].disable();
        //  this.SoNumberId = data;
        this.PoOrderLabel = true;
        this.PO_Number = data;
      }

      if (data != "" && data != undefined) {
        this.POPAGE = "Edit";
        this.PO_Number = data;
        if ((get_id != "" && get_id != undefined)) {
          this.edit(data, get_id);
        }


        this.getPoList(data);
        // this.userService.inwardgetpolist(data).subscribe((res) => {
        //   //this.poropdown = res;
        // });


      } else {

        this.userService.getponumber().subscribe((res) => {
          this.spinner.hide();
          this.PONumberAssign(res);
        });
      }
    }
  }

  onChekboxChecked(e) {
    if (e.target.checked) {
      this.imageflag = true;
    } else {
      this.imageflag = false;
    }
  }

  edit(data, Id) {
    setTimeout(() => this.spinner.show(), 10);
    this.userService.getpoIdwise(Id).subscribe((res) => {
      this.Disabled = true;
      this.POIMAGES = false;
      //this.poForm.controls["PO_Image"].disable();
      this.vndId = res[0].VendorId
      this.userService.getcategoryidwise(res[0].CategoryId).subscribe((res) => {
        this.subcatedropdown = res;
      });

      this.DropdownArticle = false;
      this.ArtId = res[0].ArticleId;
      this.PO_Number = res[0].PO_Number;
      let WorkOrderStatusId = res[0].WorkOrderStatusId;
      let BrandId = res[0].BrandId;
      this.editarray = {
        PO_Number: res[0].PurchaseNumber,
        VendorId: res[0].vname,
        
        Remarks: res[0].Remarks,
        StyleDescription: res[0].StyleDescription,


        CategoryId: res[0].CategoryId,
        SubCategoryId: (res[0].SubCategoryId != 0) ? res[0].SubCategoryId : '',


        ArticleId: res[0].ArticleId,
        NumPacks: res[0].NumPacks,
        PoDate: res[0].PoDate,
        BrandId: (BrandId == 0) ? '' : res[0].BrandId,
        WorkOrderStatusId: (WorkOrderStatusId == 0) ? '' : WorkOrderStatusId,
        WorkOrderDate: res[0].WorkOrderDate,
      }
      this.ArticleNumber = res[0].ArticleNumber;
      this.CategoryId = res[0].CategoryId;
      this.SubCategoryId = res[0].SubCategoryId;
      this.SeriesId = res[0].SeriesId;
      this.CategoryName = res[0].CategoryName;
      this.SubCategoryName = res[0].SubCategoryName;
      this.Series = res[0].Series;
      this.StyleDescription = res[0].StyleDescription;
      this.BrandId = res[0].BrandId;
      this.BrandName = res[0].BrandName;

      this.PO_Number_FinancialYear = res[0].FinancialYear;
      this.POImage = res[0].PO_Image;
      this.poForm.patchValue(this.editarray);
      this.spinner.hide();

    });
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 6) {
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
        if (data[i].PageId == 6) {
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

  deletesuccess(data) {
    if (data == "SUCCESS") {
      this.toastr.success('Success', 'Po Deleted Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  public delete(id, POId, ArtId) {
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
        this.userService.deletepo(id, POId, ArtId, item[0].Id).subscribe((res) => {
          this.deletesuccess(res);

          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            });
          }

          this.router.navigate(['/po', { PO: POId }]);
          this.getPoList(POId);
          this.formrestvalue();
        });
      } else {

      }
    });
  }

  PONumberAssign(res) {
    this.PO_Number = res.PO_Number;
    this.PO_Number_FinancialYear = res.PO_Number_Financial;
  }

  uploadFile(event) {
    let elem = event.target;

    if (elem.files.length > 0) {
      this.FileuploadformData = new FormData();
      this.FileuploadformData.append("PO_Image", event.target.files[0]);
      this.CheckFileUpload = true;
    }
    elem.value = "";
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
  doPoform() {

    console.log('test121',this.VendorId.Id)

    document.getElementById('submit-button').setAttribute('disabled', 'true');
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.spinner.show();
    if (this.route.snapshot.paramMap.get('id')) {
      // let editobject = {
      // //  id: this.route.snapshot.paramMap.get('id'),
      // //  VendorId: this.poForm.value.VendorId,
      //  // ArticleId: this.poForm.value.ArticleId,
      //  // CategoryId: this.poForm.value.CategoryId,
      // //  MultipleImage: this.poForm.value.MultipleImage,
      // //  ArtId: this.ArtId,
      // //  PO_Number: this.PO_Number,
      // //  NumPacks: this.poForm.value.NumPacks,
      //  // PoDate: this.poForm.value.PoDate,
      //  // BrandId: this.poForm.value.BrandId,
      //  // Remarks: this.poForm.value.Remarks,
      //  // StyleDescription: this.poForm.value.StyleDescription,
      // //  WorkOrderStatusId: this.poForm.value.WorkOrderStatusId,
      //  // WorkOrderDate: this.poForm.value.WorkOrderDate
      // }

      if (this.CheckFileUpload == false) {
        this.FileuploadformData = new FormData();
      }
      // this.FileuploadformData = new FormData();
      this.FileuploadformData.append("ArticleId", this.ArticalVal);
      this.FileuploadformData.append("CategoryId", this.CategoryId);
      this.FileuploadformData.append("SubCategoryId", this.SubCategoryId);
      this.FileuploadformData.append("SeriesId", this.SeriesId);
      this.FileuploadformData.append("NumPacks", this.poForm.value.NumPacks);
      this.FileuploadformData.append("PO_Number", this.PO_Number);
      this.FileuploadformData.append("PoDate", this.poForm.value.PoDate);
      this.FileuploadformData.append("BrandId", this.BrandId);
      this.FileuploadformData.append("Remarks", this.poForm.value.Remarks);
      this.FileuploadformData.append("MultipleImage", this.poForm.value.MultipleImage);
      // this.FileuploadformData.append("StyleDescription", this.poForm.value.StyleDescription);
      this.FileuploadformData.append("VendorId", this.vndId);
      this.FileuploadformData.append("id", this.route.snapshot.paramMap.get('id'));
      this.FileuploadformData.append("ArtId", this.ArtId);
      this.FileuploadformData.append("WorkOrderStatusId", this.poForm.value.WorkOrderStatusId);
      this.FileuploadformData.append("WorkOrderDate", this.poForm.value.WorkOrderDate);
      this.FileuploadformData.append("UserId", item[0].Id);

      this.userService.updatePo(this.route.snapshot.paramMap.get('id'), this.FileuploadformData).subscribe(
        userdata => {
          this.updatesuccess(userdata);
          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            });
          }
          this.spinner.hide();


          
    this.poForm.controls['ArticleId'].reset([null]);

        }
      );
    } else {

      // let data = this.route.snapshot.paramMap.get('PO');
      // this.getPoList(data);


      if (this.CheckFileUpload == false) {
        this.FileuploadformData = new FormData();
      }
      this.FileuploadformData.append("ArticleId", this.ArticalVal);
      this.FileuploadformData.append("CategoryId", this.CategoryId);
      this.FileuploadformData.append("SubCategoryId", this.SubCategoryId);
      this.FileuploadformData.append("SeriesId", this.SeriesId);
      this.FileuploadformData.append("NumPacks", this.poForm.value.NumPacks);
      this.FileuploadformData.append("PO_Number", this.PO_Number);
      this.FileuploadformData.append("PoDate", this.poForm.value.PoDate);
      this.FileuploadformData.append("BrandId", this.BrandId);
      this.FileuploadformData.append("Remarks", this.poForm.value.Remarks);
      this.FileuploadformData.append("MultipleImage", this.poForm.value.MultipleImage);
      // this.FileuploadformData.append("StyleDescription", this.poForm.value.StyleDescription);
      this.FileuploadformData.append("VendorId",(this.vndId == undefined) ?  this.poForm.value.VendorId.Id : this.vndId);
      this.FileuploadformData.append("UserId", item[0].Id);
      this.userService.dopoform(this.FileuploadformData).subscribe(
        userdata => {
          this.spinner.hide();
          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.draw();
            });
          }
          if (userdata == "allreadyexits") {
            this.errorexit = "Article number already exists";
          } else {
            this.errorexit = "";
            this.success(userdata);
          }
        }
      );
    }

  }

  onChangeArticle(event) {

    if (event !== undefined && event !== null) {
      this.ArticalVal = event.Id;
      var newVal = '';
      if (event.Id === undefined) {
        newVal = event;
      } else {
        newVal = event.Id;
      }
      // this.SubCategoryDisabled  = false;

      if (newVal == "") {
        this.CategoryId = 0;
        this.SubCategoryId = 0;
        this.SeriesId = 0;
        this.BrandId = 0;

        this.CategoryName = "";
        this.SubCategoryName = "";
        this.StyleDescription = "";
        this.Series = "";
      } else {
        this.userService.getarticle_catscatserial(newVal).subscribe((res) => {
          this.CategoryId = res[0].CategoryId;
          this.SubCategoryId = res[0].SubCategoryId;
          this.SeriesId = res[0].SeriesId;
          this.CategoryName = res[0].CategoryName;
          this.SubCategoryName = res[0].SubCategoryName;
          this.StyleDescription = res[0].StyleDescription;
          this.Series = res[0].Series;
          this.BrandId = res[0].BrandId;
          this.BrandName = res[0].BrandName;
          // this.subcatedropdown = res;

          //  if(this.CategoryId!==null){

          //  }
          //  if(this.SubCategoryId!==null){

          //  }
          //  if(this.SeriesId!==null){

          //  }
        });
      }


    }
  }


  onChangeCategory(event) {
    if (event !== undefined && event !== null) {
      var newVal = '';
      if (event.Id === undefined) {
        newVal = event;
      } else {
        newVal = event.Id;
      }
      this.SubCategoryDisabled = false;
      // alert(newVal);

      this.userService.getcategoryidwise(newVal).subscribe((res) => {
        this.subcatedropdown = res;
      });
    }
  }
  // User Add success function
  // success(data) {
  //   if (data.id != "") {
  //     this.router.navigate(['/polist']);
  //     this.toastr.success('Success', 'PO Add Successfully');
  //   } else {
  //     this.toastr.error('Failed', 'Please try agin later');
  //   }
  // }

  success(data) {
    if (data.id != "") {
      let PO_Number = "";
      let PO_Id = "";
      //this.router.navigate(['/inwardlist']);
      PO_Number = data.PO_Id;
      PO_Id = data.PO_Id;
      this.toastr.success('Success', 'PO Add Successfully');
      this.spinner.show();
      this.PoOrderLabel = true;
      this.isDisabled = true;
      // this.poForm.controls['VendorId'].disable();
      this.router.navigate(['/po', { PO: PO_Number }]);

      this.getPoList(PO_Number);
      this.userService.getarticlepopending().subscribe((res) => {
        this.articledropdown = res;
      });
      // this.userService.pogetpolist(PO_Number).subscribe((res) => {
      //   this.poropdown = res;
      // });
      this.formrestvalue();
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  updatesuccess(data) {
    if (data.id != "") {
      //this.router.navigate(['/inwardlist']);
      this.toastr.success('Success', 'PO update Successfully');
      this.router.navigate(['/po', { PO: this.route.snapshot.paramMap.get('PO') }]);
      this.getPoList(this.route.snapshot.paramMap.get('PO'));
      this.ArtId = null
      this.formrestvalue();
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  cancelform() {
    this.subcatedropdown = [];
    this.router.navigate(['/po', { PO: this.route.snapshot.paramMap.get('PO') }]);
    this.formrestvalue();
  }

  formrestvalue() {
    if (this.route.snapshot.paramMap.get('PO') == 'Add') {
      this.poForm.controls['VendorId'].reset([null]);
      this.poForm.controls['Remarks'].reset();
      this.poForm.controls['PO_Number'].reset();
    }

    this.CategoryId = 0;
    this.SubCategoryId = 0;
    this.SeriesId = 0;
    this.BrandId = 0;
    this.CategoryName = "";
    this.SubCategoryName = "";
    this.StyleDescription = "";
    this.Series = "";
    this.BrandName = "";

    this.DropdownArticle = true;
    //this.poForm.controls['CategoryId'].reset([null]);
    //this.poForm.controls['SubCategoryId'].reset([null]);
    this.poForm.controls['ArticleId'].reset([null]);
    this.poForm.controls['NumPacks'].reset();
    // this.poForm.controls['StyleDescription'].reset();
    this.poForm.controls['WorkOrderStatusId'].reset([null]);
    //this.poForm.controls['BrandId'].reset([null]);
    this.poForm.controls['WorkOrderDate'].reset();

  }


  getPoList(PO) {
    localStorage.setItem('po', PO);
    this.userService.podateremarkfromPO(PO).subscribe((res) => {
      this.vndId = res[0].VendorId
      if (res["length"] > 0) {
        this.PO_Number = res[0].Id;
        this.PoCurrentDate = res[0].PoDate;
        if (res[0].MultipleImage == 1) {
          this.imageflag = true;
        } else {
          this.imageflag = false;
        }
        //this.MultipleImage = res[0].MultipleImage;
        this.editarray = {
          PoCurrentDate: res[0].PoDate,
          Remarks: res[0].Remarks,
          PO_Number: res[0].Id,
          MultipleImage: res[0].MultipleImage,
          VendorId: (res[0].VendorId != 0) ? res[0].Name : '',
          // BrandId: (res[0].BrandId != 0) ? res[0].BrandId : ''
        }
        this.PO_Number_FinancialYear = res[0].PO_Number_FinancialYear;
        this.poForm.patchValue(this.editarray);
      }
      console.log('yashvii', res[0].Vendor);

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
          const data = localStorage.getItem('po');
          that.http.post<DataTablesResponse>(
              this.ApiURL+`/polistfrompon/${data}`,
              dataTablesParameters, {}
            ).subscribe(resp => {
              this.podatalist = resp.data;
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

    // this.userService.polistfrompon(PO).subscribe((res) => {
    //   const data = res;
    //   if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //       // Destroy the table first
    //       dtInstance.destroy();
    //       this.podatalist = data;

    //       if (this.podatalist.length > 0) {
    //         this.isDisabled = true;
    //         // this.poForm.controls['VendorId'].disable();
    //       } else {
    //         this.isDisabled = false;
    //         // this.poForm.controls['VendorId'].enable();
    //       }
    //       // Call the dtTrigger to rerender again
    //       this.dtTrigger.complete();
    //       this.spinner.hide();
    //     });
    //   } else {
    //     this.podatalist = data;
    //     if (this.podatalist.length > 0) {
    //       // this.poForm.controls['VendorId'].disable();
    //       this.isDisabled = true;
    //     } else {
    //       this.isDisabled = false;
    //       // this.poForm.controls['VendorId'].enable();
    //     }
    //     this.dtTrigger.complete();
    //     this.spinner.hide();
    //   }

    // });


  }

  goBack() {
    window.history.back();
  }

}

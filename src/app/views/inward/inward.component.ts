import { Component, OnInit, ViewChild } from "@angular/core";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  NgForm,
} from "@angular/forms";
import {
  RouterModule,
  Routes,
  Router,
  ActivatedRoute,
  NavigationExtras,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ValidationService } from "../../services/config.service";
import { UserService } from "../../services/user.service";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { TooltipModule } from "ng2-tooltip-directive";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { timeout } from "q";
import { DomSanitizer } from "@angular/platform-browser";
import { Title } from "@angular/platform-browser";
// import { ConsoleService } from "@ng-select/ng-select/ng-select/console.service";

class Person {
  Id: number;
  GRN_Ner: string;
  Name: string;
  TotalInwardPieces: string;;
  InwardDate: string;
  SODataCheck: number;
  SOID: number;
  GRN: string;
  Action: string;
  NoPacks : string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}


@Component({
  selector: "app-inward",
  templateUrl: "./inward.component.html",
  styleUrls: ["./inward.component.scss"],
})
export class InwardComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public startnumber: any;

  public vendordropdown: any = [];
  public colordropdown: any = [];
  public rejectiondropdown: any = [];
  public sizedropdown: any = [];

  public ratiodropdown: any = [];
  public sizecountdown: any = [];
  public ratiocountdown: any = [];
  public colorcountdown = [];
  public poropdown: any = [];
  public InwardCurrentDate: Date;
  public podropdown: any = [];
  public brandropdown: any = [];
  public articdropdown: any = [];
  public editarray = {};
  public rejcountdown = [];
  public rejectionShow: boolean = false;
  isRejection: boolean = true;
  PoId: any;
  accessdenied: boolean = true;
  @ViewChild("formDirective") private formDirective: NgForm;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();

  InwardOrderLabel: boolean = false;
  error: string = "";
  inwardForm: FormGroup;
  qty: boolean = false;
  totalqualityLength: boolean = false;
  noofpackcount: boolean = false;
  ArticleStatusView: boolean = false;
  DropdownPO: boolean = true;
  ColorDisabled = true;
  NoPacksMulti: any;
  MultipleNoPacks: any;
  VID: any;
  ///multi select
  dropdownList = [];
  ArticleSelectedColor = [];
  ArticleSelectedSize = [];
  RejectionSelected = [];
  dropdownSettings = {};
  rejectdropdownSettings = {};
  numpack: any;
  colorflag: any;
  articlenumber: any;
  vId: any;
  vName: any;
  vendername: any;
  GRN_Number: any;
  GRN_Number_FinancialYear: any;
  PurchaseNumber_FinancialYear: any;
  newratiocount: any;
  public TotalQty: any = 0;
  INWARDPAGE: any;
  public inwardlist: Person[];
  isEdit: any;
  isDelete: any;
  PO_Label: String = "PO No.";
  Article_Label: String = "Article No. ";
  GRNId: any;
  Remark: any;
  InwardDate: any;

  PurchaseNumber: any;
  ArticleNumberSet: any;
  editInward: boolean = false;
  ArticleId: any;
  isList: any;
  apiId : any
  isAdd: any;
  fileUrl;
  StyleDescription: any;
  BrandName: any;
  CategoryTitle: string;
  Series: string;
  SubCategory: string;
  colorId: [""];
  ddcolorId: any;
  ArticleStatus: boolean;
  ///end
  name: string;
  inwardIdsticker: any;
  myFormValueChanges$;
  totalQuantity: number = 0;
  articleratecheck: boolean = false;
  Rate: any;
  dateDisabled: boolean = false;
  norejectioncount: boolean = false;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Add Inward | Colorhunt");
    this.inwardForm = this.formBuilder.group({
      GRN_Number: [""],
      PoId: ["", [Validators.required]],
      NoPacks: [""],
      ColorId: ["", [Validators.required]],
      RejectionId: [""],
      SizeId: ["", [Validators.required]],
      RatioId: [""],
      // InwardDate: ['', [Validators.required]],
      Rate: ["", [Validators.required]],
      Weight: ["", [Validators.required]],
      Remark: [],
      VendorId: ["", [Validators.required]],
      // BrandId: [''],
      ArticleStatus: [""],
      InwardDate: ["", [Validators.required]],
      LoggedId: [" "],
    });
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem("userdata"));
    let rolerights = JSON.parse(localStorage.getItem("roleright"));
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
      this.INWARDPAGE = "Add";
      this.inwardForm.controls["Rate"].disable();
      this.inwardForm.controls["RatioId"].disable();
      this.inwardForm.controls["Weight"].disable();

      this.InwardCurrentDate = new Date();
      this.ColorDisabled = true;
      this.dropdownSettings = {
        singleSelection: false,
        idField: "Id",
        textField: "Name",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        itemsShowLimit: 2,
        enableCheckAll: false,
        allowSearchFilter: true,
      };
      this.rejectdropdownSettings = {
        singleSelection: false,
        idField: "Id",
        textField: "RejectionType",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        itemsShowLimit: 2,
        enableCheckAll: false,
        allowSearchFilter: true,
      };

      this.userService.vendorlist().subscribe((res) => {
        this.vendordropdown = res;
        this.podropdown = res;
      });

      // this.userService.articallist().subscribe((res) => {
      //   this.articdropdown = res;
      // });

      this.userService.brandlist().subscribe((res) => {
        this.brandropdown = res;
      });

      this.userService.colorlist().subscribe((res) => {
        var Count = Object.keys(res).length;
        let articlecolor_dropdown;
        let i;
        let val;
        articlecolor_dropdown = [];
        for (i = 0; i < Count; i++) {
          val = { Id: res[i].Id, Name: res[i].Name };
          articlecolor_dropdown.push(val);
        }
        this.colordropdown = articlecolor_dropdown;
      });

      this.userService.getrejectionlist().subscribe((res) => {
        var Count = Object.keys(res).length;
        let rejection_dropdown;
        let i;
        let val;
        rejection_dropdown = [];
        for (i = 0; i < Count; i++) {
          val = { Id: res[i].Id, RejectionType: res[i].RejectionType };
          rejection_dropdown.push(val);
        }
        this.rejectiondropdown = rejection_dropdown;
      });

      this.userService.sizelist().subscribe((res) => {
        var Count = Object.keys(res).length;
        let articlesize_dropdown;
        let i;
        let val;
        articlesize_dropdown = [];
        for (i = 0; i < Count; i++) {
          val = { Id: res[i].Id, Name: res[i].Name };
          articlesize_dropdown.push(val);
        }
        this.sizedropdown = articlesize_dropdown;
      });

      let data = this.route.snapshot.paramMap.get("GRN");
      let get_id = this.route.snapshot.paramMap.get("id");

      if (data == "Add") {
        this.InwardOrderLabel = false;
      } else {
        //  this.SoNumberId = data;

        this.InwardOrderLabel = true;
        this.GRN_Number = data;
      }

      if (data != "" && data != undefined) {
        this.INWARDPAGE = "Edit";
        this.spinner.show();
        this.GRN_Number = data;
        if (get_id != "" && get_id != undefined) {
          this.edit(data, get_id);
        }

        this.userService.inwardgetpolist(data).subscribe((res) => {
          this.poropdown = res;
        });
        this.getInwardList(this.GRN_Number);
      }
    }
  }

  TotalQualityPeace() {
    let i;
    if (this.ArticleSelectedColor !== null) {
      if (this.ArticleSelectedColor.length > 0) {
        this.totalQuantity = 0;
        for (i = 0; i < this.ArticleSelectedColor.length; i++) {
          this.noofpackcount = true;
          const inputname = "NoPacks_" + this.ArticleSelectedColor[i]["Id"];
          if (
            this.inwardForm.controls[inputname].value !== null &&
            this.inwardForm.controls[inputname].value != ""
          ) {
            this.totalQuantity += parseInt(
              this.inwardForm.controls[inputname].value
            );
          }
        }
        $(".totalquality").text(this.totalQuantity);
      }
    }
  }

  onChangeColorVal(InwardId, newValue) {
    $("colordropdown_" + InwardId).val(newValue);
    this.ddcolorId = newValue;
    this.inwardIdsticker = InwardId;
  }

  vndChange(event){
    this.vId = event.Id
    this.vName = event.Name
    console.log('event',event)
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem("userdata"));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 3) {
          let parameterId = this.route.snapshot.paramMap.get("id");
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
        if (data[i].PageId == 3) {
          let parameterId = this.route.snapshot.paramMap.get("id");
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

  cancelform() {
    this.router.navigate([
      "/inward",
      { GRN: this.route.snapshot.paramMap.get("GRN") },
    ]);
    this.formrestvalue();
  }

  downloadprnfile(Id)
 {
    if (this.inwardIdsticker != Id) {
      this.ddcolorId = 0;
    }

    this.spinner.show();
    if (
      this.ddcolorId === undefined ||
      this.ddcolorId == "" ||
      this.ddcolorId == null
    ) {
      this.ddcolorId = 0;
    }

    this.userService.downloadfile(Id, this.ddcolorId).subscribe((res) => {
      this.getdata(res, Id);
    });
  }

  getdata(res, Id) {
    if (res[0].length > 0) {
      const blob = new Blob([res], { type: "application/octet-stream" });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(blob)
      );
      setTimeout(() => {
        document.getElementById("downloadfile_" + Id).click();
        $(".colordropdown_" + Id).prop("Select Color", 0);
        this.spinner.hide();
      }, 500);
    }
  }

  downloadprnsinglefile(Id)
 {
    if (this.inwardIdsticker != Id) {
      this.ddcolorId = 0;
    }

    this.spinner.show();
    if (
      this.ddcolorId === undefined ||
      this.ddcolorId == "" ||
      this.ddcolorId == null
    ) {
      this.ddcolorId = 0;
    }

    this.userService.downloadsinglefile(Id, this.ddcolorId).subscribe((res) => {
      this.getbarcodesingledata(res, Id);
    });

    // this.spinner.show();
    // this.userService.downloadsinglefile(Id).subscribe((res) => {
    //   this.getbarcodesingledata(res, Id);
    // });
  }
  getbarcodesingledata(res, Id) {
    if (res[0].length > 0) {
      const blob = new Blob([res], { type: "application/octet-stream" });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(blob)
      );
      setTimeout(() => {
        document.getElementById("downloadfile_barcode_" + Id).click();
        this.spinner.hide();
      }, 500);
    }
  }

  selectedthreefiled(id)
 {
    this.userService.geteditarticalidwise(id).subscribe((res) => {
      var Count = Object.keys(res).length;

      if (Count > 0) {
        if (res[0].Colorflag == 0) {
          this.noofpackcount = false;
        } else {
          this.noofpackcount = true;
        }

        this.qty = true;
        this.numpack = res[0].NumPacks;
        this.colorflag = res[0].Colorflag;
        this.articlenumber = res[0].ArticleNumber;
        this.vendername = res[0].Name;
      } else {
        this.qty = false;
      }
    });
  }

  GRNAssign(res) {
    this.GRN_Number = res.GRN;
    this.GRNId = res.Id;
    this.GRN_Number_FinancialYear = res.GRN_Financial;
    this.router.navigate(["/inward", { GRN: this.GRNId }]);
    this.getInwardList(this.GRNId);
  }

  onChangartical(event) {
    if (event !== undefined && event !== null) {
      this.inwardForm.addControl(
        "ColorId",
        this.formBuilder.control("", [Validators.required])
      );
      this.inwardForm.addControl(
        "SizeId",
        this.formBuilder.control("", [Validators.required])
      );
      this.inwardForm.addControl("RatioId", this.formBuilder.control(""));
      let i;
      if (this.ArticleSelectedColor !== null) {
        if (this.ArticleSelectedColor.length > 0) {
          for (i = 0; i < this.ArticleSelectedColor.length; i++) {
            this.noofpackcount = true;
            const inputname = "NoPacks_" + this.ArticleSelectedColor[i]["Id"];
            this.inwardForm.removeControl(inputname);
          }
        }
      }
      for (i = 0; i < this.rejectiondropdown.length; i++) {
        const inputnamerej = "Rej_" + this.rejectiondropdown[i]["Id"];
        if (this.inwardForm.get(inputnamerej)) {
          this.inwardForm.removeControl(inputnamerej);
          let i = 0;
          let rejcountdown1 = [];
          rejcountdown1 = this.rejcountdown;
          var Count = Object.keys(rejcountdown1).length;
          let rdown;
          for (i = 0; i < Count; i++) {
            if (rejcountdown1[i].Id == this.rejectiondropdown[i]["Id"]) {
              rdown = i;
            }
          }
          this.rejcountdown.splice(rdown, 1);
        } else {
        }
      }

      this.ArticleSelectedColor = [];
      this.ArticleSelectedSize = [];
      this.colorcountdown = [];
      this.qty = false;
      this.noofpackcount = false;

      this.inwardForm.controls["ColorId"].reset();
      this.inwardForm.controls["RejectionId"].reset();
      this.inwardForm.controls["SizeId"].reset();
      this.inwardForm.controls["RatioId"].reset();
      this.inwardForm.controls["Rate"].reset();
      this.inwardForm.controls["Weight"].reset();

      this.inwardForm.controls["Rate"].enable();
      this.inwardForm.controls["RatioId"].enable();
      this.inwardForm.controls["Weight"].enable();
      this.ColorDisabled = false;
      var newVal = "";
      if (event.Id === undefined) {
        newVal = event;
      } else {
        newVal = event.Id;
      }

      this.spinner.show();

      this.error = "";
      if (newVal == "") {
        this.qty = false;
      }

      this.userService.getarticalIdwise(newVal).subscribe((res) => {
        var Count = Object.keys(res).length;
        if (Count > 0) {
          if (res[0].Colorflag == 0) {
            this.noofpackcount = false;
          } else {
            this.noofpackcount = true;
          }

          if (res[0].ArticleOpenFlag == 0) {
            this.ArticleStatusView = true;
          } else {
            this.ArticleStatusView = false;
          }

          this.qty = true;
          this.editInward = false;
          this.PurchaseNumber = res[0].PurchaseNumber;
          this.PurchaseNumber_FinancialYear =
            res[0].PurchaseNumber_FinancialYear;
          this.numpack = res[0].NumPacks;
          this.colorflag = res[0].Colorflag;
          this.vendername = res[0].Name;
          this.ArticleId = res[0].ArticleId;
          this.BrandName = res[0].BrandName;
          this.CategoryTitle = res[0].Title;
          this.Series = res[0].SeriesName;
          this.SubCategory = res[0].Subcategorytitle;
          this.StyleDescription = res[0].StyleDescription;
          this.VID = res[0].VID;
          if (res[0].CategoryId == 26) {

            this.userService.getrejectionlist().subscribe((res) => {
              var Count = Object.keys(res).length;
              let rejection_dropdown;
              let i;
              let val;
              rejection_dropdown = [];
              for (i = 0; i < Count; i++) {
                val = { Id: res[i].Id, RejectionType: res[i].RejectionType };
                rejection_dropdown.push(val);
              }
              this.rejectiondropdown = rejection_dropdown;
            });

            this.rejectionShow = true;
            this.isRejection = true;
            this.inwardForm.removeControl("ColorId");
            this.inwardForm.removeControl("SizeId");
            this.inwardForm.removeControl("RatioId");
            // this.inwardForm.get('ColorId').clearValidators()
            // this.inwardForm.get('SizeId').clearValidators()
          } else {
            this.rejectionShow = false;
            this.isRejection = true;

          }
          // this.rejectionShow = res[0].CategoryId;

          if (res[0].ArticleRate == "" || res[0].ArticleRate == null) {
            this.articleratecheck = false;
            this.inwardForm.controls["Rate"].enable();
          } else {
            this.editarray = {
              Rate: res[0].ArticleRate,
            };
            this.inwardForm.patchValue(this.editarray);
            this.articleratecheck = true;
            this.inwardForm.controls["Rate"].disable();
            this.Rate = res[0].ArticleRate;
          }
        } else {
          this.qty = false;
        }
        this.spinner.hide();
      });

      this.articlenumber = newVal;
    } else {
      $(".resetquantity").val("");
      this.ArticleStatusView = false;
      //this.inwardForm.reset();
      this.ColorDisabled = true;
      this.inwardForm.controls["Rate"].disable();
      this.inwardForm.controls["RatioId"].disable();
      this.inwardForm.controls["Weight"].disable();
      this.qty = false;
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

    //this.totalQuantity += input;
    //alert(this.totalQuantity);
    return !!/[\d\s]/.test(input);
  }

  onItemcolorSelect(item) {
    if (
      this.colorflag != 0 &&
      this.colorflag != undefined &&
      this.colorflag != ""
    ) {
      this.noofpackcount = true;
      const inputname = "NoPacks_" + item["Id"];

      this.colorcountdown.push(item);
      this.inwardForm.addControl(
        inputname,
        new FormControl("", Validators.required)
      );
      this.totalqualityLength = true;
      this.myFormValueChanges$ =
        this.inwardForm.controls[inputname].valueChanges;
      // subscribe to the stream so listen to changes on units
      this.inwardForm.controls[inputname].reset();
      this.myFormValueChanges$.subscribe((units) => this.TotalQualityPeace());
    } else {
      this.noofpackcount = false;
    }
  }

  onSelectColorAll(items) {
    let i;
    for (i = 0; i < items.length; i++) {
      this.noofpackcount = true;
      const inputname = "NoPacks_" + items[i]["Id"];
      this.colorcountdown.push(items[i]);
      this.inwardForm.addControl(
        inputname,
        new FormControl("", Validators.required)
      );
    }
  }

  OnItemDeSelect(item: Object) {
    if (
      this.colorflag != 0 &&
      this.colorflag != undefined &&
      this.colorflag != ""
    ) {
      this.noofpackcount = true;
      var data = this.inwardForm.value.ColorId;
      const inputname = "NoPacks_" + item["Id"];
      this.inwardForm.removeControl(inputname);

      let i = 0;
      let colorcountdown1 = [];
      colorcountdown1 = this.colorcountdown;
      var Count = Object.keys(colorcountdown1).length;
      let cdown;
      for (i = 0; i < Count; i++) {
        if (colorcountdown1[i].Id == item["Id"]) {
          cdown = i;
        }
      }

      this.colorcountdown.splice(cdown, 1);
      // if(cdown){
      //   this.colorcountdown.splice(cdown,1);
      // }else{
      //   this.colorcountdown.splice(cdown,1);
      // }

      //this.colorcountdown.pop();
    } else {
      this.noofpackcount = false;
    }
  }

  onItemsizeSelect(item: any) {
    this.sizecountdown.push(item);
  }
  onItemratioSelect(item: any) {
    //this.ratiocountdown.push(item);
    var data = this.inwardForm.value.RatioId;
    var nameArr = data.split(",");
    this.newratiocount = nameArr.length;
  }

  onSizeSelectAll(items: any) {
    this.sizecountdown.push(items);
  }
  onRatioSelectAll(items: any) {
    this.ratiocountdown.push(items);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  CheckNumeric(e) {
    if (window.event) {
      // IE
      if (
        (e.keyCode < 48 || e.keyCode > 57) &&
        e.keyCode != 8 &&
        e.keyCode != 44
      ) {
        event.returnValue = false;
        return false;
      }
    } else {
      // Fire Fox
      if ((e.which < 48 || e.which > 57) && e.which != 8 && e.which != 44) {
        e.preventDefault();
        return false;
      }
    }
  }

  WeightNumeric(e) {
    if (window.event) {
      // IE
      if (
        (e.keyCode < 48 || e.keyCode > 57) &&
        e.keyCode != 8 &&
        e.keyCode != 46
      ) {
        event.returnValue = false;
        return false;
      }
    } else {
      // Fire Fox
      if ((e.which < 48 || e.which > 57) && e.which != 8 && e.which != 46) {
        e.preventDefault();
        return false;
      }
    }
  }

  doInward() {
    document.getElementById("submit-button").setAttribute("disabled", "true");
    let item = JSON.parse(localStorage.getItem("userdata"));
    this.inwardForm.patchValue({ LoggedId: item[0].Id });
    if (this.inwardForm.value.Rate == 0) {
      this.toastr.error("Failed", "Zero value not allow for Rate");
      return false;
    } else if (this.inwardForm.value.Weight == 0) {
      this.toastr.error("Failed", "Zero value not allow for Weight");
      return false;
    } else {
      var regex = /^[0-9]{1,3}(,[0-9]{3})*$/;
      // console.log('this.inwardForm.value.SizeId' ,this.inwardForm.value.SizeId)
      // console.log('this.inwardForm.value.ColorId' ,this.inwardForm.value.ColorId)
      if (typeof this.inwardForm.value.SizeId != "undefined") {
        var data = this.inwardForm.value.RatioId;
        var nameArr = data.split(",");
        this.newratiocount = nameArr.length;
        if (this.inwardForm.value.SizeId.length == this.newratiocount) {
          //if (this.inwardForm.value.SizeId.length == this.inwardForm.value.RatioId.length) {
          this.error = "";
        } else {
          this.error =
            "Please select the same size count you have selected ratio count";
          return false;
        }
      } else {
        this.newratiocount = 1;
        this.inwardForm.value.RatioId == 1;
        this.inwardForm.value.SizeId = "";
      }
      if (typeof this.inwardForm.value.ColorId === "undefined") {
        this.inwardForm.value.ColorId = "";
        this.ArticleSelectedColor = [];
      }
      let item = JSON.parse(localStorage.getItem("userdata"));
      this.spinner.show();
      if (this.route.snapshot.paramMap.get("id")) {
        this.inwardForm.value.id = this.route.snapshot.paramMap.get("id");
        this.inwardForm.value.ArticleId = this.ArticleId;
        this.inwardForm.value.VID = this.VID;
        this.inwardForm.value.PoId = this.PoId.Id;
        this.inwardForm.value.rate = this.Rate;
        this.inwardForm.value.LoggedId = item[0].Id;
        this.inwardForm.value.VendorId = (this.apiId == undefined) ? this.vId : this.apiId;

        this.userService
          .updateInward(this.inwardForm.value)
          .subscribe((userdata) => {
            this.spinner.hide();

            // Re-render the DataTable
            if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.draw();
              
              });
            }
         

            this.inwardForm.addControl(
              "ColorId",
              this.formBuilder.control("", [Validators.required])
            );
            this.inwardForm.addControl(
              "SizeId",
              this.formBuilder.control("", [Validators.required])
            );
            this.inwardForm.addControl("RatioId", this.formBuilder.control(""));
            this.updatesuccess(userdata);
            document
              .getElementById("submit-button")
              .removeAttribute("disabled");
          });
      } else {
        this.inwardForm.value.GRN_Number = this.GRN_Number;
        this.inwardForm.value.ArticleId = this.ArticleId;
        this.inwardForm.value.VID = this.VID;
        this.inwardForm.value.PoId = this.PoId.Id;
        this.inwardForm.value.UserId = item[0].Id;
        this.inwardForm.value.rate = this.Rate;
        this.inwardForm.value.VendorId = (this.apiId == undefined) ? this.vId : this.apiId;
        this.inwardForm.value.LoggedId = item[0].Id;
        this.userService
          .doinwardadd(this.inwardForm.value)
          .subscribe((userdata) => {
            this.inwardForm.addControl(
              "ColorId",
              this.formBuilder.control("", [Validators.required])
            );
            this.inwardForm.addControl(
              "SizeId",
              this.formBuilder.control("", [Validators.required])
            );
            this.inwardForm.addControl("RatioId", this.formBuilder.control(""));
            this.spinner.hide();
             //added aditional code.

            // Re-render the DataTable
            if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.draw();

              });
            }

            this.success(userdata);
            document
              .getElementById("submit-button")
              .removeAttribute("disabled");
          });
      }
    }



  }

  public delete(id, ArticleId, GRN_Number) {
    let item = JSON.parse(localStorage.getItem("userdata"));
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value == true) {
        this.userService
          .deleteinward(id, ArticleId, item[0].Id)
          .subscribe((res) => {
            //this.getInwardList(this.SoNumberId);
            // this.router.navigate(['/so', {SONO: this.SoNumberId}]);
            this.deletesuccess(res);
             //added aditional code.

          // Re-render the DataTable
        if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
           
          });
        }

            this.getInwardList(GRN_Number);
            this.router.navigate(["/inward", { GRN: GRN_Number }]);
            this.userService.inwardgetpolist(GRN_Number).subscribe((res) => {
              this.poropdown = res;
            });
            this.formrestvalue();
          });
      } else {
      }
    });
  }

  public edit(GRN, id) {
    this.spinner.show();
    if (this.inwardForm.value.Rate != 0 && this.inwardForm.value.Weight != 0) {
      // this.PO_Label = "Article No.";
      // this.Article_Label = "PO No.";
      this.PO_Label = "PO No.";
      this.Article_Label = "Article No.";

      this.editInward = true;
      this.userService.getinwardidwise(id).subscribe((res) => {
        if (res["length"] > 0) {
          this.ColorDisabled = true;
          this.ArticleSelectedColor = JSON.parse(res[0].ArticleColor);
          this.ArticleSelectedSize = JSON.parse(res[0].ArticleSize);
          this.PurchaseNumber = res[0].PurchaseNumber;

          this.GRN_Number_FinancialYear = res[0].GRN_Number_FinancialYear;
          this.PurchaseNumber_FinancialYear =
            res[0].PurchaseNumber_FinancialYear;
          this.ArticleNumberSet = res[0].ArticleNumber;
          this.ArticleId = res[0].ArticleId;
          this.StyleDescription = res[0].StyleDescription;
          this.BrandName = res[0].BrandName;
          this.CategoryTitle = res[0].Title;
          this.Series = res[0].SeriesName;
          this.SubCategory = res[0].Subcategorytitle;
          this.VID = res[0].VID;
          this.norejectioncount = true;
          this.RejectionSelected = JSON.parse(res[0].rejections);
          let assignnopacks = {};
          this.rejcountdown = this.RejectionSelected;
          if (this.rejcountdown) {
            for (let j = 0; j < this.rejcountdown.length; j++) {
              const inputrejname = "Rej_" + this.RejectionSelected[j]["Id"];
              this.inwardForm.addControl(
                "Rej_" + this.RejectionSelected[j]["Id"],
                new FormControl("", Validators.required)
              );
              this.myFormValueChanges$ =
                this.inwardForm.controls[inputrejname].valueChanges;
              this.inwardForm
                .get(`${inputrejname}`)
                .patchValue(this.RejectionSelected[j]["RejectionPacks"]);
            }
          }

          if (res[0].Colorflag == 1) {
            this.noofpackcount = true;
            this.colorcountdown = this.ArticleSelectedColor;

            let i;
            var Count1 = Object.keys(this.colorcountdown).length;
            var nameArr = res[0].NoPacks.split(",");
            this.totalqualityLength = true;

            let generatenopack;
            this.totalQuantity = 0;
            for (i = 0; i < Count1; i++) {
              //alert(nameArr[i]);
              generatenopack = "NoPacks_" + this.colorcountdown[i]["Id"];
              assignnopacks[generatenopack] = nameArr[i];
              this.inwardForm.addControl(
                "NoPacks_" + this.colorcountdown[i]["Id"],
                new FormControl("", Validators.required)
              );
              this.totalQuantity += parseInt(nameArr[i]);

              this.myFormValueChanges$ =
                this.inwardForm.controls[generatenopack].valueChanges;
              // subscribe to the stream so listen to changes on units
              this.myFormValueChanges$.subscribe((units) =>
                this.TotalQualityPeace()
              );
            }

            setTimeout(() => {
              $(".totalquality").text(this.totalQuantity);
            }, 200);
          } else {
            this.noofpackcount = false;
          }

          this.ArticleStatusView = true;
          this.GRN_Number = res[0].GRN;
          this.DropdownPO = false;
          //this.selectedthreefiled(res[0].PO_Number);
          this.selectedthreefiled(this.ArticleId);
          this.qty = true;
          this.editarray = {
            //PoId: res[0].PO_Number,
            PoId: res[0].ArticleId,
            GRN_Number: res[0].GRN_Number,
            // ColorId: "2,3",//ArticleColor
            // SizeId: "1,3",//ArticleSize
            RatioId: res[0].ArticleRatio, //ArticleRatio
            NoPacks: res[0].NoPacks,
            ArticleStatus: res[0].ArticleStatus,
            // InwardDate: res[0].InwardDate,
            Rate: res[0].ArticleRate,
            Weight: res[0].Weight,
          };

          this.GRN_Number = res[0].GRN_Number;
          //this.GRN_Number_FinancialYear = res[0].GRN_Number_FinancialYear;
          this.inwardForm.patchValue(this.editarray);
          this.inwardForm.patchValue(assignnopacks);
          this.inwardForm.controls["Rate"].enable();
          this.inwardForm.controls["RatioId"].enable();
          this.inwardForm.controls["Weight"].enable();
          this.spinner.hide();
        }
      });
      //this.router.navigate(['inward',{GRN: GRN, id : id}])
    } else {
      this.error =
        "Please select the same size count you have selected ratio count";
      return false;
    }
  }

  deletesuccess(data) {
    if (data == "SUCCESS") {
      this.toastr.success("Success", "Inward Deleted Successfully");
    } else {
      this.toastr.error("Failed", "Please try agin later");
    }
  }

  // User Add success function
  success(data) {
    if (data.id != "") {
      let GRN_Number = "";
      let GRN_Id = "";
      //this.router.navigate(['/inwardlist']);
      GRN_Number = data.GRN_Id;
      GRN_Id = data.GRN_Id;
      this.rejectionShow = false;


      this.userService.getrejectionlist().subscribe((res) => {
        var Count = Object.keys(res).length;
        let rejection_dropdown;
        let i;
        let val;
        rejection_dropdown = [];
        for (i = 0; i < Count; i++) {
          val = { Id: res[i].Id, RejectionType: res[i].RejectionType };
          rejection_dropdown.push(val);
        }
        this.rejectiondropdown = rejection_dropdown;
      });

      this.isRejection = true;
      this.rejcountdown = [];
      this.toastr.success("Success", "Inward Add Successfully");
      this.spinner.show();
      this.InwardOrderLabel = true;
      this.router.navigate(["/inward", { GRN: GRN_Number }]);

      this.getInwardList(GRN_Number);

      this.userService.inwardgetpolist(GRN_Number).subscribe((res) => {
        this.poropdown = res;
      });
      this.formrestvalue();
    } else if (data.NoOfSetNotMatch == "true") {
      this.toastr.error("Failed", 'Zero value not allow for "no of sets"');
    } else if (data.Alreadyexist == "true") {
      this.toastr.error("Failed", "Already exist on current GRN");
    } else {
      this.toastr.error("Failed", "Please try agin later");
    }
  }

  updatesuccess(data) {
    if (data.id != "") {
      //this.router.navigate(['/inwardlist']);
      this.rejectionShow = false;
      this.isRejection = true;

      this.toastr.success("Success", "Inward update Successfully");
      this.router.navigate([
        "/inward",
        { GRN: this.route.snapshot.paramMap.get("GRN") },
      ]);
      this.getInwardList(this.route.snapshot.paramMap.get("GRN"));

      this.formrestvalue();
    } else {
      this.toastr.error("Failed", "Please try agin later");
    }
  }

  formrestvalue() {
    this.totalqualityLength = true;
    let i;
    // if (this.ArticleSelectedColor.length > 0) {
    //   for (i = 0; i < this.ArticleSelectedColor.length; i++) {
    //     this.noofpackcount = true;
    //     const inputname = "NoPacks_" + this.ArticleSelectedColor[i]["Id"];
    //     this.inwardForm.removeControl(inputname);
    //   }
    // }
    // if (this.RejectionSelected.length > 0) {
    //   for (i = 0; i < this.RejectionSelected.length; i++) {
    //     const inputrejname = "Rej_" + this.RejectionSelected[i]["Id"];
    //     this.inwardForm.removeControl(inputrejname);
    //   }
    // }

    if (this.ArticleSelectedColor && this.ArticleSelectedColor.length > 0) {
      for (let i = 0; i < this.ArticleSelectedColor.length; i++) {
        this.noofpackcount = true;
        const inputname = "NoPacks_" + this.ArticleSelectedColor[i]["Id"];
        this.inwardForm.removeControl(inputname);
      }
    }

    if (this.RejectionSelected && this.RejectionSelected.length > 0) {
      for (let i = 0; i < this.RejectionSelected.length; i++) {
        const inputrejname = "Rej_" + this.RejectionSelected[i]["Id"];
        this.inwardForm.removeControl(inputrejname);
      }
    }

    this.PoId = null;
    this.ArticleStatusView = false;
    this.inwardForm.controls['PoId'].reset();
    this.inwardForm.controls['ColorId'].reset();
    this.inwardForm.controls['RejectionId'].reset();
    this.inwardForm.controls['SizeId'].reset();
    this.inwardForm.controls['RatioId'].reset();
    this.inwardForm.controls['Rate'].reset();
    this.inwardForm.controls['Weight'].reset();
    this.inwardForm.controls['NoPacks'].reset();

    this.articlenumber = "";
    this.colorflag = 0;
    this.PurchaseNumber = "";
    this.StyleDescription = "";
    this.BrandName = "";
    this.CategoryTitle = "";
    this.Series = "";
    this.SubCategory = "";
    //start
    // this.inwardForm.reset({
    //   PoId: [null],
    //  InwardCurrentDate: new Date(),
    //  InwardDate: this.InwardDate,
    //   Remark: this.Remark
    // });
    //end
    this.DropdownPO = true;
    this.ArticleSelectedColor = [];
    this.ArticleSelectedSize = [];
    this.colorcountdown = [];
    this.articlenumber = "";
    this.numpack = "";
    this.vendername = "";
    this.InwardCurrentDate = new Date();
    this.PO_Label = "PO No.";
    this.Article_Label = "Article No.";
  }

  getInwardList(GRN) {
    console.log('GRNNNN:', GRN)
    localStorage.setItem('GRN', GRN);
    
    this.userService.inwarddateremarkfromGRN(GRN).subscribe((res) => {
      if (res["length"] > 0) {
        this.apiId = res[0].VendorId
        this.GRN_Number = res[0].Id;
        this.InwardDate = res[0].InwardDate;
        this.Remark = res[0].Remark;
        this.editarray = {
          InwardDate: res[0].InwardDate,
          Remark: res[0].Remark,
          GRN_Number: res[0].Id,
          VendorId: res[0].NAME ,
          // BrandId: (res[0].BrandId != 0) ? res[0].BrandId : ''
        };

        this.GRN_Number_FinancialYear = res[0].GRN_Number_FinancialYear;
        this.inwardForm.patchValue(this.editarray);
      }
    });

    this.accessdenied = false
    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 25);
      const that = this;
      this.dtOptions = {
        serverSide: true,
        processing: true,
        columnDefs: [{
          "targets": 'no-sort',
          "orderable": false,
        }], "order": [[1, "desc"]],

        ajax: (dataTablesParameters: any, callback) => {
          const data = localStorage.getItem('GRN');
          that.http.post<DataTablesResponse>(
            this.ApiURL + `/inwardlistfromgrn/${data}`,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.inwardlist = resp.data;
            that.startnumber = resp.startnumber;
            this.spinner.hide();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
        },
        columns: [{ data: 'No' }, { data: 'ArticleNumber' }, { data: 'Name' }, { data: 'Title' }, { data: 'NoPacks' }, { data: 'Action' }]
      };
    } else {
      this.spinner.hide();
    }

    // this.userService.inwardlistfromgrn(GRN).subscribe((res) => {
    //   const data = res;
    //   if (
    //     typeof this.dtElement !== "undefined" &&
    //     typeof this.dtElement.dtInstance !== "undefined"
    //   ) {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //       // Destroy the table first
    //       dtInstance.destroy();
    //       this.noofpackcount = true;
    //       this.inwardlist = data;

    //       // Call the dtTrigger to rerender again
    //       this.dtTrigger.next();
    //       this.spinner.hide();
    //     });
    //   } else {
    //     this.inwardlist = data;
    //     this.dtTrigger.next();
    //     this.spinner.hide();
    //   }
    // });
  }
  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if ($('.dataTables_empty').length > 0) {
          $('.dataTables_empty').remove();
        }
      });

    });
  }

  resultjson(ArticleColor) {
    return JSON.parse(ArticleColor);
  }
  onRejectionSelect(item) {
    this.norejectioncount = true;
    const inputname = "Rej_" + item["Id"];
    this.rejcountdown.push(item);
    this.inwardForm.addControl(
      inputname,
      new FormControl("", Validators.required)
    );

    this.myFormValueChanges$ = this.inwardForm.controls[inputname].valueChanges;
    // subscribe to the stream so listen to changes on units
    // this.myFormValueChanges$.subscribe(units => this.TotalQualityPeace());
  }
  OnRejDeSelect(item: Object) {
    this.norejectioncount = true;
    var data = this.inwardForm.value.RejectionId;
    const inputname = "Rej_" + item["Id"];
    this.inwardForm.removeControl(inputname);
    let i = 0;
    let rejcountdown1 = [];
    rejcountdown1 = this.rejcountdown;
    var Count = Object.keys(rejcountdown1).length;
    let rdown;
    for (i = 0; i < Count; i++) {
      if (rejcountdown1[i].Id == item["Id"]) {
        rdown = i;
      }
    }
    this.rejcountdown.splice(rdown, 1);
  }
  goBack() {
    window.history.back();
  }
}
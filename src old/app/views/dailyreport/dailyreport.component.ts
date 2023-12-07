import { Component, OnInit } from "@angular/core";
import { environment } from "./../../../environments/environment";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from "@angular/common/http";
import { Title } from "@angular/platform-browser";
import { DataTableDirective } from "angular-datatables";
import { exportDailyReport } from "../../export-element";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import * as XLSX from "xlsx";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-dailyreport",
  templateUrl: "./dailyreport.component.html",
  styleUrls: ["./dailyreport.component.scss"],
})
export class DailyreportComponent implements OnInit {
  accessdenied: boolean = false;
  flagstockdata: boolean = false;
  ApiURL: string = environment.apiURL;
  dtOptions: any;
  dtElement: DataTableDirective;
  rangeForm: FormGroup;
  RangeDate: Date;
  objectKeys = Object.keys;
  public categories: any;
  public inwardlist: any;
  public outletInwardlist: any;
  public outletImportlist: any;
  public latdate: any;
  public outwardlist: any;
  public outletOutwardlist: any;
  public outletJhsplOutwardlist: any;
  public prlist: any;
  public srlist: any;
  public outletPRlist: any;
  public outletSRlist: any;
  public catinwardlist: any;
  public catoutwardlist: any;
  public catprlist: any;
  public catsrlist: any;
  public outletCatInwardlist: any;
  public outletCatImportlist: any;
  public outletCatOutwardlist: any;
  public outletCatPRlist: any;
  public outletCatSRlist: any;
  public outletCatInwardTotal:any;
  public outletCatImportTotal:any;
  public outletCatOutwardTotal:any;
  public outletCatPRTotal:any;
  public outletCatSRTotal:any;
  public showData: boolean = false;
  public outletShowData: boolean = false;
  public opening: any;
  public closing: any;
  public OpeningCat: any;
  public ClosingCat: any;
  public outletOpening: any;
  public outletClosing: any;
  public CategoryWiseStock: any;
  public outletOpeningCat: any;
  public outletClosingCat: any;
  public TotalCategoryStock: any;
  public totalInwards: any;
  public totalOutwards: any;
  public totalPurchaseReturns: any;
  public totalSalesReturn: any;
  public outletInwardTotal: any;
  public outletImportTotal: any;
  public outletOutwardTotal: any;
  public outletSRTotal: any;
  public outletPRTotal: any;
  isList: any;
  public categoryShow: boolean = false;
  public outletCategoryShow: boolean = false;
  public AllStockCatShow: boolean = false;
  public OpeningCategory: boolean = false;
  public ClosingCategory: boolean = false;
  public outletOpeningCategory: boolean = false;
  public outletClosingCategory: boolean = false;
  public inCatShow: boolean = false;
  public ouCatShow: boolean = false;
  public prCatShow: boolean = false;
  public srCatShow: boolean = false;
  public OutletinCatShow: boolean = false;
  public OutletimpCatShow: boolean = false;
  public OutletouCatShow: boolean = false;
  public OutletprCatShow: boolean = false;
  public OutletsrCatShow: boolean = false;
  OutletPartyId: any;
  public partydropdown: any = [];
  public alldata;
  public orgOutletName: any;
  UserRole: any;

  isAdd: any;
  isEdit: any;
  isDelete: any;
  Outletpermissions: boolean = false;
  AllReportpermissions: boolean = false;


  constructor(
    public datepipe: DatePipe,
    private userService: UserService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private titleService: Title,
    private formBuilder: FormBuilder
  ) {
    this.titleService.setTitle("Daily Report | Colorhunt");
    this.rangeForm = this.formBuilder.group({
      RangeDate: ["", [Validators.required]],
    });
  }
  changeOutlet(id) {
    if (id == 0) {
      this.OutletPartyId = null;
    } else {
      this.OutletPartyId = id;
    }
  }
  ngOnInit() {
  
    this.OutletPartyId = null;
    this.userService.outletpartylist().subscribe((res) => {
      this.partydropdown = res;
    });

    let item = JSON.parse(localStorage.getItem('userdata'));
    if(item[0].Role==7){
      this.AllReportpermissions = false;
      this.Outletpermissions = true;
    } else{
      this.AllReportpermissions = true;
    }
  
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }

  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        
        if (data[i].PageId == 46) {
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
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 46) {
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



  doDailyReport() {
    this.spinner.show();
    this.RangeDate = this.rangeForm.value.RangeDate;
    // console.log('dddd', this.rangeForm.value.RangeDate)
    this.latdate = this.datepipe.transform(
      this.rangeForm.value.RangeDate,
      "dd-MM-yyyy"
    );
    if (this.OutletPartyId) {
      this.userService
        .getsrangewiseoutletdailyreport(
          this.rangeForm.value.RangeDate,
          this.OutletPartyId
        )
        .subscribe((res) => {
          this.spinner.hide();
          this.showData = false;
          this.outletShowData = true;
          this.orgOutletName = res['orgOutletName'];
          this.categories = res["Categories"];
          this.outletOpening = res["outletOpeningStock"];
          this.outletClosing = res["outletClosingStock"];
          this.outletInwardlist = res["allOutletData"].inwardData;
          this.outletInwardTotal = res["allOutletData"].totalInwardPacks;
          this.outletImportlist = res["allOutletData"].importData;
          this.outletImportTotal = res["allOutletData"].totalImportPacks;
          this.outletOutwardlist = res["allOutletData"].outwardData;
          this.outletJhsplOutwardlist = res["allOutletData"].jhsploutwardData;
          this.outletOutwardTotal = res["allOutletData"].totalOutwardPacks;
          this.outletPRlist = res["allOutletData"].purchaseReturnData;
          this.outletPRTotal = res["allOutletData"].totalPurchaseReturnPacks;
          this.outletSRlist = res["allOutletData"].salesReturnData;
          this.outletSRTotal = res["allOutletData"].totalSalesReturnPacks;
          this.outletCatInwardlist = res["allOutletDataCat"].outletInwardCategoryWise;
          this.outletCatInwardTotal = res["allOutletDataCat"].totalCatInwardPacks;
          this.outletCatImportlist = res["allOutletDataCat"].outletImportCategoryWise;
          this.outletCatImportTotal = res["allOutletDataCat"].totalCatImportPacks;
          this.outletCatOutwardlist = res["allOutletDataCat"].outletOutwardCategoryWise;
          this.outletCatOutwardTotal = res["allOutletDataCat"].totalCatOutwardPacks;
          this.outletCatPRlist = res["allOutletDataCat"].outletPurchaseReturnCategoryWise;
          this.outletCatPRTotal = res["allOutletDataCat"].totalCatPRPacks;
          this.outletCatSRlist = res["allOutletDataCat"].outletSalesReturnCategoryWise;
          this.outletCatSRTotal = res["allOutletDataCat"].totalCatSRPacks;
          this.outletOpeningCat = res["outletOpeningCategorywise"];
          this.outletClosingCat = res["outletClosingCategorywise"];
        });
    } else {
      this.userService
        .getsrangewisedailyreport(this.rangeForm.value.RangeDate)
        .subscribe((res) => {
          this.spinner.hide();
          this.showData = true;
          this.outletShowData = false;
          this.categories = res["Categories"];
          this.opening = res["OpeningStock"];
          this.closing = res["ClosingStock"];
          this.CategoryWiseStock = res["CategoryWiseStock"];
          this.TotalCategoryStock = res["TotalCategoryStock"];
          this.inwardlist = res["AllData"].inwardRecords;
          this.outwardlist = res["AllData"].outwardRecords;
          this.prlist = res["AllData"].purchaseReturnRecords;
          this.srlist = res["AllData"].salesReturnRecords;
          this.alldata = res["AllData"];
          this.catinwardlist = res["AllDataCat"].inwardCategoryWise;
          this.catoutwardlist = res["AllDataCat"].outwardCategoryWise;
          this.catprlist = res["AllDataCat"].purchaseReturnCategoryWise;
          this.catsrlist = res["AllDataCat"].salesReturnCategoryWise;
          this.totalInwards = res["AllData"].totalInwardSalesNoPacks;
          this.totalOutwards = res["AllData"].totalOutwardNoPacks;
          this.totalPurchaseReturns = res["AllData"].totalPurchaseReturnNoPacks;
          this.totalSalesReturn = res["AllData"].totalSalesReturnNoPacks;
          this.OpeningCat = res["openingCatWise"];
          this.ClosingCat = res["closingCatWise"];
        });
    }
  }
  pdf() {
    let element = document.getElementById("print-section");
    exportDailyReport(element, {
      paperSize: "A4",
      keepTogether: ".prevent-split",
      scale: 0.6,
      repeatHeaders: true,
    });
    this.ngOnInit();
  }
  outletExport(){
    this.spinner.show();
    var ws = XLSX.utils.json_to_sheet([{ note: "Outlet Daily Report" }], {
      header: ["note"],
      skipHeader: true,
    });
    XLSX.utils.sheet_add_json(ws, [{ note: this.latdate }], {
      header: ["note"],
      skipHeader: true,
      origin: "B1",
    });
    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    XLSX.utils.sheet_add_json(ws, [{ note: "Opening Stock" }], {
      header: ["note"],
      skipHeader: true,
      origin: "A2",
    });
    XLSX.utils.sheet_add_json(ws, [{ note: this.outletOpening }], {
      header: ["note"],
      skipHeader: true,
      origin: "B2",
    });
    XLSX.utils.sheet_add_json(ws, [{ note: "Closing Stock" }], {
      header: ["note"],
      skipHeader: true,
      origin: "D2",
    });
    XLSX.utils.sheet_add_json(ws, [{ note: this.outletClosing }], {
      header: ["note"],
      skipHeader: true,
      origin: "E2",
    });
    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    //Inward
    XLSX.utils.sheet_add_json(ws, [{ note: "Inward" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.outletInwardlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.outletInwardlist, {
        header: ["ReceivedDate", "Outlet", "OutwardNumber", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.outletInwardTotal }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.outletInwardlist, {
        header: ["ReceivedDate", "Outlet", "OutwardNumber", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }
    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    //Import
    XLSX.utils.sheet_add_json(ws, [{ note: "Import" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.outletImportlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.outletImportlist, {
        header: ["CreatedDate", "Outlet", "ArticleNumber", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.outletImportTotal }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.outletImportlist, {
        header: ["CreatedDate", "Outlet", "ArticleNumber", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }
    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    //Outward
    XLSX.utils.sheet_add_json(ws, [{ note: "Outward" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.outletOutwardlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.outletOutwardlist, {
        header: [
          "OutletDate",
          "Outlet",
          "OutletNumber",
          "Party",
          "NoPacks",
        ],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.outletOutwardTotal }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.outletOutwardlist, {
        header: [
          "OutletDate",
          "Outlet",
          "OutletNumber",
          "Party",
          "NoPacks",
        ],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }

    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    //Purchase Return
    XLSX.utils.sheet_add_json(ws, [{ note: "Purchase Return" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.outletPRlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.outletPRlist, {
        header: ["CreatedDate", "Outlet", "SalesReturnNumber", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.outletPRTotal }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.outletPRlist, {
        header: ["CreatedDate", "Outlet", "SalesReturnNumber", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }

    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });

    //Purchase Return
    XLSX.utils.sheet_add_json(ws, [{ note: "Sales Return" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.outletSRlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.outletSRlist, {
        header: ["CreatedDate", "Outlet", "Party", "SalesReturnNumber", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.outletSRTotal }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.outletSRlist, {
        header: ["CreatedDate", "Outlet", "Party", "SalesReturnNumber", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }
    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    XLSX.writeFile(wb, "dailyoutletreport.xlsx");
    this.spinner.hide();
  }








  export() {
    this.spinner.show();
    // Add Title and Date
    var ws = XLSX.utils.json_to_sheet([{ note: "Daily Report" }], {
      header: ["note"],
      skipHeader: true,
    });
    XLSX.utils.sheet_add_json(ws, [{ note: this.latdate }], {
      header: ["note"],
      skipHeader: true,
      origin: "B1",
    });

    //Empty row
    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });

    //Add Opening  Closing Stock
    XLSX.utils.sheet_add_json(ws, [{ note: "Opening Stock" }], {
      header: ["note"],
      skipHeader: true,
      origin: "A2",
    });

    XLSX.utils.sheet_add_json(ws, [{ note: this.opening }], {
      header: ["note"],
      skipHeader: true,
      origin: "B2",
    });
    XLSX.utils.sheet_add_json(ws, [{ note: "Closing Stock" }], {
      header: ["note"],
      skipHeader: true,
      origin: "D2",
    });
    XLSX.utils.sheet_add_json(ws, [{ note: this.closing }], {
      header: ["note"],
      skipHeader: true,
      origin: "E2",
    });

    //Empty row
    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });

    //Inward
    XLSX.utils.sheet_add_json(ws, [{ note: "Inward" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.inwardlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.inwardlist, {
        header: ["GRNnumber", "CreatedDate", "Name", "SalesNoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.totalInwards }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.inwardlist, {
        header: ["GRNnumber", "CreatedDate", "Name", "SalesNoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }

    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });

    //Outward
    XLSX.utils.sheet_add_json(ws, [{ note: "Outward" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.outwardlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.outwardlist, {
        header: [
          "OutwardNumber",
          "SoNumber",
          "CreatedDate",
          "Party_Name",
          "NoPacks",
        ],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.totalOutwards }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.outwardlist, {
        header: [
          "OutwardNumber",
          "SoNumber",
          "CreatedDate",
          "Party_Name",
          "NoPacks",
        ],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }

    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });

    //Purchase Return
    XLSX.utils.sheet_add_json(ws, [{ note: "Purchase Return" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.prlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.prlist, {
        header: ["PRNumber", "CreatedDate", "PartyName", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.totalPurchaseReturns }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.prlist, {
        header: ["PRNumber", "CreatedDate", "PartyName", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }

    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });

    //Sales Return
    XLSX.utils.sheet_add_json(ws, [{ note: "Sales Return" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });
    if (this.srlist.length != 0) {
      XLSX.utils.sheet_add_json(ws, this.srlist, {
        header: ["SRNumber", "CreatedDate", "PartyName", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(
        ws,
        [{ total: "Total", value: this.totalSalesReturn }],
        {
          header: ["total", "value"],
          skipHeader: true,
          origin: -1,
        }
      );
    } else {
      XLSX.utils.sheet_add_json(ws, this.srlist, {
        header: ["SRNumber", "CreatedDate", "PartyName", "NoPacks"],
        skipHeader: false,
        origin: -1,
      });
      XLSX.utils.sheet_add_json(ws, [{ note: "No records" }], {
        header: ["note"],
        skipHeader: true,
        origin: -1,
      });
    }

    XLSX.utils.sheet_add_json(ws, [{ note: "" }], {
      header: ["note"],
      skipHeader: true,
      origin: -1,
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    XLSX.writeFile(wb, "dailyreport.xlsx");
    this.spinner.hide();
  }
  showCategory(categoryfor) {
    this.categoryShow = true;
    if (categoryfor == "inward") {
      this.inCatShow = true;
    } else if (categoryfor == "outward") {
      this.ouCatShow = true;
    } else if (categoryfor == "pr") {
      this.prCatShow = true;
    } else if (categoryfor == "sr") {
      this.srCatShow = true;
    }
  }
  hideCategory(categoryfor) {
    this.categoryShow = false;
    if (categoryfor == "inward") {
      this.inCatShow = false;
    } else if (categoryfor == "outward") {
      this.ouCatShow = false;
    } else if (categoryfor == "pr") {
      this.prCatShow = false;
    } else if (categoryfor == "sr") {
      this.srCatShow = false;
    }
  }
  showOutletCategory(categoryfor) {
    this.outletCategoryShow = true;
    if (categoryfor == "inward") {
      this.OutletinCatShow = true;
    } else if (categoryfor == "import") {
      this.OutletimpCatShow = true;
    } else if (categoryfor == "outward") {
      this.OutletouCatShow = true;
    } else if (categoryfor == "pr") {
      this.OutletprCatShow = true;
    } else if (categoryfor == "sr") {
      this.OutletsrCatShow = true;
    }
  }
  hideOutletCategory(categoryfor) {
    this.outletCategoryShow = false;
    if (categoryfor == "inward") {
      this.OutletinCatShow = false;
    } else if (categoryfor == "import") {
      this.OutletimpCatShow = false;
    } else if (categoryfor == "outward") {
      this.OutletouCatShow = false;
    } else if (categoryfor == "pr") {
      this.OutletprCatShow = false;
    } else if (categoryfor == "sr") {
      this.OutletsrCatShow = false;
    }
  }
  hideOutletOpeningClosing() {
    this.outletOpeningCategory = false;
    this.outletClosingCategory = false;
  }
  hideOpeningClosing() {
    this.OpeningCategory = false;
    this.ClosingCategory = false;
  }
  hideAllStockCategory() {
    this.AllStockCatShow = false;
  }
  OpeningCategoryw() {
    this.OpeningCategory = true;
  }
  ClosingCategoryw() {
    this.ClosingCategory = true;
  }
  outletOpeningCategoryw() {
    this.outletOpeningCategory = true;
  }
  outletClosingCategoryw() {
    this.outletClosingCategory = true;
  }


  inwardchallan(GRNId, type) {
    const link = this.router.serializeUrl(
      this.router.createUrlTree(["#/inwardchallan", { GRN: GRNId, type: 1 }])
    );
    window.open(link.replace("%23", "#"), "_blank");
  }
  outwardchallan(OWNO) {
    const link = this.router.serializeUrl(
      this.router.createUrlTree(["#/outwardchallan", { OWNO: OWNO }])
    );
    window.open(link.replace("%23", "#"), "_blank");
  }
  prchallan(PurchaseReturnNumberId) {
    const link = this.router.serializeUrl(
      this.router.createUrlTree([
        "#/purchasereturnchallan",
        { PR: PurchaseReturnNumberId },
      ])
    );
    window.open(link.replace("%23", "#"), "_blank");
  }
  srchallan(SalesReturnNumberId) {
    const link = this.router.serializeUrl(
      this.router.createUrlTree([
        "#/salesreturnchallan",
        { SR: SalesReturnNumberId },
      ])
    );
    window.open(link.replace("%23", "#"), "_blank");
  }
  Outletsrchallan(SalesReturnNumberId) {
    const link = this.router.serializeUrl(
      this.router.createUrlTree([
        "#/outletsalesreturnchallan",
        { OSR: SalesReturnNumberId },
      ])
    );
    window.open(link.replace("%23", "#"), "_blank");
  }
  outletchallan(OutletNumberId) {
    const link = this.router.serializeUrl(
      this.router.createUrlTree(["#/outletchallan", { OTLNO: OutletNumberId }])
    );
    window.open(link.replace("%23", "#"), "_blank");
  }
  // inwardchallan(GRNId) {
  //   const link = this.router.serializeUrl(
  //     this.router.createUrlTree(["#/inwardchallan", { GRN: GRNId }])
  //   );
  //   window.open(link.replace("%23", "#"), "_blank");
  // }
}

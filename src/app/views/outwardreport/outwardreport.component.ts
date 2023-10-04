import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../services/user.service";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from "@angular/common/http";
import { Title } from "@angular/platform-browser";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import * as XLSX from "xlsx";
// import { exportOutwardReport } from '../../export-element';

class Person {
  // Id: number;
  Outlet: string;
  OutwardNumber: string;
  SoNumber: string;
  Category: string;
  SubCategory: string;
  Series: string;
  ArticleNumber: string;
  PartyName: string;
  Quantity: string;
  Rate: string;
  BillAmount: string;
  Discount: string;
  Remarks: string;
  Country: string;
  State: string;
  City: string;
  PinCode: string;
  SalesPerson: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}

@Component({
  selector: "app-outwardreport",
  templateUrl: "./outwardreport.component.html",
  styleUrls: ["./outwardreport.component.scss"],
})
export class OutwardreportComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public outwardreportlist: Person[];
  // public response: DataTablesResponse[];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  // outwardForm: FormGroup;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  accessdenied: boolean = true;
  public startnumber: any;
  RangeStartDate: Date;
  RangeEndDate: Date;
  OutletPartyId: any = [];
  public partydropdown: any = [];
  dropdownSettings = {};
  rangeSelected = false;
  allExportRec: any;


  Outletpermissions: boolean = false;
  AllReportpermissions: boolean = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private titleService: Title
  ) {
    this.titleService.setTitle("Outward Report | Colorhunt");
    this.RangeStartDate = new Date();
    this.RangeEndDate = new Date();
    // this.outwardForm = this.formBuilder.group({
    //   rangestartdate: ["", [Validators.required]],
    //   rangeenddate: ["", [Validators.required]],
    //   SelectedOutlet: [""],
    // });
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

    if (this.accessdenied == false) {
      this.spinner.show();
      this.dropdownSettings = {
        singleSelection: false,
        idField: "Id",
        textField: "Name",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        enableCheckAll: false,
        itemsShowLimit: 2,
        disabled: true,
        allowSearchFilter: true,
      };
      this.userService.outletpartylist().subscribe((res) => {
        this.partydropdown = res;
        this.spinner.hide();
      });
    } else {
      this.spinner.hide();
    }
  }
  fetchOutwardRecords(data) {
    this.rangeSelected = true;
    if (this.OutletPartyId) {
      const dataUrl =
        this.ApiURL +
        "/outwardoutletreportlist/" +
        data.rangestartdate +
        "/" +
        data.rangeenddate +
        "/" +
        this.OutletPartyId;
      console.log("dataUrl", dataUrl);
      this.dtOptions = {
        ajax: dataUrl,
        columns: [
          {
            title: "OutwardDate",
            data: "OutwardDate",
          },
          {
            title: "Outlet",
            data: "Outlet",
          },
          {
            title: "OutwardNumber",
            data: "OutwardNumber",
          },
          {
            title: "Category",
            data: "Category",
          },
          {
            title: "SubCategory",
            data: "SubCategory",
          },
          {
            title: "SeriesName",
            data: "SeriesName",
          },
          {
            title: "ArticleNumber",
            data: "ArticleNumber",
          },
          {
            title: "PartyName",
            data: "PartyName",
          },
          {
            title: "Quantity",
            data: "Quantity",
          },
          {
            title: "Rate",
            data: "Rate",
          },
          {
            title: "BillAmount",
            data: "BillAmount",
          },
          {
            title: "Discount",
            data: "Discount",
          },
          {
            title: "Remarks",
            data: "Remarks",
          },
          {
            title: "Country",
            data: "Country",
          },
          {
            title: "State",
            data: "State",
          },
          {
            title: "City",
            data: "City",
          },
          {
            title: "PinCode",
            data: "PinCode",
          },
        ],
        //dom: 'Bfrtip',
        dom: "lBfrtip",
        // Configure the buttons
        buttons: [
          {
            extend: "copy",
            className: "reportbutton",
            title:
              "Outward Report Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
          },
          {
            extend: "print",
            className: "reportbutton",
            title:
              "Outward Report Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
          },
          {
            extend: "excel",
            className: "reportbutton",
            title:
              "Outward Report Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
          },
        ],
        // Use this attribute to enable the responsive extension
        //className: 'table-button button btn btn-success',
        //responsive: true,
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
      };
    } else {
      const dataUrl =
        this.ApiURL +
        "/outwardreportlist/" +
        data.rangestartdate +
        "/" +
        data.rangeenddate;
      this.dtOptions = {
        ajax: dataUrl,
        columns: [
          {
            title: 'Date',
            data: 'OutwardDate'
          },
          {
            title: 'Outlet',
            data: 'Outlet'
          },
          {
            title: 'SoNumber',
            data: 'SoNumber'
          },
          {
            title: 'OutwardNumber',
            data: 'OutwardNumber'
          },
          {
            title: 'Cat',
            data: 'Category'
          },
          {
            title: 'SubCat',
            data: 'SubCategory'
          },
          {
            title: 'Series',
            data: 'Series'
          },
          {
            title: 'Art No',
            data: 'ArticleNumber'
          },
          {
            title: 'PartyName',
            data: 'PartyName'
          },
          {
            title: 'Quantity',
            data: 'Quantity'
          },
          {
            title: 'Rate',
            data: 'Rate'
          },
          {
            title: 'BillAmount',
            data: 'BillAmount'
          },
          {
            title: 'Discount',
            data: 'Discount'
          },
          {
            title: 'Remarks',
            data: 'Remarks'
          },
          {
            title: 'Country',
            data: 'Country'
          },
          {
            title: 'State',
            data: 'State'
          },
          {
            title: 'City',
            data: 'City'
          },
          {
            title: 'PinCode',
            data: 'PinCode'
          },
          {
            title: 'SalesPerson',
            data: 'SalesPerson'
          },
        ],
        // dom: "lBfrtip",
        dom: 'Bfrtip',
        // buttons: [
        //   {
        //     extend: "copy",
        //     className: "reportbutton",
        //     title:
        //       "Outward Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
        //       exportOptions: {
        //         columns: ':visible',
        //         stripHtml: false,
        //         trim: false,
        //         stripNewlines: false,
        //         decodeEntities: false
        //       }
        //   },
        //   {
        //     extend: "print",
        //     className: "reportbutton",
        //     title:
        //       "Outward Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
        //       exportOptions: {
        //         columns: ':visible',
        //         stripHtml: false,
        //         trim: false,
        //         stripNewlines: false,
        //         decodeEntities: false
        //       }
        //   },
        //   {
        //     extend: "excel",
        //     className: "reportbutton",
        //     title:
        //       "Outward Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
        //       exportOptions: {
        //         columns: ':visible',
        //         stripHtml: false,
        //         trim: false,
        //         stripNewlines: false,
        //         decodeEntities: false
        //       }
        //   },
        // ],
        buttons: [{
          extend: 'copyHtml5',
          titleAttr: 'Copy',
          title: "Outward Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
          exportOptions: {
            columns: ':visible',
            stripHtml: false,
            trim: false,
            stripNewlines: false,
            decodeEntities: false
          }
        },
        {
          extend: 'print',
          titleAttr: 'Print',
          title: "Outward Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
          exportOptions: {
            columns: ':visible',
            stripHtml: false,
            trim: false,
            stripNewlines: false,
            decodeEntities: false
          }
        },
        {
          extend: 'excelHtml5',
          titleAttr: 'Excel',
          title: "Outward Colorhunt " + data.rangestartdate + " To " + data.rangeenddate,
          exportOptions: {
            columns: ':visible',
            stripHtml: false,
            trim: false,
            stripNewlines: false,
            decodeEntities: false,
          }
        }
      ],



        // Use this attribute to enable the responsive extension
        //className: 'table-button button btn btn-success',
        //responsive: true,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      };
    }
  }
  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem("userdata"));

    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 45) {
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
        if (data[i].PageId == 45) {
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

  // PrintRecord() {
  //   window.print();
  // }

  // ngAfterViewInit(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.on('draw.dt', function () {
  //       if ($('.dataTables_empty').length > 0) {
  //         $('.dataTables_empty').remove();
  //       }
  //     });
  //   });
  // }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  // exportOutwardReport() {
  //   this.userService
  //     .getOutwardReport({
  //       RangeStartDate: this.outwardForm.value.rangestartdate,
  //       RangeEndDate: this.outwardForm.value.rangeenddate,
  //       OutletRec: this.outwardForm.value.SelectedOutlet,
  //     })
  //     .subscribe((res) => {
  //       this.allExportRec = res;
  //       const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.allExportRec, {
  //         header: [
  //           "Outlet",
  //           "OutwardNumber",
  //           "SoNumber",
  //           "Category",
  //           "SubCategory",
  //           "Series",
  //           "ArticleNumber",
  //           "PartyName",
  //           "NoPacks",
  //           "Quantity",
  //           "Rate",
  //           "BillAmount",
  //           "Discount",
  //           "Remarks",
  //           "Country",
  //           "State",
  //           "City",
  //           "PinCode",
  //           "SalesPerson",
  //         ],
  //       });
  //       var wscols = [
  //         { width: 11.0 },
  //         { width: 16.0 },
  //         { width: 19.0 },
  //         { width: 14.0 },
  //         { width: 22.0 },
  //         { width: 23.0 },
  //         { width: 30.0 },
  //         { width: 25.0 },
  //         { width: 15.0 },
  //         { width: 8.0 },
  //         { width: 4.0 },

  //         { width: 11.0 },
  //         { width: 8.0 },
  //         { width: 19.0 },
  //         { width: 8.0 },
  //         { width: 18.0 },
  //         { width: 17.0 },
  //         { width: 8.0 },
  //         { width: 17.0 },
  //       ];
  //       ws["!cols"] = wscols;
  //       const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(
  //         wb,
  //         ws,
  //         `${this.outwardForm.value.rangestartdate}-to-${this.outwardForm.value.rangeenddate}`
  //       );
  //       XLSX.writeFile(wb, "OutwardReport.xlsx");
  //     });
  // }
}

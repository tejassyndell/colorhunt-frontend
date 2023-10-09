import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Title } from '@angular/platform-browser';

class Person {
  Id: number;
  Name: string;
  PhoneNumber: string;
  ContactPerson: string;
  State: string;
  City: string;
  PinCode: number;
  Country: string;
  GSTNumber: string;
  UserName: string;
  Action: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  startnumber: number;
}


@Component({
  selector: 'app-partylist',
  templateUrl: './partylist.component.html',
  styleUrls: ['./partylist.component.scss']
})
export class PartylistComponent implements OnInit {
  ApiURL: string = environment.apiURL;
  public partylist: Person[];
  public startnumber: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  allparties: any;
  AdminRoleId: any;
  accessdenied: boolean = true;

  constructor(private userService: UserService, public router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("Party List | Colorhunt");
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.AdminRoleId = item[0]['Role'];
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
  }

  ngOnInit() {

    if (this.accessdenied == false) {
      setTimeout(() => this.spinner.show(), 25);

      this.getParty();


    } else {
      this.spinner.hide();
    }

  }

  //adding aditional code

  mergePhoneNumbers(val: any): string {
    const phoneNumbers = [val.PhoneNumber]; // Add the main phone number

    if (val.Aditional_phone_numbers) {
      phoneNumbers.push(val.Aditional_phone_numbers); // Add the additional phone number if available
    }

    return phoneNumbers.join(', '); // Combine phone numbers with a comma
  }



  public getParty() {
    const that = this;
    this.dtOptions = {
      serverSide: true,
      processing: true,
      columnDefs: [{
        "targets": 'no-sort',
        "orderable": false,
      }], "order": [[1, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(
          this.ApiURL + "/partypostlist",
          dataTablesParameters, {}
        ).subscribe(resp => {
          that.partylist = resp.data;
          that.startnumber = resp.startnumber;
          this.spinner.hide();
          callback({

            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [{ data: 'No' }, { data: 'Name' }, { data: 'PhoneNumber', render: (data, type, row) => this.mergePhoneNumbers(row)  }, { data: 'ContactPerson' }, { data: 'State' }, { data: 'City' }, { data: 'PinCode' }, { data: 'Country' }, { data: 'GSTNumber' }, { data: 'UserName' }, { data: 'Source' }, { data: 'Action' }]
    };
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

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 17) {
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
        if (data[i].PageId == 17) {
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  public delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value == true) {
        this.userService.deleteparty(id).subscribe((res) => {
          this.dtElement.dtInstance.then
            ((dtInstance: DataTables.Api) => dtInstance.ajax.reload()
            );
          this.success(res);
        });
      } else {

      }
    });
  }

  public changePartyStatus(partyid) {
    this.userService.updatepartystatus(partyid).subscribe((res) => {
      if (res['status'] === 'Active') {
        this.toastr.success('Activated', `${res['Party'].Name} is active now`);
      } else {
        this.toastr.error('Deactivated', `${res['Party'].Name} is deactive now`);
      }
    });
  }

  public edit(id) {
    this.router.navigate(['partymaster', { id: id }])
  }
  public exportPartyList(partyist) {

    // console.log(partylist);
    this.userService.getallparty().subscribe((res) => {
      this.allparties = res;
      // console.log('Jaimin',this.allparties);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.allparties);
      var wscols = [
        { width: 22.63 },
        { width: 11.75 }, // second column
        { width: 20.38 }, //...
        { width: 12.63 },
        { width: 11.75 },
        { width: 11.13 },
        { width: 7.25 },
        { width: 7.25 },
        { width: 15.5 },
        { width: 21.13 },
        { width: 7.25 },
        { width: 7.38 },
        { width: 10.75 },
        { width: 14.5 }
      ];
      ws["!cols"] = wscols;
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      XLSX.writeFile(wb, "PartyList.xlsx");
    });

  }
  success(data) {
    if (data.status == "success") {
      this.toastr.success('Success', 'Party Deleted Successfully');
    }
    else if (data.status == 'failed') {
      this.toastr.success('Failed', 'Party cannot be deleted');
    }
    else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

}

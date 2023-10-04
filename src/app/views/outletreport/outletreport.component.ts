import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from './../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-outletreport',
  templateUrl: './outletreport.component.html',
  styleUrls: ['./outletreport.component.scss']
})
export class OutletreportComponent implements OnInit {
  getsallstocks: any;
  public partypdown: any = [];
  outletreportgetdata: Boolean = false;
  ApiURL: string = environment.apiURL;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  partyid: number = 0;
  accessdenied: boolean = false;

    dtTrigger: Subject<any> = new Subject<any>();
  constructor(private userService: UserService, public router: Router, private spinner: NgxSpinnerService,private titleService: Title) {

    this.titleService.setTitle("Outlet Report | Colorhunt");
  }

  ngOnInit(): void {
    let item = JSON.parse(localStorage.getItem('userdata'));

    if(item[0].Role==2){
      this.partyid = 0;
    }else{
      this.partyid = item[0].PartyId;
    }
    this.userService.getoutletparty(this.partyid).subscribe((res) => {
      this.partypdown = res;
    });


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
        
        if (data[i].PageId == 47) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }
         
          break;
        } else {
          this.accessdenied = true;
        }

      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 47) {
          if (data[i].ListRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }
         
          break;
        } else {
          this.accessdenied = true;
        }

      }

    }
  }

  onChangePartyId(event) {

    this.outletreportgetdata = false;
    if (event.target.value != "") {
      this.spinner.show();
      setTimeout(() => {
        const newVal = event.target.value;
        this.outletreportgetdata = true;
        const dataUrl = this.ApiURL + "/getoutletstocks/" + newVal;
        this.dtOptions = {
          ajax: dataUrl,
          columns: [{
            title: 'No',
            data: 'ArticleId'
          }, {
            title: 'Article No',
            data: 'ArticleNumber'
          }, {
            title: 'Category',
            data: 'Title'
          },
          {
            title: 'Brand',
            data: 'BrandName',
          },
          {
            title: 'Colorwise Qty',
            data: 'STOCKS'
          },
          {
            title: 'Total Qty',
            data: 'TotalPieces'
          },
          {
            title: 'Article Color',
            data: 'ArticleColor',
            class: 'none'
          }, {
            title: 'Article Size',
            data: 'ArticleSize',
            class: 'none'
          }, {
            title: 'Article Ratio',
            data: 'ArticleRatio',
            class: 'none'
          },
          {
            title: 'Sub-Category',
            data: 'Subcategory',
            class: 'none'
          },
          {
            title: 'Style Description',
            data: 'StyleDescription',
            class: 'none'
          }
          ],
          dom: "lBfrtip",
          // Configure the buttons
          buttons: [
            { extend: 'copy', className: 'reportbutton' },
            { extend: 'print', className: 'reportbutton' },
            { extend: 'excel', className: 'reportbutton' }
          ],
          // Use this attribute to enable the responsive extension
          //className: 'table-button button btn btn-success',
          responsive: true
        };

        this.spinner.hide();
      }, 500);

    } else {
      this.outletreportgetdata = false;
      this.spinner.hide();
    }
  }

}

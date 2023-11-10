import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const atLeastOneFieldValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const gstNumber = control.get('GSTNumber').value;
  const panNumber = control.get('PanNumber').value;

  return gstNumber || panNumber ? null : { atLeastOneFieldRequired: true };
};



@Component({
  selector: 'app-partymaster',
  templateUrl: './partymaster.component.html',
  styleUrls: ['./partymaster.component.scss']
})
export class PartymasterComponent implements OnInit {
  public editarray = {};
  public geoCities;
  public sources;
  public geoStates;
  public geoCountries;
  public geoPinCodes;
  public salespersons: any = [];
  PARTYPAGE: any;
  errorexit: string = "";
  partyForm: FormGroup;
  OutletAssign: any;
  accessdenied: boolean = true;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  isList: any;
  outletDisable: boolean = false;
  //added aditional code
  additionalPhoneNumbers: string[] = [];
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private titleService: Title) {
    this.titleService.setTitle("Add Party | Colorhunt");

    this.partyForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      ContactPerson: [''],
      State: ['', [Validators.required]],
      City: ['', [Validators.required]],
      PinCode: ['', [Validators.required]],
      Country: ['', [Validators.required]],
      GSTNumber: ['', ],
      PanNumber: ['', ],
      GSTType: ['GST'],
      Discount: ['0', [Validators.min(0), Validators.max(100)]],
      OutletArticleRate: [''],
      OutletAssign: [''],
      SalesPerson: ['', [Validators.required]],
      Source: ['', [Validators.required]],
      // added aditional code
      phoneNumberControls: this.formBuilder.array([]),
      
      
    },
    { validator: atLeastOneFieldValidator });
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (item[0].Role == 2) {
      this.outletDisable = true;
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

      if (this.isAdd == true)
        this.PARTYPAGE = "Add";
      let data = this.route.snapshot.paramMap.get('id');

      if (this.route.snapshot.paramMap.get('id')) {
        this.PARTYPAGE = "Edit";
        this.userService.getpartyidwise(data).subscribe((res) => {
          if (res != "") {
            if (res[0].OutletAssign == "0") {
              this.OutletAssign = "";
            } else {
              this.OutletAssign = res[0].OutletAssign;
            }

            this.editarray = {
              Name: res[0].Name,
              Address: res[0].Address,
              PhoneNumber: res[0].PhoneNumber,
              ContactPerson: res[0].ContactPerson,
              State: res[0].State,
              City: res[0].City,
              PinCode: res[0].PinCode,
              Country: res[0].Country,
              GSTNumber: res[0].GSTNumber,
              PanNumber: res[0].PanNumber,
              GSTType: res[0].GSTType,
              Discount: res[0].Discount,
              OutletAssign: res[0].OutletAssign,
              OutletArticleRate: res[0].OutletArticleRate,
              SalesPerson: res[0].UserId,
              Source: res[0].Source,
              //added aditional code
              Additional_phone_numbers: res[0].Additional_phone_numbers
            }
            this.partyForm.patchValue(this.editarray);
            //added aditional code

            // Fetch the additional phone numbers from the editarray object and add them to the form
            const additionalPhoneNumbersString = this.editarray['Additional_phone_numbers'];
            this.additionalPhoneNumbers = this.parseAdditionalPhoneNumbers(additionalPhoneNumbersString);

            // Add the additional phone number controls to the form
            this.additionalPhoneNumbers.forEach((phoneNumber) => {
              this.addPhoneNumberControl(phoneNumber);
            });
          }
        });
      }
      this.userService.getgeoofparties().subscribe((res) => {
        this.geoCities = res['cities'];
        this.geoStates = res['states'];
        this.geoCountries = res['countries'];
        this.geoPinCodes = res['pincodes'];
        this.sources = res['sources'];

      });
      this.userService.getsalespersons().subscribe((res) => {
        this.salespersons = res['salespersons'];
      });
    }
  }

  //added aditional code

  onPhoneNumberKeyDown(event: KeyboardEvent) {
    // ... (existing code)
  }
  

  // Function to add a new phone number control to the phoneNumberControls array
  addPhoneNumberControl(phoneNumber: string = '') {
    const control = this.formBuilder.control(phoneNumber, [Validators.required]);
    this.phoneNumberControls.push(control);
  }

  // Function to remove a phone number control from the phoneNumberControls array
  removePhoneNumber(index: number) {
    this.phoneNumberControls.removeAt(index);
  }

  // Helper function to get the phoneNumberControls FormArray
  get phoneNumberControls() {
    return this.partyForm.get('phoneNumberControls') as FormArray;
  }

  private parseAdditionalPhoneNumbers(additionalPhoneNumbersString: string): string[] {
    if (!additionalPhoneNumbersString) {
      console.error('additionalPhoneNumbersString is null or undefined');
      return [];
    }

    console.log('additionalPhoneNumbersString:', additionalPhoneNumbersString);

    const numbers = additionalPhoneNumbersString.split(',').map((number) => number.trim());
    return numbers.filter((number) => number !== "");
  }



  // Initicate user add
  dopartyadd() {
    document.getElementById('submit-button').setAttribute('disabled', 'true');
    this.spinner.show();

    // Parse additional phone numbers from the dynamic FormArray
    const additionalPhoneNumbers = this.phoneNumberControls.value;
    const additionalPhoneNumbersString = additionalPhoneNumbers.join(',');

    if (this.route.snapshot.paramMap.get('id')) {
      let editobject = {
        id: this.route.snapshot.paramMap.get('id'),
        Name: this.partyForm.value.Name,
        Address: this.partyForm.value.Address,
        PhoneNumber: this.partyForm.value.PhoneNumber,
        ContactPerson: this.partyForm.value.ContactPerson,
        State: this.partyForm.value.State,
        City: this.partyForm.value.City,
        PinCode: this.partyForm.value.PinCode,
        Country: this.partyForm.value.Country,
        GSTNumber: this.partyForm.value.GSTNumber,
        PanNumber: this.partyForm.value.PanNumber,
        GSTType: this.partyForm.value.GSTType,
        Discount: this.partyForm.value.Discount,
        OutletArticleRate: this.partyForm.value.OutletArticleRate,
        OutletAssign: this.partyForm.value.OutletAssign,
        SalesPerson: this.partyForm.value.SalesPerson,
        Source: this.partyForm.value.Source,
        //added aditional code
        Additional_phone_numbers: additionalPhoneNumbersString,
        
      };

      this.userService.updateParty(editobject).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          this.successupdated(userdata);
        }
      );
    } else {
      let addobject = {
        Name: this.partyForm.value.Name,
        Address: this.partyForm.value.Address,
        PhoneNumber: this.partyForm.value.PhoneNumber,
        ContactPerson: this.partyForm.value.ContactPerson,
        State: this.partyForm.value.State,
        City: this.partyForm.value.City,
        PinCode: this.partyForm.value.PinCode,
        Country: this.partyForm.value.Country,
        GSTNumber: this.partyForm.value.GSTNumber,
        PanNumber: this.partyForm.value.PanNumber,
        GSTType: this.partyForm.value.GSTType,
        Discount: this.partyForm.value.Discount,
        OutletArticleRate: this.partyForm.value.OutletArticleRate,
        OutletAssign: this.partyForm.value.OutletAssign,
        SalesPerson: this.partyForm.value.SalesPerson,
        Source: this.partyForm.value.Source,
        //added aditional code
        Additional_phone_numbers: additionalPhoneNumbersString,


      };
      console.log('test', addobject)


      this.userService.dopartyadd(addobject).subscribe(
        userdata => {
          document.getElementById('submit-button').removeAttribute('disabled');
          this.spinner.hide();
          if (userdata == "allreadyexits") {
            this.toastr.error('Failed', 'All Ready Party Name exist');
          } else {
            this.errorexit = "";
            this.success(userdata);
          }
        }
      );
    }
  }

  // User Add success function
  success(data) {
    if (data.id != "") {
      this.router.navigate(['/partylist']);
      this.toastr.success('Success', 'Party Add Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 17) {
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
        if (data[i].PageId == 17) {
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

  successupdated(data) {
    if (data.id != "") {
      this.router.navigate(['/partylist']);
      this.toastr.success('Success', 'Party Updated Successfully');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
  }

  goBack() {
    window.history.back();
  }

}

import { RacklistComponent } from './views/racklist/racklist.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



import { DataTablesModule } from 'angular-datatables';


import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// Modules
// import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

// Services
import { DatePipe } from '@angular/common';
import { UserService } from './services/user.service';

import { NgxSpinnerModule } from 'ngx-spinner';
import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';
//import {NgxBarcodeScannerModule} from '@eisberg-labs/ngx-barcode-scanner';
//import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import ngx-barcode module
import { NgxBarcode6Module } from 'ngx-barcode6';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

//Print
import { NgxPrintModule } from 'ngx-print';

import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { LightboxModule } from 'ngx-lightbox';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
// import { ChartsModule } from 'ng2-charts/ng2-charts';
import { UsersComponent } from './views/users/users.component';
import { InwardComponent } from './views/inward/inward.component';
import { OutwardComponent } from './views/outward/outward.component';
import { PoComponent } from './views/po/po.component';
import { SoComponent } from './views/so/so.component';
import { VendorComponent } from './views/vendor/vendor.component';
import { BrandComponent } from './views/brand/brand.component';
import { CategoryComponent } from './views/category/category.component';
import { CategorylistComponent } from './views/categorylist/categorylist.component';
import { BeanerComponent } from './views/beaner/beaner.component';
import { BeanerlistComponent } from './views/beanerlist/beanerlist.component';
import { ArticlesizeComponent } from './views/articlesize/articlesize.component';
import { ArticlecolorComponent } from './views/articlecolor/articlecolor.component';
import { AccessrightsComponent } from './views/accessrights/accessrights.component';
import { UserlistComponent } from './views/userlist/userlist.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ArticlecolorlistComponent } from './views/articlecolorlist/articlecolorlist.component';
import { SizelistComponent } from './views/sizelist/sizelist.component';
import { BrandlistComponent } from './views/brandlist/brandlist.component';
//adding aditional code
import { TransportationComponent } from './views/transportation/transportation.component';
import { TransportationlistComponent } from './views/transportationlist/transportationlist.component';
import { RackComponent } from './views/rack/rack.component';
import { VendorlistComponent } from './views/vendorlist/vendorlist.component';
import { OutwardlistComponent } from './views/outwardlist/outwardlist.component';
import { InwardlistComponent } from './views/inwardlist/inwardlist.component';
import { PolistComponent } from './views/polist/polist.component';
import { SolistComponent } from './views/solist/solist.component';
import { AuthGuard } from './_guards';
import { PartymasterComponent } from './views/partymaster/partymaster.component';
import { PartylistComponent } from './views/partylist/partylist.component';
import { ArticleimgslistComponent } from './views/articleimgslist/articleimgslist.component';
import { ArticlephotosComponent } from './views/articlephotos/articlephotos.component';
import { ArticlephotoslistComponent } from './views/articlephotoslist/articlephotoslist.component';
import { SochallanComponent } from './views/sochallan/sochallan.component';
import { PochallanComponent } from './views/pochallan/pochallan.component';
import { InwardchallanComponent } from './views/inwardchallan/inwardchallan.component';
import { OutwardchallanComponent } from './views/outwardchallan/outwardchallan.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { FilterPipe } from './filter.pipe';
import { SalesreturnComponent } from './views/salesreturn/salesreturn.component';
import { PurchasereturnComponent } from './views/purchasereturn/purchasereturn.component';
import { SostatusComponent } from './views/sostatus/sostatus.component';
import { SostatuslistComponent } from './views/sostatuslist/sostatuslist.component';
import { SalesreturnlistComponent } from './views/salesreturnlist/salesreturnlist.component';
import { PurchasereturnlistComponent } from './views/purchasereturnlist/purchasereturnlist.component';
import { ArticleratechangeComponent } from './views/articleratechange/articleratechange.component';
import { SalesreturnchallanComponent } from './views/salesreturnchallan/salesreturnchallan.component';
import { PurchasereturnchallanComponent } from './views/purchasereturnchallan/purchasereturnchallan.component';
import { DiscountComponent } from './views/discount/discount.component';

import { ReportsallstocksComponent } from './views/reportsallstocks/reportsallstocks.component';
import { ReportcategoryComponent } from './views/reportcategory/reportcategory.component';
import { PurchasereportlistComponent } from './views/purchasereportlist/purchasereportlist.component';
import { PurchasereportinwardlistComponent } from './views/purchasereportinwardlist/purchasereportinwardlist.component';
import { SalesreportsolistComponent } from './views/salesreportsolist/salesreportsolist.component';
import { WorkorderlistComponent } from './views/workorderlist/workorderlist.component';
import { WorkorderComponent } from './views/workorder/workorder.component';
import { PoreportlistComponent } from './views/poreportlist/poreportlist.component';
// import { SofrontviewComponent } from './views/sofrontview/sofrontview.component';
import { SofrontdetailsComponent } from './views/sofrontdetails/sofrontdetails.component';
import { SocategorylistComponent } from './views/socategorylist/socategorylist.component';
import { SocartComponent } from './views/socart/socart.component';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { OutletComponent } from './views/outlet/outlet.component';
import { OutletlistComponent } from './views/outletlist/outletlist.component';
import { QRCodeModule } from 'angularx-qrcode';
import { OutletchallanComponent } from './views/outletchallan/outletchallan.component';
import { BlankpageComponent } from './views/blankpage/blankpage.component';
import { OutletreportComponent } from './views/outletreport/outletreport.component';
import { SochallanpdfComponent } from './views/sochallanpdf/sochallanpdf.component';
import { MyordersComponent } from './views/myorders/myorders.component';
import { NgSelectModule } from '@ng-select/ng-select';
// import { DeviceDetectorModule } from 'ngx-device-detector';
import { FinancialyearComponent } from './views/financialyear/financialyear.component';
import { FinancialyearlistComponent } from './views/financialyearlist/financialyearlist.component';
import { SoremainingchallanComponent } from './views/soremainingchallan/soremainingchallan.component';
import { SalesreportlistComponent } from './views/salesreportlist/salesreportlist.component';
import { ApprovearticlelistComponent } from './views/approvearticlelist/approvearticlelist.component';
import { HoldarticlelistComponent } from './views/holdarticlelist/holdarticlelist.component';
import { RejectedarticlelistComponent } from './views/rejectedarticlelist/rejectedarticlelist.component';
import { ProductlaunchComponent } from './views/productlaunch/productlaunch.component';
import { ArticlesearchComponent } from './views/articlesearch/articlesearch.component';
import { SubcategorylistComponent } from './views/subcategorylist/subcategorylist.component';
import { SubcategoryComponent } from './views/subcategory/subcategory.component';
import { ImportcsvComponent } from './views/importcsv/importcsv.component';
import { RangeseriesComponent } from './views/rangeseries/rangeseries.component';
import { RangeserieslistComponent } from './views/rangeserieslist/rangeserieslist.component';
import { ArticlelistComponent } from './views/articlelist/articlelist.component';
import { ArticleComponent } from './views/article/article.component';
import { ArticlelaunchlistComponent } from './views/articlelaunchlist/articlelaunchlist.component';
import { ArticlelaunchComponent } from './views/articlelaunch/articlelaunch.component';
import { OutlettransportComponent } from './views/outlettransport/outlettransport.component';
import { StocktransferComponent } from './views/stocktransfer/stocktransfer.component';
import { StocktransferlistComponent } from './views/stocktransferlist/stocktransferlist.component';
import { UserroleComponent } from './views/userrole/userrole.component';
import { UserrolelistComponent } from './views/userrolelist/userrolelist.component';
import { OutletsalesreturnComponent } from './views/outletsalesreturn/outletsalesreturn.component';
import { OutletsalesreturnlistComponent } from './views/outletsalesreturnlist/outletsalesreturnlist.component';
import { OutletsalesreturnchallanComponent } from './views/outletsalesreturnchallan/outletsalesreturnchallan.component';
import { RangereportComponent } from './views/rangereport/rangereport.component';
import { RangestokesreportsComponent } from './views/rangestokesreports/rangestokesreports.component';
import { RangewisedailyreportsComponent } from './views/rangewisedailyreports/rangewisedailyreports.component';


import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { OutletarticlesearchComponent } from './views/outletarticlesearch/outletarticlesearch.component';
import { RejectionlistComponent } from './views/rejectionlist/rejectionlist.component';
import { RejectionComponent } from './views/rejection/rejection.component';
import { BugslistComponent } from './views/bugslist/bugslist.component';
import { SoduplicationlistComponent } from './views/soduplicationlist/soduplicationlist.component';
import { OutwardduplicationlistComponent } from './views/outwardduplicationlist/outwardduplicationlist.component';
import { SalesreturnduplicationComponent } from './views/salesreturnduplication/salesreturnduplication.component';
import { OutwardsoremainingComponent } from './views/outwardsoremaining/outwardsoremaining.component';
import { SoremainingComponent } from './views/soremaining/soremaining.component';
import { AllremainingComponent } from './views/allremaining/allremaining.component';
import { StocktransferduplicateComponent } from './views/stocktransferduplicate/stocktransferduplicate.component';
import { UserviewComponent } from './views/userview/userview.component';
import { UserlogsComponent } from './views/userlogs/userlogs.component';
import { StocktransferchallanComponent } from './views/stocktransferchallan/stocktransferchallan.component';
import { OutwardreportComponent } from './views/outwardreport/outwardreport.component';
import { DailyreportComponent } from './views/dailyreport/dailyreport.component';
import { PoduplicationlistComponent } from './views/poduplicationlist/poduplicationlist.component';
import { InwardduplicationlistComponent } from './views/inwardduplicationlist/inwardduplicationlist.component';
import { LaunchreportComponent } from './views/launchreport/launchreport.component';
import { outletrefilComponent } from './views/outletrefil/outletrefil.component';



const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  pagination: true
};
@NgModule({
  imports: [
    NgxPrintModule,
    NgxSpinnerModule,
    DataTablesModule,
    AutocompleteLibModule,
    NgSelectModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    // NgxBarcodeScannerModule,
    AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    //NgxDaterangepickerMd.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  declarations: [
    AppComponent,
    P404Component,
    P500Component,
    LoginComponent,
    UsersComponent,
    InwardComponent,
    OutwardComponent,
    SoComponent,
    PoComponent,
    VendorComponent,
    BrandComponent,
    CategoryComponent,
    CategorylistComponent,
    BeanerComponent,
    BeanerlistComponent,
    ArticlecolorComponent,
    ArticlesizeComponent,
    AccessrightsComponent,
    UserlistComponent,
    ArticlecolorlistComponent,
    SizelistComponent,
    BrandlistComponent,
     //adding aditional code
     TransportationComponent,
     TransportationlistComponent,
    RacklistComponent,
    RackComponent,
    VendorlistComponent,
    InwardlistComponent,
    OutwardlistComponent,
    SolistComponent,
    PolistComponent,
    PartymasterComponent,
    PartylistComponent,
    ArticleimgslistComponent,
    ArticlephotosComponent,
    ArticlephotoslistComponent,
    SochallanComponent,
    PochallanComponent,
    InwardchallanComponent,
    OutwardchallanComponent,
    FilterPipe,
    SalesreturnComponent,
    PurchasereturnComponent,
    SostatusComponent,
    SostatuslistComponent,
    SalesreturnlistComponent,
    PurchasereturnlistComponent,
    ArticleratechangeComponent,
    SalesreturnchallanComponent,
    PurchasereturnchallanComponent,
    DiscountComponent,
    ReportsallstocksComponent,
    ReportcategoryComponent,
    PurchasereportlistComponent,
    PurchasereportinwardlistComponent,
    SalesreportsolistComponent,
    WorkorderComponent,
    WorkorderlistComponent,
    PoreportlistComponent,
    SofrontdetailsComponent,
    SocategorylistComponent,
    
    APP_CONTAINERS,
    SocartComponent,
    OutletComponent,
    OutletlistComponent,
    OutletchallanComponent,
    BlankpageComponent,
    OutletreportComponent,
    SochallanpdfComponent,
    MyordersComponent,
    FinancialyearComponent,
    FinancialyearlistComponent,
    SoremainingchallanComponent,
    SalesreportlistComponent,
    ApprovearticlelistComponent,
    HoldarticlelistComponent,
    RejectedarticlelistComponent,
    ProductlaunchComponent,
    ArticlesearchComponent,
    SubcategorylistComponent,
    SubcategoryComponent,
    ImportcsvComponent,
    RangeseriesComponent,
    RangeserieslistComponent,
    ArticlelistComponent,
    ArticleComponent,
    OutlettransportComponent,
    StocktransferComponent,
    StocktransferlistComponent,
    UserroleComponent,
    UserrolelistComponent,
    OutletsalesreturnComponent,
    OutletsalesreturnlistComponent,
    OutletsalesreturnchallanComponent,
    RangereportComponent,
    RangestokesreportsComponent,
    RangewisedailyreportsComponent,
    OutletarticlesearchComponent,
    RejectionlistComponent,
    RejectionComponent,
    BugslistComponent,
    SoduplicationlistComponent,
    OutwardduplicationlistComponent,
    SalesreturnduplicationComponent,
    OutwardsoremainingComponent,
    SoremainingComponent,
    AllremainingComponent,
    StocktransferduplicateComponent,
    UserviewComponent,
    UserlogsComponent,
    StocktransferchallanComponent,
    OutwardreportComponent,
    DailyreportComponent,
    PoduplicationlistComponent,
    InwardduplicationlistComponent,
    ArticlelaunchComponent,
    ArticlelaunchlistComponent,
    LaunchreportComponent,
    outletrefilComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [UserService, AuthGuard, DatePipe , {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  },
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

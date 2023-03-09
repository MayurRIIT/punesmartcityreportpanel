import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ExcelService } from '../core/services/excel.service';
import { TableUtil } from '../core/helpers/tableUtil';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-couponusagereport',
  templateUrl: './couponusagereport.component.html',
  styleUrls: ['./couponusagereport.component.scss'],
})
export class CouponusagereportComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  sponsorList : any = [];
  sponsorId : any = 0;
  selectfromdate : string;
  selecttodate : string;
  viewtype : number=0
  loading : boolean = false;
  dataList : any = [];
  couponStatus : any=0
  sponsorDataId : any=0
  viewdatatype : number=0
  selectfromDatadate : string;
  selecttoDatadate : string;

  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  @ViewChild(MatSort) sort: MatSort;
  public dataSource: any = null;
  public displayedColumns: string[] = [
    "Sr no.",
    "code",
    "status",
    "fullName",
    "school",
    "grade",
    "mobile",
    "userType",
    "registeredAt",
    "Payment Status",
    "Activation Date",
  ];
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = NaN;

  public bulkActivateCoupon = 0;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService : UserService,
      private alertService: AlertService,
      private excelService:ExcelService
  ) {
    
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
          'excel'
      ]
    };
  }

  ngAfterViewInit() {
    this.getSponsor();
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.userList, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getSponsor(){
    this.userService.getSponsor().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            if(localStorage.getItem("userType") == "SPONSOR"){

              for(let data of response.result) {
                if(data._id == localStorage.getItem("sponsorId")){
                  this.sponsorList.push(data);
                  this.sponsorId = data._id;
                  break;
                }
              }
            }else{
              this.sponsorList = [...response.result];
              console.log(this.sponsorList,this.sponsorId);
            }

            //this.sponsorList = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  
  ordinal_suffix_of_eng(i) {
    let j = i % 10,
        k = i % 100;

    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
  }

  resetIndex(){
    this.pageSize = 10;
    this.pageIndex = 1;
    this.bulkActivateCoupon = 0;
  }

  loadDashboardData(){
    this.alertService.clear();
      if(this.sponsorId == 0){
        this.alertService.error("Please select sponsor");
        return;
      }

      // if(this.userCategory == "0"){
      //     if(this.sponsorId == "0"){
      //       this.alertService.error("Please select sponsor");
      //       return;
      //     }
      // }

      if(this.viewtype == 1){
        if(this.selectfromdate  == undefined || this.selectfromdate == "" || this.selectfromdate == null){
          this.alertService.error("Please select from date");
          return;
        }

        if(this.selecttodate == undefined || this.selecttodate == "" || this.selecttodate == null){
          this.alertService.error("Please select to date");
          return;
        }
      }

      console.log(this.sponsorId);
      this.loading = true;
      this.dataSource = null;

      this.userService.getCouponStatusReport(this.sponsorId,this.couponStatus,this.viewtype,this.selectfromdate,this.selecttodate,this.bulkActivateCoupon,this.pageIndex, this.pageSize).subscribe(response => {
        console.log(response);  

        if(response.responseCode == 200){
            this.dataList = response.result.coupondata;
            this.bulkActivateCoupon = response.result.bulkActivate;
            this.dataSource = new MatTableDataSource<any>(this.dataList);
            this.dataLength = response.totalCount;
            this.dataSource.sort = this.sort;

            this.sponsorDataId = this.sponsorId
            this.viewdatatype = this.viewtype
            this.selectfromDatadate  = this.selectfromdate;
            this.selecttoDatadate = this.selecttodate;
            this.loading = false;
        }else{
            this.alertService.error(response.responseMessage);
            this.loading = false;
        }       
      },
      error => {
          this.alertService.error(error);
          this.loading = false;
      });
  }
  

  public getNext(e) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.loadDashboardData();
  }

  getUserActivationStatus(data){
    let status = "";
    if(data){
      if(data.sponsorId == null || data.sponsorId == undefined){
        if((data.SubscriptionCode == 0 || data.SubscriptionCode == "0") || (data.SubscriptionCode == 1 || data.SubscriptionCode == "1") || (data.SubscriptionCode == 2 || data.SubscriptionCode == "2")){
            status = "TRIAL";
        }else{
            status = "ONLINE PAYMENT";
        }
      }else{
        status = "Coupon ("+data.sponsorId.name+")";
      }
    }
    
    return status;
}
  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }



}

import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ExcelService } from '../core/services/excel.service';
import { TableUtil } from '../core/helpers/tableUtil';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";


@Component({
  selector: 'app-referral-code-users',
  templateUrl: './referral-code-users.component.html',
  styleUrls: ['./referral-code-users.component.scss'],
})
export class ReferralCodeUsersComponent implements OnInit {

  public districtId: string = '0';
  public districtList : any = [];
  public salepersonId : string = '0';
  public salePersonList : any = [];
  usersList : any = [];
  loading: boolean = false;


  selectfromdate : string;
  selecttodate : string;
  viewtype : number=0


  title = 'datatables';
  dtOptions: DataTables.Settings =  {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  public dataSource: any = null;
  public displayedColumns: string[] = [
    "Sr no.",
    "UserId",
    "Class",
    "Medium",
    "Name of learner",
    "Mobile",
    "Registered At",
    "Address",
    "Pincode",
    "Payment Status",
    "Activation Date",
    "Referral Code"    
  ];

  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = NaN;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService : UserService,
      private alertService: AlertService,
      private excelService:ExcelService,
      private modalService: NgbModal
  ) {
    
  }

  ngOnInit() {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

    this.getReferralUsers();
    this.loadDashboardData();
  }

  getReferralUsers(){
    this.userService.getReferralUsers().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.salePersonList = response.result;
          }else{
            this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
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
  }

  loadDashboardData() {
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
    this.loading = true;
    this.dataSource = null;
    this.userService.getReferralCodeActivateUserList(this.salepersonId,this.viewtype,this.selectfromdate,this.selecttodate,this.pageIndex,
      this.pageSize)
      .subscribe((res: any) => {
        console.log('my res', res);

        if (res.responseCode == 200) {
          this.usersList = res.result;
          this.loading = false;
          this.dataSource = new MatTableDataSource<any>(this.usersList);
          this.dataLength = res.totalCount;
          this.dataSource.sort = this.sort;
        } else {
          this.alertService.error(res.responseMessage);
          this.loading = false;
        }

       

      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
      })
  }


  public getNext(e) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.loadDashboardData();
  }


  getUserActivationStatus(data) {
    let status = "";
    if (data.sponsorId == null || data.sponsorId == undefined) {
      if (
        data.SubscriptionCode == 0 ||
        data.SubscriptionCode == "0" ||
        data.SubscriptionCode == 1 ||
        data.SubscriptionCode == "1" ||
        data.SubscriptionCode == 2 ||
        data.SubscriptionCode == "2"
      ) {
        status = "TRIAL";
      } else {
        status = "ONLINE PAYMENT";
      }
    } else {
      status = "Coupon (" + data.sponsorId.name + ")";
    }
    return status;
  }



}

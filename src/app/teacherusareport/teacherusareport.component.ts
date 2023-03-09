import { Component, OnInit,ViewChild } from '@angular/core';
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
  selector: 'app-teacherusareport',
  templateUrl: './teacherusareport.component.html',
  styleUrls: ['./teacherusareport.component.scss'],
})
export class TeacherusareportComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  schoolList : any = [];
  gradeList : any = [];
  mediumsList : any = [];
  schoolId : any = "0";
  mediumId  : any = 0;
  gradeId : any = 0;
  contentType : any = '';
  loading : boolean = false;
  datalist : any = [];
  userType : string = "TEACHER";
  searchTerm : string = '';
    
  selectfromdate : string;
  selecttodate : string;
  viewtype : number=0

  gradeData : any = 0;
  mediumData  : any = 0;
  schoolData : any = 0;
  contentTypeData : any = '';

  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();


  @ViewChild(MatSort) sort: MatSort;
  public dataSource: any = null;
  public displayedColumns: string[] = [
    "Sr no.",
    "userType",
    "fullName",
    "grade",
    "sponsor",
    "mobile",
    "registeredAt",
    "Payment Status",
    "Activation Date",
    "overallCompletion",
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
    this.getGrade();
    //this.getSchoolList();
    this.getMediumsList();
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getGrade(){
    this.userService.getGrade().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.gradeList = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
}

  getSchoolList(){
      this.userService.getSchoolList().subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
              //this.schoolList = response.result;
              if(localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER"){

                for(let data of response.result) {
                  if(data._id == localStorage.getItem("schoolId")){
                    this.schoolList.push(data);
                    this.schoolId = data._id;
                    break;
                  }
                }
              }else{
                this.schoolList = [ ...[{  schoolName : "All", _id : "0" }], ...response.result];
                console.log(this.schoolList,this.schoolId);
              }
            }else{
                this.alertService.error(response.responseMessage);
            }       
      },
      error => {
          this.alertService.error(error);
      });
  }

  getMediumsList(){
    this.userService.getMediumsList().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.mediumsList = response.result;
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
  }

  loadDashboardData(){

      this.alertService.clear();
    
      if(this.gradeId == 0){
        this.alertService.error("Please select class");
        return;
      }

      // if(this.schoolId == 0){
      //   this.alertService.error("Please select school");
      //   return;
      // }
      console.log(this.gradeId,this.schoolId,this.mediumId)

      let gradeId = 0;
      if(this.gradeId == "0"){
        gradeId = 0;
      }else{
        gradeId = this.gradeId._id;
      }

      let schoolId = this.schoolId;
      // if(this.schoolId == "0"){
      //   schoolId = 0;
      // }else{
      //   schoolId = this.schoolId._id;
      // }

      let mediumId = 0;
      if(this.mediumId == "0"){
        mediumId = 0;
      }else{
        mediumId = this.mediumId._id;
      }

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
      this.userService.getStudentlearningReport(gradeId,schoolId,mediumId,this.contentType,this.userType,this.viewtype,this.selectfromdate,this.selecttodate,this.pageIndex, this.pageSize).subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
                this.datalist = response.result;
                this.gradeData = this.gradeId;
                this.mediumData = this.mediumId;
                this.schoolData = this.schoolId;
                this.contentTypeData = this.contentType;
                this.loading = false;
                // if(this.dtElement && this.dtElement.dtInstance){
                //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                //     // Destroy the table first
                //     dtInstance.destroy();
                //     this.dtTrigger.next();
                //     // Call the dtTrigger to rerender again
                //   });
                  
                // }else{
                //   this.dtTrigger.next();
                // }
                this.dataSource = new MatTableDataSource<any>(this.datalist);
                this.dataLength = response.totalCount;
                this.dataSource.sort = this.sort;
                
                
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

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  getUserActivationStatus(data){
      let status = "";
      if(data.sponsorId == null || data.sponsorId == undefined){
          if((data.SubscriptionCode == 0 || data.SubscriptionCode == "0") || (data.SubscriptionCode == 1 || data.SubscriptionCode == "1") || (data.SubscriptionCode == 2 || data.SubscriptionCode == "2")){
              status = "TRIAL";
          }else{
              status = "ONLINE PAYMENT";
          }
      }else{
        status = "Coupon ("+data.sponsorId.name+")";
      }
      return status;
  }

}

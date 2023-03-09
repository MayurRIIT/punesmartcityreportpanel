import { Component, OnInit, ViewChild,ElementRef } from "@angular/core";
import { AuthenticationService } from "../core/services/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService } from "../core/services/alert.service";
import { UserService } from "../core/services/user.service";
import { ExcelService } from "../core/services/excel.service";
import { TableUtil } from "../core/helpers/tableUtil";
import { Subject, fromEvent } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PupupFormComponent } from "../contentusagereport/popup/pup-up-form";
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-enrolpaymentreport",
  templateUrl: "./enrolpaymentreport.component.html",
  styleUrls: ["./enrolpaymentreport.component.scss"],
})
export class EnrolpaymentreportComponent implements OnInit {
  gradeList: any = [];
  mediumsList: any = [];
  mediumId: any = 0;
  gradeId: any = 0;
  loading: boolean = false;
  datalist: any = [];
  searchTerm: string = "";
  gradeData: any = 0;
  mediumData: any = 0;
  userType: string;

  selectfromdate: string;
  selecttodate: string;
  viewtype: number = 0;
  paymentStatusId: number = 0;

  schoolIds: any = [];
  sponsorId: any = [];
  paymentStatusRequired: boolean = true;

  title = "datatables";
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  public dataSource: any = null;
  public displayedColumns: string[] = [
    "Sr no.",
    "Class",
    "Medium",
    "School Name",
    "Name of learner",
    "Mobile",
    "Email",
    "Registered At",
    "Address"
  ];
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = NaN;

  @ViewChild('searchElement', { static: true }) searchElement: ElementRef;
  public searchUser: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private excelService: ExcelService,
    public dialog: MatDialog
  ) {

    this.userType = localStorage.getItem("userType");

    if(this.userType == 'ADMIN'){
      this.displayedColumns.push("Payment Status");
    }
    
    this.displayedColumns.push(...[
      "Activation Date",
      "Role",
      "Gender",
      "Pincode",
      "Landmark City/Village",
    ]);
    if(this.userType == 'ADMIN'){
      this.displayedColumns.push("UserId",);
    }

  }

  ngOnInit() {
    console.log(this.userType);

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      processing: true,
      dom: "Bfrtip",
      buttons: ["excel"],
    };

    if(this.userType == "SPONSOR") {
      this.sponsorId = [localStorage.getItem("sponsorId")];
      this.paymentStatusId = 0;
      this.paymentStatusRequired = false;
    }else if(this.userType == "SCHOOL" || this.userType == "PRINCIPAL" || this.userType == "TEACHER") {
      this.schoolIds = [localStorage.getItem("schoolId")];
      this.paymentStatusId = 0;
      this.paymentStatusRequired = false;
    }

    fromEvent(this.searchElement.nativeElement, 'keyup').pipe(map((event: any) => {
        return event.target.value;
      })//, filter(res => res.length > 2)      // if character length greater then 2
      , debounceTime(1000) // Time in milliseconds between key events
      , distinctUntilChanged()// If previous query is diffent from current   
    ).subscribe((text: string) => {      // subscription for response
        console.log(text)
        this.pageIndex = 1;
        this.searchTableData(text);
    });

  }

  ngAfterViewInit() {
    this.getGrade();
    this.getMediumsList();
  }

  exportAsXLSX(): void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getGrade() {
    this.userService.getGrade().subscribe(
      (response) => {
        console.log(response);
        if (response.responseCode == 200) {
          this.gradeList = response.result;
        } else {
          this.alertService.error(response.responseMessage);
        }
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  getMediumsList() {
    this.userService.getMediumsList().subscribe(
      (response) => {
        console.log(response);
        if (response.responseCode == 200) {
          this.mediumsList = response.result;
        } else {
          this.alertService.error(response.responseMessage);
        }
      },
      (error) => {
        this.alertService.error(error);
      }
    );
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

  loadDashboardData() {
    this.alertService.clear();
    this.loading = true;

    console.log(this.gradeId, this.mediumId);

    let gradeId = 0;
    if (this.gradeId == "0") {
      gradeId = 0;
    } else {
      gradeId = this.gradeId._id;
    }

    let mediumId = 0;
    if (this.mediumId == "0") {
      mediumId = 0;
    } else {
      mediumId = this.mediumId._id;
    }

    if (this.viewtype == 1) {
      if (
        this.selectfromdate == undefined ||
        this.selectfromdate == "" ||
        this.selectfromdate == null
      ) {
        this.alertService.error("Please select from date");
        return;
      }

      if (
        this.selecttodate == undefined ||
        this.selecttodate == "" ||
        this.selecttodate == null
      ) {
        this.alertService.error("Please select to date");
        return;
      }
    }

    this.loading = true;
    this.userService
      .getEnrollmentPaymentStatus(
        gradeId,
        mediumId,
        this.sponsorId,
        this.schoolIds,
        this.paymentStatusId,
        this.viewtype,
        this.selectfromdate,
        this.selecttodate,
        this.pageIndex,
        this.pageSize
      )
      .subscribe(
        (response) => {
          console.log(response);
          if (response.responseCode == 200) {
            this.gradeData = this.gradeId;
            this.mediumData = this.mediumId;
            this.datalist = response.result.userdata;
            this.loading = false;
            this.dataSource = new MatTableDataSource<any>(response.result);
            this.dataLength = response.totalCount;
            this.dataSource.sort = this.sort;
          } else {
            this.alertService.error(response.responseMessage);
            this.loading = false;
          }
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  public getNext(e) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    if(this.searchUser && this.searchUser.length > 0)
      this.searchTableData(this.searchUser);
    else
      this.loadDashboardData();
  }

  emailAllEnrollmentPaymentData() {
    let email;
    const dialogRef = this.dialog.open(PupupFormComponent, {
      width: "450px",
      data: { email },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.email) {
        this.alertService.clear();
        this.loading = true;

        console.log(this.gradeId, this.mediumId);

        let gradeId = 0;
        if (this.gradeId == "0") {
          gradeId = 0;
        } else {
          gradeId = this.gradeId._id;
        }

        let mediumId = 0;
        if (this.mediumId == "0") {
          mediumId = 0;
        } else {
          mediumId = this.mediumId._id;
        }

        if (this.viewtype == 1) {
          if (
            this.selectfromdate == undefined ||
            this.selectfromdate == "" ||
            this.selectfromdate == null
          ) {
            this.alertService.error("Please select from date");
            return;
          }

          if (
            this.selecttodate == undefined ||
            this.selecttodate == "" ||
            this.selecttodate == null
          ) {
            this.alertService.error("Please select to date");
            return;
          }
        }

        this.loading = true;
        this.userService
          .seneEnrollPaymentReportEmail(
            gradeId,
            mediumId,
            this.sponsorId,
            this.schoolIds,
            this.paymentStatusId,
            this.viewtype,
            this.selectfromdate,
            this.selecttodate,
            result.email
          )
          .subscribe(
            (response) => {
              console.log(response);

              if (response.responseCode == 200) {
                this.alertService.success("Email sent successfully");
              } else {
                this.alertService.error(response.responseMessage);
                this.loading = false;
              }
            },
            (error) => {
              this.alertService.error(error);
            }
          );
      }
    });
  }

  searchTableData(iText) {
    if (iText !== "") {
      this.alertService.clear();

      let gradeId = 0;
      if (this.gradeId == "0") {
        gradeId = 0;
      } else {
        gradeId = this.gradeId._id;
      }

      let mediumId = 0;
      if (this.mediumId == "0") {
        mediumId = 0;
      } else {
        mediumId = this.mediumId._id;
      }

      if (this.viewtype == 1) {
        if (
          this.selectfromdate == undefined ||
          this.selectfromdate == "" ||
          this.selectfromdate == null
        ) {
          this.alertService.error("Please select from date");
          return;
        }

        if (
          this.selecttodate == undefined ||
          this.selecttodate == "" ||
          this.selecttodate == null
        ) {
          this.alertService.error("Please select to date");
          return;
        }
      }
      this.userService
        .getenrollPaymentReportSearchedList(
          gradeId,
          mediumId,
          this.sponsorId,
          this.schoolIds,
          this.paymentStatusId,
          this.viewtype,
          this.selectfromdate,
          this.selecttodate,
          iText,
          this.pageIndex,
          this.pageSize
        )
        .subscribe(
          (response) => {
             console.log(response);
            if (response.responseCode == 200) {
           
              this.datalist = response.result.userdata;
              this.loading = false;
              this.dataSource = new MatTableDataSource<any>(response.result);
              this.dataLength = response.totalCount;
              this.dataSource.sort = this.sort;
            } else {
              this.alertService.error(response.responseMessage);
            }
          },
          (error) => {
            this.alertService.error(error);
          }
        );
    } else {
      this.loadDashboardData();
    }
  }
  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AuthenticationService } from "../core/services/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService } from "../core/services/alert.service";
import { UserService } from "../core/services/user.service";
import { ExcelService } from "../core/services/excel.service";
import { TableUtil } from "../core/helpers/tableUtil";
import { Subject,fromEvent } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
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
import { PupupFormComponent } from "./popup/pup-up-form";

@Component({
  selector: "app-contentusagereport",
  templateUrl: "./contentusagereport.component.html",
  styleUrls: ["./contentusagereport.component.scss"],
  providers: [PupupFormComponent],
})
export class ContentusagereportComponent implements OnInit {
  gradeList: any = [];
  sponsorList: any = [];
  gradeId: number = 0;
  userCategory: number = 1;
  mediumsList : any = [];
  mediumId  : any = 0;

  sponsorId: any = "0";
  schoolIds: any = [];
  selectfromdate: string;
  selecttodate: string;
  viewtype: number = 0;
  loading: boolean = false;
  userList: any = [];
  totalVideo: number = 0;
  totalEBook: number = 0;
  totalNotes: number = 0;
  totalAudio: number = 0;
  totalTest: number = 0;
  today = new Date(Date.now() - 86400000);
  title = "datatables";
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public searchUser: string = "";

  @ViewChild('searchElement', { static: true }) searchElement: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  public dataSource: any = null;
  public displayedColumns: string[] = [
    "Sr no.",
    "userType",
    "fullName",
    "grade",
    "sponsor",
    "mobile",
    "registeredAt",
    "video",
    "eBook",
    "notes",
    "audio",
    "test",
    "videoCompletionPercentage",
    "notesCompletionPercentage",
    "audioCompletionPercentage",
    "ebookCompletionPercentage",
    "testsCompletionPercentage",
    "overallCompletion",
  ];
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = NaN;

  userType: string;

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

  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      processing: true,
      dom: "Bfrtip",
      buttons: ["excel"],
    };

  

    if(localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER") {
      this.schoolIds = [localStorage.getItem("schoolId")];
      this.userCategory = 0;
    }

    fromEvent(this.searchElement.nativeElement, 'keyup').pipe(map((event: any) => {
      return event.target.value;
    })//, filter(res => res.length > 2)      // if character length greater then 2
      , debounceTime(1000) // Time in milliseconds between key events
      , distinctUntilChanged()// If previous query is diffent from current   
    ).subscribe((text: string) => {      // subscription for response
        console.log(text)
        this.pageIndex = 1;
        this.searchTableData();
    });
    
    
  }

  ngAfterViewInit() {
    this.getSponsor();
    this.getGrade();
    this.getMediumsList();

  }

  exportAsXLSX(): void {
    //this.excelService.exportAsExcelFile(this.userList, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getSponsor() {
    this.userService.getSponsor().subscribe(
      (response) => {
        console.log(response);
        if (response.responseCode == 200) {
          //this.sponsorList = response.result;
          if (localStorage.getItem("userType") == "SPONSOR") {
            for (let data of response.result) {
              if (data._id == localStorage.getItem("sponsorId")) {
                this.sponsorList.push(data);
                this.sponsorId = data._id;
                break;
              }
            }
          } else {
            this.sponsorList = [
              ...[{ name: "All", _id: "0" }],
              ...response.result,
            ];
            console.log(this.sponsorList, this.sponsorId);
          }
        } else {
          this.alertService.error(response.responseMessage);
        }
      },
      (error) => {
        this.alertService.error(error);
      }
    );
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

  loadDashboardData() {
    this.alertService.clear();

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

    // if (this.viewtype == 1) {
    //   this.selecttodate = new Date().toISOString();
    //   let yesterday = new Date();
    //   yesterday.setDate(yesterday.getDate() - 1);
    //   this.selectfromdate = yesterday.toISOString();
    // }

    this.loading = true;
    this.userService
      .getContentUsageData(
        this.userCategory,
        this.sponsorId,
        this.gradeId,
        this.mediumId,
        this.schoolIds,
        this.viewtype,
        this.selectfromdate,
        this.selecttodate,
        this.pageIndex,
        this.pageSize
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.totalVideo = 0;
          this.totalEBook = 0;
          this.totalNotes = 0;
          this.totalAudio = 0;
          this.totalTest = 0;
          if (response.responseCode == 200) {
            this.userList = response?.result?.userdata;
            this.dataSource = new MatTableDataSource<any>(
              response.result?.userdata
            );
            console.log(this.dataSource);
            this.dataLength = response?.totalCount;
            this.dataSource.sort = this.sort;
            this.loading = false;
            this.totalVideo = response?.result?.totalVideoList;
            this.totalEBook = response?.result?.totalEbookList;
            this.totalNotes = response?.result?.totalNoteList;
            this.totalAudio = response?.result?.totalAudioList;
            this.totalTest = response?.result?.totalTestList;
          } else {
            this.alertService.error(response?.responseMessage);
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
      this.searchTableData()
    else
      this.loadDashboardData();
  }

  searchData(){
    this.pageIndex = 1;
    this.searchTableData();
  }
  searchTableData() {
    if (this.searchUser !== "") {
      this.alertService.clear();

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

      // if (this.viewtype == 1) {
      //   this.selecttodate = new Date().toISOString();
      //   let yesterday = new Date();
      //   yesterday.setDate(yesterday.getDate() - 1);
      //   this.selectfromdate = yesterday.toISOString();
      // }

      this.loading = true;
      this.userService
        .getContentUsageReportSearchedList(
          this.userCategory,
          this.sponsorId,
          this.gradeId,
          this.mediumId,
          this.schoolIds,
          this.viewtype,
          this.selectfromdate,
          this.selecttodate,
          this.pageIndex,
          this.pageSize,
          this.searchUser
        )
        .subscribe(
          (response) => {
            this.totalVideo = 0;
            this.totalEBook = 0;
            this.totalNotes = 0;
            this.totalAudio = 0;
            this.totalTest = 0;
            // console.log(response.result.data);
            if (response.responseCode == 200) {
              this.userList = response?.result?.userdata;
              this.dataSource = new MatTableDataSource<any>(
                response.result?.userdata
              );
              console.log(this.dataSource);
              this.dataLength = response?.totalCount;
              this.dataSource.sort = this.sort;
              this.loading = false;
              this.totalVideo = response?.result?.totalVideoList;
              this.totalEBook = response?.result?.totalEbookList;
              this.totalNotes = response?.result?.totalNoteList;
              this.totalAudio = response?.result?.totalAudioList;
              this.totalTest = response?.result?.totalTestList;
            } else {
              this.alertService.error(response.responseMessage);
              this.loading = false;
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

  emailAllContentUsageData() {
    let email;
    const dialogRef = this.dialog.open(PupupFormComponent, {
      width: "450px",
      data: { email },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.email) {
        this.alertService.clear();

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

        // if (this.viewtype == 1) {
        //   this.selecttodate = new Date().toISOString();
        //   let yesterday = new Date();
        //   yesterday.setDate(yesterday.getDate() - 1);
        //   this.selectfromdate = yesterday.toISOString();
        // }

        this.loading = true;
        this.userService
          .sendContentUsageReportEmail(
            this.userCategory,
            this.sponsorId,
            this.gradeId,
            this.mediumId,
            this.schoolIds,
            this.viewtype,
            this.selectfromdate,
            this.selecttodate,
            this.pageIndex,
            this.pageSize,
            result.email
          )
          .subscribe(
            (response) => {
              console.log(response);

              if (response.responseCode == 200) {
                this.loading = false;
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

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}

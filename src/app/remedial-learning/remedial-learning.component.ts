import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AlertService } from "../core/services/alert.service";
import { AuthenticationService } from "../core/services/authentication.service";
import { ExcelService } from "../core/services/excel.service";
import { UserService } from "../core/services/user.service";
import { saveAs } from "file-saver";
@Component({
  selector: "app-remedial-learning",
  templateUrl: "./remedial-learning.component.html",
  styleUrls: ["./remedial-learning.component.scss"],
})
export class RemedialLearningComponent implements OnInit {
  categoryList: any = [];
  loading: boolean = false;
  alertmessage: any;
  alertBUmessage: any;
  gradeList: any = [];
  gradeId: any = 0;
  mediumsList: any = [];
  mediumId: any = 0;
  userType: string;

  subjectList: any = [];
  subjectId: any = 0;
  modelBtnTitle: string = "Add";
  bulkuploadexcelFile: any = null;
  questionPaperFile: any = null;
  answerKeyFile: any = null;

  search: string = "";

  Title: string = "";
  Description: string = "";
  Thumbnail: string = "";
  type: string = "INTERACTIVE";
  contentStatus: string = "LIVE";
  url: string = "";
  createTestFlag: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  public dataSource: any = null;
  public displayedColumns: string[] = [
    "Sr no.",
    'Grade & Medium',
    "title",
    "description",
    "thumbnail",
    "actions",
  ];
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = NaN;

  usersList: any = [];
  testPaperList: any = [];

  editTestPaperIndex: number = 0;
  categoryListIdData: any = null;
  title = "datatables";
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private excelService: ExcelService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.userType = localStorage.getItem("userType");

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      processing: true,
    };
    this.getTableData();
  }

  ngAfterViewInit() {
    this.getTableData();
    this.getGrade();    
    this.getMediumsList();
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


  getMediumsList(){
    this.userService.getMediumsList().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.mediumsList = response.result;
            this.mediumId = [];
            this.mediumsList.forEach((mediumelement)=>{
                this.mediumId.push(mediumelement._id)
            })
            
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  downloadCategoryData() {
    this.userService.getAllCategoryList().subscribe((res: any) => {
      if (res.responseCode == 200) {
        const myData = res?.result;
        this.downloadFile(myData);
      }
    });
  }

  downloadFile(data: any) {
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    let csvArray = csv.join("\r\n");

    var blob = new Blob([csvArray], { type: "text/csv" });
    saveAs(blob, "SectionData.csv");
  }

  addCategoryList() {
    let _testObj = {
      title: this.Title,
      description: this.Description,
      thumbnail: this.Thumbnail,
      contentStatus: this.contentStatus,
      type: this.type,
      playListUrl: this.url,
    };

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.createCategoryList(_testObj).subscribe(
      (response) => {
        console.log(response);
        if (response.responseCode == 200) {
          this.resetForm();
          this.alertService.success("Category created successfully");
          this.modalService.dismissAll("Close");
          this.getTableData();
        } else {
          this.alertService.error(response.responseMessage);
          this.createTestFlag = false;
        }
      },
      (error) => {
        this.alertService.error(error);
        this.createTestFlag = false;
      }
    );
  }

  editCategory(iCategoryListData, editCategoryList) {
    console.log(iCategoryListData);

    this.categoryListIdData = iCategoryListData;
    this.Title = iCategoryListData.title;
    this.Description = iCategoryListData.description;
    this.Thumbnail = iCategoryListData.thumbnail;
    this.type = iCategoryListData.type;
    this.contentStatus = iCategoryListData.contentStatus;
    this.url = iCategoryListData.url;

    this.showaddTSModel(editCategoryList);
  }

  updateTestSeries() {
    let _testObj = {
      title: this.Title,
      description: this.Description,
      thumbnail: this.Thumbnail,
      type: this.type,
      contentStatus: this.contentStatus,
      playListUrl: this.url,
    };

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService
      .updateCategoryList(_testObj, this.categoryListIdData._id)
      .subscribe(
        (response) => {
          console.log(response);
          if (response.responseCode == 200) {
            this.resetForm();
            this.alertService.success("Category updated successfully");
            this.modalService.dismissAll("Close");
            this.getTableData();
          } else {
            this.alertService.error(response.responseMessage);
            this.createTestFlag = false;
          }
        },
        (error) => {
          this.alertService.error(error);
          this.createTestFlag = false;
        }
      );
  }

  deleteCategory(iCategoryId) {
    var c = confirm("Are you sure you want to delete this Category?");
    if (c) {
      this.userService.deleteCategory(iCategoryId).subscribe(
        (response) => {
          console.log(response);
          if (response.responseCode == 200) {
            //  this.testSeriesList.splice(iIndex,1);
            this.alertService.success("Category deleted successfully");
            this.getTableData();
          } else {
            this.alertService.error(response.responseMessage);
          }
        },
        (error) => {
          this.alertService.error(error);
        }
      );
    }
  }

  searchCategory(e) {
    if (e.target.value !== "") {
      this.userService.getCategorySearchedList(e.target.value).subscribe(
        (response) => {
          // console.log(response.result.data);
          if (response.responseCode == 200) {
            this.dataSource = new MatTableDataSource<any>(response.result.data);
            console.log(this.dataSource);
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
      this.getTableData();
    }
  }

  resetForm() {
    this.Title = "";
    this.Description = "";
    this.Thumbnail = "";
    this.type = "INTERACTIVE";
    this.contentStatus = "LIVE";
    this.url = "";
  }

  showaddTSModel(content) {
    this.alertmessage = null;
    this.modelBtnTitle = "Add";

    this.modalService
      .open(content, {
        windowClass: "selectedQuestionModalClass",
        ariaLabelledBy: "modal-basic-title",
      })
      .result.then(
        (result) => {
          let closeResult = `Closed with: ${result}`;
          console.log("closeResult -- ", closeResult);
        },
        (reason) => {
          let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          console.log("closeResult -- ", closeResult);
          this.resetForm();
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  public getNext(e) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getTableData();
  }

  public getTableData() {

    const result = [{
      title : "Remedial Learning #1",
      description : "Sample",
      thumbnail : "-"
    }]

    this.dataSource = new MatTableDataSource<any>(result);
    console.log(this.dataSource);
    this.dataLength = 1;

    this.dataSource.sort = this.sort;

    // this.userService
    //   .getCategoryList(this.pageIndex, this.pageSize)
    //   .subscribe((res: any) => {
    //     console.log(res);

    //     if (res.responseCode == 200) {
    //       this.dataSource = new MatTableDataSource<any>(res.result);
    //       console.log(this.dataSource);
    //       this.dataLength = res.totalCount;
    //       console.log(res);

    //       this.dataSource.sort = this.sort;
    //     }
    //   });
  }
}

import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { type } from "os";
import { Subject } from "rxjs";
import { AlertService } from "../core/services/alert.service";
import { AuthenticationService } from "../core/services/authentication.service";
import { ExcelService } from "../core/services/excel.service";
import { UserService } from "../core/services/user.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-media-section",
  templateUrl: "./media-section.component.html",
  styleUrls: ["./media-section.component.scss"],
})
export class MediaSectionComponent implements OnInit {
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

  title: string = "";
  description: string = "";
  order: number;
  thumbnail: string = "";
  videoUrl: string = "";
  mediaURL: string = "";
  studyMaterialURL: string = "";
  mediaType: string = "VIDEO";
  testId: string = "";
  exploreModuleId: string = "";
  createTestFlag: boolean = false;
  sectionTitle: string = "";

  file: File = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  public dataSource: any = null;
  public displayedColumns: string[] = [
    "Sr no.",
    "title",
    "description",
    "order",
    "type",
    "mediaType",
    "status",
    "actions",
  ];
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = NaN;

  usersList: any = [];
  testPaperList: any = [];

  editTestPaperIndex: number = 0;
  mediaData: any = null;
  // title = 'datatables';
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
  ) {
    this.route.params.subscribe((res) => {
      console.log(res);

      this.exploreModuleId = res.id;
      this.sectionTitle = res.title;
      console.log(this.exploreModuleId);
    });
  }

  ngOnInit() {
    this.userType = localStorage.getItem("userType");
    this.getTableData();
  }

  onUpload(event) {
    this.file = event.target.files[0];
    console.log(this.file);
    this.userService.uploadTestSheet(this.file).subscribe((res: any) => {
      if (typeof res === "object") {
        this.testId = res.result._id;
        console.log(this.testId);
      }
    });
  }

  downloadMediaData() {
    this.userService
      .getMediaListWithCategoryId(this.exploreModuleId)
      .subscribe((res: any) => {
        if (res.responseCode == 200 && res.result.length > 0) {
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
    saveAs(blob, "MediaData.csv");
  }

  addMedia() {
    let _testObj = {};
    if (this.testId == "") {
      _testObj = {
        title: this.title,
        description: this.description,
        order: this.order,
        thumbnail: this.thumbnail,
        videoUrl: this.videoUrl,
        mediaURL: this.mediaURL,
        studyMaterialURL: this.studyMaterialURL,
        mediaType: this.mediaType,
        testId: null,
        type: "INTERACTIVE",
        exploreModuleId: this.exploreModuleId,
        testStatus: "ACTIVE",
      };
    } else {
      _testObj = {
        title: this.title,
        description: this.description,
        order: this.order,
        thumbnail: this.thumbnail,
        videoUrl: this.videoUrl,
        mediaURL: this.mediaURL,
        studyMaterialURL: this.studyMaterialURL,
        mediaType: this.mediaType,
        testId: this.testId,
        type: "INTERACTIVE",
        exploreModuleId: this.exploreModuleId,
        testStatus: "ACTIVE",
      };
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.createNewMedia(_testObj).subscribe(
      (response) => {
        console.log(response);
        if (response.responseCode == 200) {
          this.resetForm();
          this.alertService.success("Media created successfully");
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

  editMedia(iMediaData, editMediaList) {
    console.log(iMediaData);

    this.mediaData = iMediaData;
    this.title = iMediaData.title;
    this.description = iMediaData.description;
    this.thumbnail = iMediaData.thumbnail;
    this.order = iMediaData.order;
    this.thumbnail = iMediaData.thumbnail;
    this.videoUrl = iMediaData.videoUrl;
    this.mediaURL = iMediaData.mediaURL;
    this.studyMaterialURL = iMediaData.studyMaterialURL;
    this.mediaType = iMediaData.mediaType;
    this.testId = iMediaData.testId;
    this.showaddTSModel(editMediaList);
  }

  addNewTest(iMediaData, AddNewTest) {
    console.log(iMediaData);

    this.mediaData = iMediaData;
    this.title = iMediaData.title;
    this.description = iMediaData.description;
    this.thumbnail = iMediaData.thumbnail;
    this.order = iMediaData.order;
    this.thumbnail = iMediaData.thumbnail;
    this.videoUrl = iMediaData.videoUrl;
    this.mediaURL = iMediaData.mediaURL;
    this.studyMaterialURL = iMediaData.studyMaterialURL;
    this.mediaType = iMediaData.mediaType;
    (this.testId = ""), this.showaddTSModel(AddNewTest);
  }

  updateMedia() {
    let _testObj = {};
    if (this.testId == "") {
      _testObj = {
        title: this.title,
        description: this.description,
        order: this.order,
        thumbnail: this.thumbnail,
        videoUrl: this.videoUrl,
        mediaURL: this.mediaURL,
        studyMaterialURL: this.studyMaterialURL,
        mediaType: this.mediaType,
        testId: null,
        type: "INTERACTIVE",
        testStatus: "ACTIVE",
        exploreModuleId: this.exploreModuleId,
      };
    } else {
      _testObj = {
        title: this.title,
        description: this.description,
        order: this.order,
        thumbnail: this.thumbnail,
        videoUrl: this.videoUrl,
        mediaURL: this.mediaURL,
        studyMaterialURL: this.studyMaterialURL,
        mediaType: this.mediaType,
        testId: this.testId,
        type: "INTERACTIVE",
        testStatus: "ACTIVE",
        exploreModuleId: this.exploreModuleId,
      };
    }
    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.updateMedia(_testObj, this.mediaData._id).subscribe(
      (response) => {
        console.log(response);
        if (response.responseCode == 200) {
          this.resetForm();
          this.alertService.success("Media updated successfully");
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

  searchMedia(e) {
    console.log(e.target.value);
    if (e.target.value !== "") {
      this.userService.getMediaSearchedList(e.target.value).subscribe(
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

  deleteMedia(iMediaId) {
    var c = confirm("Are you sure you want to delete this Media?");
    if (c) {
      this.userService.deleteMedia(iMediaId).subscribe(
        (response) => {
          console.log(response);
          if (response.responseCode == 200) {
            //  this.testSeriesList.splice(iIndex,1);
            this.alertService.success("Media deleted successfully");
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

  deleteTest(iMedia) {
    var c = confirm("Are you sure you want to delete this Test?");
    if (c) {
      this.userService.deleteExistingTest(iMedia._id, iMedia.testId).subscribe(
        (response) => {
          console.log(response);
          if (response.responseCode == 200) {
            //  this.testSeriesList.splice(iIndex,1);
            this.alertService.success("Test deleted successfully");
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

  resetForm() {
    this.title = "";
    this.description = "";
    this.order = NaN;
    this.thumbnail = "";
    this.videoUrl = "";
    this.mediaURL = "";
    this.studyMaterialURL = "";
    this.mediaType = "VIDEO";
    this.testId = "";
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
    this.userService
      .getMediaListWithCategoryId(this.exploreModuleId)
      .subscribe((res: any) => {
        console.log(res);
        if (res.responseCode == 200) {
          if (res.result.length == 0) {
            this.alertService.error(res.responseMessage);
          } else {
            this.dataSource = new MatTableDataSource<any>(res.result);
            this.dataSource.sort = this.sort;
            console.log(res);

            this.dataLength = res.totalCount;
          }
        }
      });
  }
}

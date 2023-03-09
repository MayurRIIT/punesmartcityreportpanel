import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ExcelService } from '../core/services/excel.service';
import { TableUtil } from '../core/helpers/tableUtil';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-subjectteacherlinkup',
  templateUrl: './subjectteacherlinkup.component.html',
  styleUrls: ['./subjectteacherlinkup.component.scss'],
})
export class SubjectteacherlinkupComponent implements OnInit {

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  gradeList: any = [];
  subjectList: any = [];
  subjectId: any = 0;
  gradeId: any = 0;
  mediumsList: any = [];
  mediumId: any = 0;
  loading: boolean = false;
  datalist: any = [];
  testquestionList: any = [];
  closeResult: string;

  searchTerm: string = '';
  gradeData: any = 0;
  subjectData: any = 0;
  mediumData: any = 0;
  schoolData: any = '';
  //totalInteractiveTestList : number = 0;

  selectedQuestions: any = {};
  selectedQuestionIds: any = [];

  schoolId: any = 0;
  schoolList: any = [];

  title = 'datatables';
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

  }

  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

  }

  ngAfterViewInit() {
    this.getGrade();
    this.getMediumsList();
    this.getSchoolList();

  }

  exportAsXLSX(): void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getGrade() {
    this.userService.getGrade().subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        this.gradeList = response.result;
      } else {
        this.alertService.error(response.responseMessage);
      }
    },
      error => {
        this.alertService.error(error);
      });
  }


  getMediumsList() {
    this.userService.getMediumsList().subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        this.mediumsList = response.result;
      } else {
        this.alertService.error(response.responseMessage);
      }
    },
      error => {
        this.alertService.error(error);
      });
  }

  getSchoolList() {
    this.userService.getQBSchoolList().subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        //this.schoolList = response.result;
        if (localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER") {
          for (let data of response.result) {
            if (data._id == localStorage.getItem("schoolId")) {
              this.schoolList.push(data);
              this.schoolId = data._id;
              break;
            }
          }
        } else {
          this.schoolList = [...response.result];
          console.log(this.schoolList, this.schoolId);
        }
      } else {
        this.alertService.error(response.responseMessage);
      }
    },
      error => {
        this.alertService.error(error);
      });
  }

  onMediumChangeGetSubjectList(event) {
    console.log(event);
    this.getSubjectList();
  }

  getSubjectList() {
    this.subjectId = 0;
    this.subjectList = [];
    let mediumId = 0;
    let gradeId = 0;

    if (this.gradeId == "0") {
      gradeId = 0;
    } else {
      gradeId = this.gradeId._id;
    }

    if (this.mediumId == "0") {
      mediumId = 0;
    } else {
      mediumId = this.mediumId._id;
    }

    this.userService.getSubjectList(gradeId, mediumId).subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        this.subjectList = response.result;
      } else {
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

    if (this.schoolId == "0") {
      this.alertService.error("Please select school");
      return;
    }

    // if(this.gradeId == "0"){
    //   this.alertService.error("Please select class");
    //   return;
    // }

    // if(this.mediumId == "0"){
    //   this.alertService.error("Please select medium");
    //   return;
    // }

    // if(this.subjectId == "0"){
    //   this.alertService.error("Please select subject");
    //   return;
    // }

    console.log(this.gradeId, this.subjectId)

    let schoolId = this.schoolId;
    // if(this.schoolId == "0"){
    //   schoolId = 0;
    // }else{
    //   schoolId = this.schoolId._id;
    // }

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

    let subjectId = 0;
    if (this.subjectId == "0") {
      subjectId = 0;
    } else {
      subjectId = this.subjectId._id;
    }

    this.loading = true;
    this.userService.getTeacherUsers(gradeId, mediumId, subjectId, schoolId).subscribe(response => {

      console.log(response);
      if (response.responseCode == 200) {
        this.datalist = response.result;
        this.loading = false;
        if (this.dtElement && this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.dtTrigger.next();
            // Call the dtTrigger to rerender again
          });

        } else {
          this.dtTrigger.next();
        }
        this.gradeData = this.gradeId;
        this.mediumData = this.mediumId;
        this.subjectData = this.subjectId;
        this.schoolData = this.schoolId;
      } else {
        this.alertService.error(response.responseMessage);
        this.loading = false;
      }
    },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  asssignSubject(iUserId, iIndex,assignsubject) {


    // for(let j = 0 ; j < this.datalist[iIndex].moduleArray.length ; j++){

    //   for(let i = 0 ; i < this.subjectList.length ; i++){
    //     if(this.subjectList[i]._id == this.datalist[iIndex].moduleArray[j]._id){
    //       this.subjectList[i].selected = true;
    //       break;
    //     }
    //   }

    // }
    

    this.showBModel(assignsubject);

  }




  showBModel(content) {


    this.modalService.open(content, { windowClass: "selectedQuestionModalClass", ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      let closeResult = `Closed with: ${result}`;
      console.log("closeResult -- ", closeResult);
    }, (reason) => {
      let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log("closeResult -- ", closeResult);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



}

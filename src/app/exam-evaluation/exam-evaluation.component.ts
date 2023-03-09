import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditExamEvaluationComponent } from '../edit-exam-evaluation/edit-exam-evaluation.component';

@Component({
  selector: 'app-exam-evaluation',
  templateUrl: './exam-evaluation.component.html',
  styleUrls: ['./exam-evaluation.component.scss'],
})
export class ExamEvaluationComponent implements OnInit {
  schoolList: any = [];
  gradeList: any = [];
  mediumsList: any = [];
  schoolId: any = 0;
  mediumId: any = 0;
  gradeId: any = 0;
  subjectList: any = [];
  subjectId: any = 0;
  fileToUpload: File | null = null;
  fileUrl: any;
  examTitle: any;
  questionCount: any;
  description: string = '';
  public displayedColumns = ['title', 'schoolName', 'name', 'gradeName', 'description', 'createdAt', 'fileName'];
  public dataSource: any = null;
  public base64QuestionPaper: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getGrade();
    this.getMediumsList();
    this.getSchoolList();
    this.getExamList();
  }

  getGrade() {
    this.userService.getGrade1().subscribe(response => {
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

  getSchoolList() {
    this.userService.getQBSchoolList().subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        this.schoolList = [...response.result.filter((element) => {
          if (element.schoolCode && element.schoolCode.length) {
            return element;
          }
        })]
      } else {
        this.alertService.error(response.responseMessage);
      }
    },
      error => {
        this.alertService.error(error);
      });
  }

  getMediumsList() {
    this.userService.getMediumsList1().subscribe(response => {
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

    this.userService.getSubjectList1(gradeId, mediumId).subscribe(response => {
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

  handleFileInput(e: any) {
    this.fileToUpload = e.files.item(0);
    this.toBase64(this.fileToUpload).then((res) => {
      this.base64QuestionPaper = res;
    })
  }

  uploadQuestionPaper(callback?: any) {
    const uploadData = new FormData();
    uploadData.append('file', this.fileToUpload);
    console.log(uploadData);
    this.userService.uploadQuestionPaper(uploadData)
      .subscribe((res: any) => {
        this.fileUrl = res.result.url;
        this.alertService.success('Data uploaded successfully');
        callback ? callback() : '';
      },
        (error) => this.alertService.error(error)

      );
  }


  saveExam() {
    // this.uploadQuestionPaper(() => {
    //   this.postExam();
    // })
    this.postExam();
  }

  public postExam() {
    let payLoad = {
      mediumId: this.mediumId._id,
      gradeId: this.gradeId._id,
      schoolId: this.schoolId._id,
      subjectId: this.subjectId._id,
      title: this.examTitle,
      quesCount: this.questionCount,
      // fileName: this.fileUrl,
      description: this.description,
      status: 'ACTIVE',
      questionPaper: this.base64QuestionPaper
    }
    this.userService.addExam(payLoad)
      .subscribe((res: any) => {
        this.fileUrl = res.result.url;
        this.alertService.success('Data Added');
        this.getExamList();
      },
        (error) => this.alertService.error(error)

      );
  }

  public getExamList() {
    this.userService.getExam()
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource<any>(res.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  openDialog(element) {
    let obj = {
      examObj: element,
      schoolList: this.schoolList
    }
    this.dialog.open(EditExamEvaluationComponent, {
      data: obj
    });
  }

  public toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

}


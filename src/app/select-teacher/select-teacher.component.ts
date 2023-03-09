import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-select-teacher',
  templateUrl: './select-teacher.component.html',
  styleUrls: ['./select-teacher.component.scss'],
})
export class SelectTeacherComponent implements OnInit {
  public teacherArray: any = [];
  public selectedTeacher: string = '';

  constructor(
    private dialogRef: MatDialogRef<SelectTeacherComponent>,
    private user: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: AlertService) { }

  ngOnInit() {
    console.log(this.data);
    this.getTeacherList();
  }

  public getTeacherList() {
    this.user.getTeacherListGradeMediumWise(this.data.examResponseObj.gradeId,this.data.examResponseObj.mediumId).subscribe((res: any) => {
      res.result.forEach(element => {
        let obj = {
          name: element['firstName'] + ' ' + element['lastName'],
          id: element['_id']
        };
        this.teacherArray.push(obj);
      });
      console.log('Teacher --', res);
    })
  }

  public selectTeacher() {
    let payload = [];
    let data = this.data.examResponseObj;

    if(data.scholarshipId){
      for (let key in data.testPaperResponseIds) {
        let obj = {
          gradeId: data.gradeId,
          subjectId: data.testPaperResponseIds[key].paperId.subjectId._id,
          scholarshipId: data.scholarshipId,
          testSeriesResponseId: key,
          studentId : data.testPaperResponseIds[key].student_id._id,
          teacherId: this.selectedTeacher
        };
        payload.push(obj);
  
      }
      
      console.log(payload);
      //return;
      this.user.postAssignTeacherscholarship(payload)
        .subscribe((res: any) => {
          if (res.responseCode == 200) {
            this.alert.success(res.responseMessage);
            this.dialogRef.close();
            // this.getAssignInvigilatorList(payload);
          }
        })
    }else{
      for (let key in data.testPaperResponseIds) {
        let obj = {
          gradeId: data.gradeId,
          subjectId: data.testPaperResponseIds[key].paperId.subjectId._id,
          testSeriesId: data.testSeriesId,
          testSeriesResponseId: key,
          studentId : data.testPaperResponseIds[key].student_id._id,
          teacherId: this.selectedTeacher
        };
        payload.push(obj);
  
      }
      
      console.log(payload);
      //return;
      this.user.postAssignTeacher(payload)
        .subscribe((res: any) => {
          if (res.responseCode == 200) {
            this.alert.success(res.responseMessage);
            this.dialogRef.close();
            // this.getAssignInvigilatorList(payload);
          }
        })
    }
   
  }

  public getAssignInvigilatorList(payload) {
    payload.forEach(element => {
      this.user.getAssignInvigilators(element.schoolId, element.teacherId)
        .subscribe((res) => {
          // console.log('hi rs', res);
        })
    });
  }

}

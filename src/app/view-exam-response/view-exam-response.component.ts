import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { SelectTeacherComponent } from '../select-teacher/select-teacher.component';

@Component({
  selector: 'app-view-exam-response',
  templateUrl: './view-exam-response.component.html',
  styleUrls: ['./view-exam-response.component.scss'],
})
export class ViewExamResponseComponent implements OnInit {
  public displayedColumns = ['select', 'title', 'schoolName', 'name', 'gradeName', 'description', 'createdAt', 'studentId', 'subject', 'obtainedTotalMarks', 'passingStatus', 'fileName'];
  public dataSource: any = null;
  public examId: string = '';
  public responseList = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private user: UserService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
    this.activatedRoute.params.subscribe((res) => {
      this.examId = res.id;
      this.getExamResponse();
    });
  }

  ngOnInit() {


  }

  getExamResponse() {
    this.user.getExamResponse(this.examId)
      .subscribe((res: any) => {
        this.responseList = res.result;
        this.responseList.map((element) => {
          element['selected'] = false;
        })
        this.dataSource = new MatTableDataSource<any>(this.responseList.filter(element => {
          if (element.examId._id == this.examId)
            return element;
        }));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  public updateAll(e) {
    if (e) {
      this.responseList.forEach((element) =>
        element['selected'] = true
      );
    }
    else {
      this.responseList.forEach((element) =>
        element['selected'] = false
      )
    }
  }

  openDialog() {
    let obj = {
      examResponseObj: this.responseList,
    }
    this.dialog.open(SelectTeacherComponent, {
      data: obj
    });
  }

}

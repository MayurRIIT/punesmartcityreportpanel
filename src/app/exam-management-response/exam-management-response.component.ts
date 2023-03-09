import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-exam-management-response',
  templateUrl: './exam-management-response.component.html',
  styleUrls: ['./exam-management-response.component.scss'],
})
export class ExamManagementResponseComponent implements OnInit {
  public examId: string = '';
  public studentResponse: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private router: Router,
    private activateRoute: ActivatedRoute,
    private userService: UserService) {
    this.activateRoute.params.subscribe((res) => {
      this.examId = res['id'];
    })
  }

  ngOnInit() {
    this.getExamResponse();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

  public getExamResponse() {
    this.userService.getExamManagementResponse(this.examId)
      .subscribe((res) => {
        this.studentResponse = res.result;
      })
  }

}

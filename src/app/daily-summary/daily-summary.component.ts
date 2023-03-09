import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { element } from 'protractor';
import { AuthenticationService } from '../core/services/authentication.service';
import { DailySummaryService } from './daily-summary.service';
@Component({
  selector: 'app-daily-summary',
  templateUrl: './daily-summary.component.html',
  styleUrls: ['./daily-summary.component.scss'],
})
export class DailySummaryComponent implements OnInit {
  objectValues = Object.values;
  public startDate = moment().subtract(30, 'd').format('YYYY-MM-DD');
  public endDate = moment().format('YYYY-MM-DD');
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  public tileArray = [];
  public tileArrayWithDate = [];
  public summaryReportObj = [
    {
      'title': 'Registered Students',
      'url': 'getRegisteredStudents'
    },
    {
      'title': 'Registered Teachers',
      'url': 'getRegisteredTeachers'
    },
    {
      'title': 'Registered Schools',
      'url': 'getRegisteredSchools'
    },
    {
      'title': 'Registered Districts',
      'url': 'getRegisteredDistricts'
    },
    {
      'title': 'Registered English Medium Students',
      'url': 'getEnglishMediumStudents'
    },
    {
      'title': 'Registered Marathi Medium Students',
      'url': 'getMarathiMediumStudents'
    },

    {
      'title': 'Never Logged In Once',
      'url': 'getNeverLoggedInOnce'
    },
    {
      'title': 'Logged In Once',
      'url': 'getLoggedInOnce'
    },
    {
      'title': 'Exam Attended Students',
      'url': 'getExamAttendedStudents'
    },
    {
      'title': 'Animation Content',
      'url': 'getAnimationContent'
    },
    {
      'title': 'Audio Content',
      'url': 'getAudioContent'
    }
  ];
  public summaryReportObjWithDate = [{
    'title': 'Login Sessions',
    'url': 'getLoginSessions',
    'date': false,
    'key': null
  },
  {
    'title': 'Login Best Day',
    'url': 'getLoginBestDay',
    'date': true,
    'key': 'date'
  },
  {
    'title': 'Login Worst Day',
    'url': 'getLoginWorstDay',
    'date': true,
    'key': 'date'
  },
  // {
  //   'title': 'Best Student',
  //   'url': 'getBestStudent',
  //   'date': true,
  //   'key': '[0]'
  // },
  {
    'title': 'Peak Login',
    'url': 'getPeakLogin',
    'date': true,
    'key': 'logins'
  },
  {
    'title': 'Logged In Once Student',
    'url': 'getLoggedInOnceStudent',
    'date': false,
    'key': null
  }];
  public loader = false;
  constructor(
    private dailySummarryService: DailySummaryService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.getSummaryReport();
    this.getSummaryReportWithDateRange();
    this.getBestStudent();
  }

  dateRangeChange() {
    this.startDate = moment(this.range.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.range.value.end).format('YYYY-MM-DD');
    if (this.endDate != 'Invalid date') {
      this.tileArrayWithDate = [];
      this.getSummaryReportWithDateRange();
      this.getBestStudent();
    }

  }

  getSummaryReport() {
    this.summaryReportObj.forEach((element) => {
      this.dailySummarryService.getSummaryReport(element.url)
        .subscribe((res) => {
          if (res.responseCode == 200) {
            let obj = {
              name: element.title,
              value: res.result
            }
            this.tileArray.push(obj);
          }
        });
    });
  }

  getSummaryReportWithDateRange() {
    this.loader = true;
    this.summaryReportObjWithDate.forEach((element) => {
      this.dailySummarryService.getSummaryReportWithDateRange(element.url, this.startDate, this.endDate)
        .subscribe((res) => {
          this.loader = false;
          if (res.responseCode == 200) {
            let obj = {
              name: element.title,
              value: res.result,
              special: element.date,
              key: element.key
            }
            this.tileArrayWithDate.push(obj);
          }
        });
    });
  }

  getBestStudent() {
    this.dailySummarryService.getBestStudent('getBestStudent', this.startDate, this.endDate)
      .subscribe((res) => {
        if (res.responseCode == 200) {
          let obj = {
            name: 'Best Student',
            value: res.result[0]['firstName'] + ' ' + res.result[0]['lastName'],
            special: false,
            key: null
          }
          this.tileArrayWithDate.push(obj);
        }
      });
  }

  logout() {
    localStorage.clear();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}

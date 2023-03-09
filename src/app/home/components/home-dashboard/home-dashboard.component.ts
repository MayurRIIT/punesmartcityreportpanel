import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HomeService } from '../services/home.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Chart } from 'angular-highcharts';
@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss'],
})
export class HomeDashboardComponent implements OnInit {
  public gradeArray = [];
  public mediumArray = [];
  public schoolArray = [];
  public roleArray = ['TEACHER', 'STUDENT'];
  public startDate = moment().subtract(30, 'd').format('YYYY-MM-DD');
  public endDate = moment().format('YYYY-MM-DD');
  public payload = {
    mediumId: [],
    gradeId: [],
    role: [],
    schoolId: [],
    gender: []
  }
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  public dataSource: any = null;
  public displayedColumns: string[] = [
    'fullName',
    'medium',
    'gender',
    'schoolName',
    'userType',
    'grade',
    'learningCompletionPercentage',
    'audioProgress',
    'ebookProgress',
    'notesProgress',
    'testsProgress',
    'videoProgress'
  ];
  public onboardingChart;
  public mediumChart;
  public roleChart;
  public genderChart;
  public pieOption = {
    innerSize: '30%',
    allowPointSelect: true,
    cursor: 'pointer',
    colors: ['#264796', '#1e88e5'],
    dataLabels: {
      enabled: false
    },

    showInLegend: true
  };
  public orignalFlag = true;
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = 100;
  public loader: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getGrade();
    this.getMedium();
    this.getSchools();
    this.generateDashboardReport();
    this.generateCharts();
  }

  dateRangeChange() {
    this.startDate = moment(this.range.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.range.value.end).format('YYYY-MM-DD');
    this.generateDashboardReport();
    this.generateCharts();
  }

  public getGrade() {
    this.homeService.getGrade().subscribe((res: any) => {
      this.gradeArray.push(...res.result);
    })
  }

  public getMedium() {
    this.homeService.getMedium().subscribe((res: any) => {
      this.mediumArray.push(...res.result);
    })
  }

  public getSchools() {
    this.homeService.getSchools().subscribe((res: any) => {
      this.schoolArray.push(...res.result.filter((element) => {
        if (element.schoolCode && element.schoolCode.length) {
          return element;
        }
      }));
    })
  }

  public generateDashboardReport() {
    this.loader = true;
    this.homeService.generateDashboardReport(this.startDate, this.endDate, this.payload, this.pageIndex, this.pageSize)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          res.result.map(element => {
            element['fullName'] = element.userObject['firstName'] + ' ' + element.userObject['lastName'];
            element['gender'] = element.userObject['gender'];
          })
          this.dataSource = new MatTableDataSource<any>(res.result);
          this.dataSource.sort = this.sort;
        }
      });
  }

  public generateCharts() {
    this.homeService.generateCharts(this.startDate, this.endDate, this.payload)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.dataLength = res.result.length;
          this.createMediumChart(res.result);
          this.createRoleChart(res.result);
          this.createGenderChart(res.result);
          this.createOnboardingChart(res.result);
        }
      });
  }

  public selectChange(type, e) {
    this.payload[type] = [...e];
    this.generateDashboardReport();
    this.generateCharts();
  }

  public createMediumChart(result) {
    let mediumReport = {};
    this.mediumArray.forEach(element => {
      mediumReport[element.name] = {
        name: element.name,
        y: 0,
        value: element._id
      }
    });
    result.forEach(element => {
      if (mediumReport[element.userObject.mediumId?.name])
        mediumReport[element.userObject.mediumId?.name].y += 1;
    });
    this.mediumChart = new Chart({
      title: {
        text: 'Medium'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: { ...this.pieOption },
        series: {
          point: {
            events: {
              click: function (e) {
                this.selectChange('mediumId', [e.point.options.value])
              }.bind(this)
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Medium',
          data: Object.values(mediumReport)
        }
      ]
    },
    );
  }

  public createRoleChart(result) {
    let roleReport = {
      'TEACHER': {
        name: 'TEACHER',
        y: 0,
      },
      'STUDENT': {
        name: 'STUDENT',
        y: 0,
      }
    };
    result.forEach(element => {
      if (roleReport[element.userObject.userType])
        roleReport[element.userObject.userType].y += 1;

    });
    this.roleChart = new Chart({
      title: {
        text: 'Role'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: { ...this.pieOption },
        series: {
          point: {
            events: {
              click: function (e) {
                this.selectChange('role', [e.point.options.name])
              }.bind(this)
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Type',
          data: Object.values(roleReport)
        }
      ]
    },
    );
  }

  public createGenderChart(result) {
    let genderReport = {
      'Male': {
        name: 'Male',
        y: 0
      },
      'Female': {
        name: 'Female',
        y: 0
      }
    };
    result.forEach(element => {
      if (genderReport[element.userObject.gender])
        genderReport[element.userObject.gender].y += 1;

    });
    this.genderChart = new Chart({
      title: {
        text: 'Gender'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: { ...this.pieOption },
        series: {
          point: {
            events: {
              click: function (e) {
                this.selectChange('gender', [e.point.options.name])
              }.bind(this)
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Gender',
          data: Object.values(genderReport)
        }
      ]
    },
    );
  }

  public createOnboardingChart(result) {
    let dateData = [];
    let dateObj = {};
    let activeObj = {};
    // dateArray
    result.forEach(element => {
      let date = moment(element.userObject.createdAt).format("DD-MM-YY");
      dateData.push(date);
    });
    // date blank object
    dateData.forEach(element => {
      let obj = {
        name: element,
        y: 0
      }
      dateObj[element] = (obj);
      activeObj[element] = (obj);
    })
    // assigning counts in date obj * active obj
    result.forEach(element => {
      let date = moment(element.userObject.createdAt).format("DD-MM-YY");
      dateObj[date].y += 1;
      if (element.status == 'ACTIVE') {
        activeObj[date].y += 1;
      }
    });
    this.onboardingChart = new Chart({
      title: {
        text: 'Onboarding trend'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'category',
      },
      series: [
        {
          type: 'column',
          name: 'New Onboard',
          data: Object.values(dateObj),
          dataLabels: {
            enabled: true
          }
        },
        {
          type: 'line',
          name: 'Active',
          data: Object.values(activeObj),
          dataLabels: {
            enabled: true
          }
        }
      ]
    },
    );
  }

  public getNext(e) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.generateDashboardReport();
  }

  public reset() {
    this.payload = {
      mediumId: [],
      gradeId: [],
      role: [],
      schoolId: [],
      gender: []
    };
    this.startDate = moment().subtract(30, 'd').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    this.range.controls['start'].setValue(null);
    this.range.controls['end'].setValue(null);
    this.generateDashboardReport();
    this.generateCharts();
  }

}

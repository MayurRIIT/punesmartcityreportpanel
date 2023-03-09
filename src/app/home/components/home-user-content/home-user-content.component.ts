import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart } from 'angular-highcharts';
import * as moment from 'moment';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home-user-content',
  templateUrl: './home-user-content.component.html',
  styleUrls: ['./home-user-content.component.scss'],
})
export class HomeUserContentComponent implements OnInit {
  public gradeArray = [];
  public mediumArray = [];
  public schoolArray = [];
  public roleArray = ['TEACHER', 'STUDENT'];
  public startDate = moment().subtract(7, 'd').format('YYYY-MM-DD');
  public endDate = moment().format('YYYY-MM-DD');
  public payload = {
    mediumId: [],
    classId: [],
    role: [],
    schoolId: [],
    gender: []
  }
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  public avgChart;
  public avgStandardChart;
  public avgGenderChart;
  public avgComponentChart;
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = 100;
  public dataSource: any = null;
  public loader: boolean = false;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getGrade();
    this.getMedium();
    this.getSchools();
    this.generateCharts();

  }

  public generateCharts() {
    this.loader = true;
    this.homeService.generateUserContentChart(this.startDate, this.endDate, this.payload)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.loader = false;
          this.dataLength = res.result.length;
          this.generateAvgChart(res.result);
          this.generateAvgStandardChart(res.result);
          this.generateAvgGenderChart(res.result);
          this.generateAvgComponentChart(res.result);
        }
      });
  }

  public reset() {
    this.payload = {
      mediumId: [],
      classId: [],
      role: [],
      schoolId: [],
      gender: []
    };
    this.startDate = moment().subtract(7, 'd').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    this.range.controls['start'].setValue(null);
    this.range.controls['end'].setValue(null);
    // this.generateDashboardReport();
    this.generateCharts();
  }

  dateRangeChange() {
    this.startDate = moment(this.range.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.range.value.end).format('YYYY-MM-DD');
    // this.generateDashboardReport();
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

  public selectChange(type, e) {
    this.payload[type] = [...e];
    // this.generateDashboardReport();
    this.generateCharts();
  }

  public generateAvgChart(res) {
    let mediumObj = {}
    this.mediumArray.forEach(element => {
      mediumObj[element.name] = {
        name: element.name,
        type: 'column',
        y: 0,
        data: []
      }
    });
    res.forEach(element => {
      for (let i = 0; i < element.mediumWiseLearning.length; i++) {
        mediumObj[element.mediumWiseLearning[i].mediumData.name].data.push(element.mediumWiseLearning[i].mediumLearning);
      }
    });
    // console.log('hi', mediumObj);
    this.avgChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'AVG - Learning per Medium'
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor:
          'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: Object.values(mediumObj)
    })
  }

  public generateAvgStandardChart(res) {
    let standard = [];
    res.forEach(element => {
      standard.push(element.standardWiseLearning);
    });
    this.avgStandardChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: 'AVG - Learning Per Standard'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Learning Completion',
        type: 'bar',
        data: standard
      }]
    });
  }

  public generateAvgGenderChart(res) {
    let male = []
    let female = []
    res.forEach(element => {
      male.push(element.genderWiseLearning.Male);
      female.push(element.genderWiseLearning.Female);
    });
    this.avgGenderChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'AVG - Learning per Gender'
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor:
          'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Male',
        type: 'column',
        data: male
      }, {
        name: 'Female',
        type: 'column',
        data: female
      }]
    })
  }

  public generateAvgComponentChart(res) {
    let audioCompletion = [];
    let ebookCompletion = [];
    let learningCompletion = [];
    let notesCompletion = [];
    res.forEach(element => {
      audioCompletion.push(element.componentWiseLearning.audioCompletion);
      ebookCompletion.push(element.componentWiseLearning.ebookCompletion);
      learningCompletion.push(element.componentWiseLearning.learningCompletion);
      notesCompletion.push(element.componentWiseLearning.notesCompletion);
    });
    this.avgComponentChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'AVG - Completion of all components'
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Audio Completion',
        type: 'column',
        data: audioCompletion

      }, {
        name: 'E Book Completion',
        type: 'column',
        data: ebookCompletion

      }, {
        name: 'Learning Completion',
        type: 'column',
        data: learningCompletion

      }, {
        name: 'Notes Completion',
        type: 'column',
        data: notesCompletion

      }]
    })
  }

  // public generateUserContentReport() {
  //   this.homeService.generateUserContentReport(this.startDate, this.endDate, this.payload, this.pageIndex, this.pageSize)
  //     .subscribe((res: any) => {
  //       if (res.responseCode == 200) {
  //         this.dataSource = new MatTableDataSource<any>(res.result);
  //         this.dataSource.sort = this.sort;
  //       }
  //     });
  // }



}

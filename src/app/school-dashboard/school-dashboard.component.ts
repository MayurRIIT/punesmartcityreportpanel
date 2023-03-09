import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from './services/admin.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Chart } from 'angular-highcharts';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'

@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.scss'],
})
export class SchoolDashboardComponent implements OnInit {

  public gradeArray = [];
  public mediumArray = [];
  public stateArray = [];
  public districtArray = [];
  public genderArray = ['Male','Female'];
  public schoolArray = [];
  public roleArray = ['TEACHER', 'STUDENT'];
  public startDate = undefined;//moment().subtract(30, 'd').format('YYYY-MM-DD');
  public endDate = undefined;//moment().format('YYYY-MM-DD');

  public divisionArray = [];
  public subjectArray = [];
  public chapterArray = [];


  public payload = {
    mediumId: [],
    gradeId: [],
    role: [],
    schoolId: [],
    gender: ["Male", "Female"],
    stateId : [],
    districtId : [],
    perGradeId: [],
    divisionId : [],
    divisionmediumId: [],
    subjectId : [],
    chapterId : [],
    sponsorId : [],
    userId : []
  }

  public showSchoolFilter : boolean = false;
  public showGMap : boolean = true;
  gradewiseStudentCountLoader : boolean = false;

  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  public dataSource: any = null;

  public displayedColumns: string[] = [
    'fullName',
    'grade',
    'medium',
    'mobile',
    'gender',
    'schoolName',
    'userType',
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
  public avgComponentChart;
  public avgStandardChart;
  public avgDivisionChart;
  public avgSubjectChart;
  public barSubjectChart;

  public avgChapterChart;
  public barChapterChart;
  public chapterdataLength = 0;
  public chapterDataSource: any = null;
  public displayedChapterColumns: string[] = [
    'name',
    'learningCompletionPercentage',
    'audioProgress',
    'ebookProgress',
    'notesProgress',
    'testsProgress',
    'videoProgress'
  ];

  public pieChartArr = [];
  public pieDivisionChartArr = [];
  public pieSubjectChartArr = [];
  
  public pieOption = {
    innerSize: '30%',
    allowPointSelect: true,
    cursor: 'pointer',
    colors: ['#8bc34a', '#ff9800','#ff0000'],
    dataLabels: {
      enabled: true,
      format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
      
    },

    showInLegend: true
  };
  public orignalFlag = true;
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = 100;
  public userListLength = -1;
  public loader: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  //markerInfo : string = null;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap

  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    zoom : 6.7,
    center:  {
      lat: 19.7515,
      lng: 75.7139,
    },
    disableDoubleClickZoom: false,
    // maxZoom: 15,
    // minZoom: 8,
  }

  constructor(private adminService: AdminService) { }

  // zoomIn() {
  //   if (this.zoom < this.options.maxZoom) this.zoom++
  // }

  // zoomOut() {
  //   if (this.zoom > this.options.minZoom) this.zoom--
  // }

  infoContent = '';
  markers : any = [];

  // zoom: number = 8;
  
  // // initial center position for the map
  // lat: number = 19.7515;
  // lng: number = 75.7139;

  // clickedMarker(label: string, index: number) {
  //   console.log(`clicked the marker: ${label || index}`)
  // }
  
  
  // markers: marker[] = [
	//   {
	// 	  lat: 19.093412,
	// 	  lng: 74.746855,
	// 	  label: 'Ahmadnagar',
	// 	  draggable: false
	//   },
	//   {
	// 	  lat: 20.710576,
	// 	  lng: 77.00373,
	// 	  label: 'Akola',
	// 	  draggable: false
	//   },
	//   {
	// 	  lat: 20.937346,
	// 	  lng: 77.760249,
	// 	  label: 'Amravati',
	// 	  draggable: false
	//   }
  // ]

  ngOnDestroy(){
    console.log("ngOnDestroy------>")
    this.showGMap = false;
  }

  ngOnInit() {

    if(localStorage.getItem("userType") == "ADMIN") {
      this.getSchools();
      this.showSchoolFilter = true;
    }else if(localStorage.getItem("userType") == "SPONSOR") {
      this.showSchoolFilter = false;
      this.payload['sponsorId'] = [localStorage.getItem("sponsorId")];
    }else if(localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER") {
      this.showSchoolFilter = false;
      this.payload['schoolId'] = [localStorage.getItem("schoolId")];
    }else if(localStorage.getItem("userType") == 'DISTRICTADMIN'){
      this.payload['districtId'].push(localStorage.getItem("districtId"));
      this.showSchoolFilter = true;
      this.getSchools();
    }


    this.getGrade();
    this.getState();
   // this.generateDashboardReport();
   // this.generateCharts();
  }

  dateRangeChange() {
    this.startDate = moment(this.range.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.range.value.end).format('YYYY-MM-DD');
    this.getGradewiseSchoolReport();
  }

  public getState() {
    this.adminService.getState().subscribe((res: any) => {
      this.stateArray.push(...res.result);
      console.log(this.stateArray);
      if(this.stateArray.length == 1){
        this.payload['stateId'] = [this.stateArray[0]._id];
      //  this.getDistrictWiseMaleFemaleCount();
        // this.generateCharts();
      }
     
    })
  }


  // public getDistrict() {
  //   this.adminService.getDistrict().subscribe((res: any) => {
  //     this.districtArray.push(...res.result);
  //   })
  // }

  public getGrade() {
    this.adminService.getGrade().subscribe((res: any) => {
      this.gradeArray.push(...res.result);
      this.gradeArray.map(element => {
         // if(element.gradeName == '10')
          this.payload['gradeId'].push(element._id);
      });

      this.getMedium();
    })
  }

  public getMedium() {
    this.adminService.getMedium().subscribe((res: any) => {
      res.result.map(element => {
        if(element.name != 'English'){
          this.payload['mediumId'].push(element._id);
          this.mediumArray.push(element);  
        }
      });
      
      this.getGradewiseSchoolReport();
      this.getSchoolDashboardProgressReport();

    })
  }

  public getSchools() {
    this.adminService.getSchools(this.payload).subscribe((res: any) => {
      this.schoolArray = res.result.filter((element) => {
        if (element.schoolCode && element.schoolCode.length) {
          return element;
        }
      })
    })
  }

  openMarkerInfo(marker: MapMarker,content){
   // console.log(marker,content)
    this.infoContent = content;
    this.info.open(marker);
  }

  public getDistrictWiseMaleFemaleCount() {
    this.loader = true;
    let obj2 = Object.assign({}, this.payload);
    obj2.schoolId = [];
    this.adminService.getDistrictWiseMaleFemaleCount(obj2)
      .subscribe((res: any) => {
        this.loader = false;
        console.log("getDistrictWiseMaleFemaleCount---->");

        if (res.responseCode == 200) {
          console.log(res);
          let markers = [];
          res.result.map(element => {
            if(element.total > 0){
              markers.push({
                position: {
                  lat: element.latitude,
                  lng: element.longitude,
                },
                label: {
                  color: 'white',
                  text: `${element.districtName} (${element.total})`,// - ${element.total}( Male - ${element.Male}, Female - ${element.Female})
                },
                info : `${element.districtName} - ${element.total}( Male - ${element.Male}, Female - ${element.Female})`,
                clickable : true,
                title: `${element.districtName} - ${element.total}( Male - ${element.Male}, Female - ${element.Female})`,
                //options: { animation: google.maps.Animation.DROP, icon : "assets/images/map-marker.svg" },
                options: { animation: google.maps.Animation.DROP },
              });
            }
            
          })
          console.log(markers);
          this.markers = markers;
          

        }
      });
  }

  public getSchoolDashboardProgressReport() {
    this.loader = true;
    this.adminService.getSchoolDashboardProgressReport(this.startDate, this.endDate, this.payload, this.pageIndex, this.pageSize)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          console.log(res);
          this.dataLength = res.totalCount;
          res.result.map(element => {
            let percentage = 0
            if(element.studentProgressData != null){
              percentage = element.studentProgressData.overallCompletionPercentage;
            }

            if(percentage >= 0 && percentage < 20){
              element['bgcolor'] = 'red-bg';
            }else if(percentage >= 20 && percentage < 60){
              element['bgcolor'] = 'orange-bg';
            }else{
              element['bgcolor'] = 'green-bg';
            }
          })
          this.dataSource = new MatTableDataSource<any>(res.result);
          this.dataSource.sort = this.sort;
        }
      });
  }


  public getNext(e) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getSchoolDashboardProgressReport();
  }

  public getGradewiseSchoolReport() {
    this.loader = true;
    this.adminService.getgradewiseschoolreport(this.startDate, this.endDate,this.payload)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
            console.log(res);
            this.userListLength = res.result.totalUser;
            this.generateAvgStandardChart(res.result.gradeList,res.result.totalUser);
            this.pieChartArr = [];
            this.pieDivisionChartArr = [];
            this.pieSubjectChartArr = [];
            this.generateNotActiveUserChart(res.result.totalUser,res.result.actualUser,this.pieChartArr);
            this.generateGenderDynamicChart("GRADE",res.result.genderdata,this.payload.gradeId.length,this.pieChartArr);
            this.generateMediumDynamicChart("GRADE",res.result.mediumdata,this.payload.gradeId.length,this.pieChartArr);
        }
      });
  }



  public generateAvgStandardChart(res,totalUser) {
    let standard = [];

    let gradeArr = [];
    
    // this.gradeArray.map(element => {
    //   if(this.payload['gradeId'].indexOf(element._id) > -1){
    //     gradeArr.push(element.gradeName);
    //   };
    // });

    res.forEach(element => {
      standard.push(element.overAllPercentage);
      gradeArr.push(element.gradeName);
    });
    console.log(standard);
    this.avgStandardChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: '<b>AVG - Learning Per Standard</b>'
      },
      subtitle: {
        text: 'Users - '+totalUser
      },
      xAxis: {
        categories: gradeArr,
        title: {
          text: "Grade"
        }
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Learning Percentage(%)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
      },
      tooltip: {
          valueSuffix: ' %',
          formatter: function() {
            var ret = '';
            for(let  i = 0 ; i < res.length ; i++){
              if(res[i].gradeName == this.point.category){
                ret = this.series.name+" : "+res[i].overAllPercentage+"% (Users : "+(res[i].userLength ? res[i].userLength : 0)+")"
                break;
              }
            }
            return ret;
          }

      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        },
        series: {
          point: {
            events: {
              click: function (e) {
              // this.selectChange('gender', [e.point.options.name])
              console.log("grade click - "+e.point.category)
              this.onGradeClick(e.point.category);
              }.bind(this)
            }
          }
        }
      },
      legend: {
        enabled : false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Learning Completion',
        type: 'bar',
        data: standard,
        // color: 'steelblue',
        states: {
        	select: {
            	color: 'blue'
            }
        },
        allowPointSelect: true
      }]
    });
  }

  public generateNotActiveUserChart(totalUser,actualUser,iArr){

    console.log(totalUser,actualUser)
    let chartObj = {
      'Used': {
        name: 'Used Users',
        y: actualUser,
        userCount : actualUser
      },
      'Not Used': {
        name: 'Not Used Users',
        y: (totalUser-actualUser),
        userCount : (totalUser-actualUser),
      }
    }

    let pieOption = Object.assign({}, this.pieOption);
    pieOption.colors = ['#8bc34a','#ff0000']
    
    let genderChart = new Chart({
        title: {
          text: `<b>App Learning Status</b>`
        },
        subtitle: {
          text: `Used Users- ${actualUser}, Not Used Users- ${(totalUser-actualUser)}`
        },      
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}% ({point.userCount} Users)</b>',
        },
        
        plotOptions: {
          pie: pieOption,
          series: {
            point: {
              events: {
                click: function (e) {
                console.log("Gender change")
                }.bind(this)
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            name: 'Gender',
            data: Object.values(chartObj)
          }
        ]
    });
    iArr.push(genderChart); 
  }
  public generateGenderDynamicChart(type,result,iLength,iArr){
      //console.log(result);
      let chartObj = {
        
      };
      let userCount = 0;
      Object.keys(result).forEach(element => {
        for(let key in result[element]){
          if(key != "total"){
            if(!chartObj[key]){
              chartObj[key] = {
                'Green': {
                  name: 'Greater than 60',
                  y: 0
                },
                'Orange': {
                  name: 'Between 20 to 60',
                  y: 0
                },
                'Red': {
                  name: 'Less than 20',
                  y: 0
                },
                'Total' : 0,
              }
              if(type != "SUBJECT") chartObj[key]['totalUserCount'] = 0;
            }

            chartObj[key]['Red'].y += Number((result[element][key]['Red']/result[element]['total'])*100);
            chartObj[key]['Orange'].y += Number((result[element][key]['Orange']/result[element]['total'])*100);
            chartObj[key]['Green'].y += Number((result[element][key]['Green']/result[element]['total'])*100);
            type == "SUBJECT" ?  chartObj[key]['Total'] = result[element][key]['actualUser'] :  chartObj[key]['Total'] += result[element][key]['actualUser'];
            if(type != "SUBJECT") chartObj[key]['totalUserCount'] += result[element][key]['Total'];
          }
        }
      });

      console.log(chartObj);
      Object.keys(chartObj).forEach(element => {
        //console.log(chartObj[element]);

        let subtitleString = "";
        for(let key in chartObj[element]){
          if(key == 'Total'){
            subtitleString += `<br>Users - ${chartObj[element][key]}`;
            delete chartObj[element][key];
          }else if(key == 'totalUserCount' && type != "SUBJECT"){
            subtitleString += `, Total users- ${chartObj[element][key]}`;
            delete chartObj[element][key];
          }else{
            if(chartObj[element][key]) chartObj[element][key].y = Number((chartObj[element][key].y/iLength).toFixed(2));
            subtitleString += `${key} - ${ chartObj[element][key].y }% ,`;             
          }
        }
        

        let genderChart = new Chart({
            title: {
              text: `<b>Learning Percentage - ${element}</b>`
            },
            subtitle: {
              text: subtitleString
            },      
            credits: {
              enabled: false
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: this.pieOption,
              series: {
                point: {
                  events: {
                    click: function (e) {
                    // this.selectChange('gender', [e.point.options.name])
                    console.log("Gender change")
                    }.bind(this)
                  }
                }
              }
            },
            series: [
              {
                type: 'pie',
                name: 'Gender',
                data: Object.values(chartObj[element])
              }
            ]
        });
        iArr.push(genderChart); 
      });    
  }

  public generateMediumDynamicChart(type,result,iLength,iArr){
      console.log(result);
      let chartObj = {
        
      };

      let mediumPrereqArr = {};
      let userCount = 0;
      this.mediumArray.map(medium => {
        mediumPrereqArr[medium._id] = medium.name;
      });

      Object.keys(result).forEach(element => {
        for(let key in result[element]){
          if(key != "total"){
            let name = mediumPrereqArr[key];

            if(!chartObj[name]){
              chartObj[name] = {
                'Green': {
                  name: 'Greater than 60',
                  y: 0
                },
                'Orange': {
                  name: 'Between 20 to 60',
                  y: 0
                },
                'Red': {
                  name: 'Less than 20',
                  y: 0
                },
                'Total' : 0,
              }
              if(type != "SUBJECT") chartObj[name]['totalUserCount'] = 0;
            }

            chartObj[name]['Red'].y += Number((result[element][key]['Red']/result[element]['total'])*100);
            chartObj[name]['Orange'].y += Number((result[element][key]['Orange']/result[element]['total'])*100);
            chartObj[name]['Green'].y += Number((result[element][key]['Green']/result[element]['total'])*100);
            //chartObj[name]['Total'] += result[element][key]['Total'];
            type == "SUBJECT" ?  chartObj[name]['Total'] = result[element][key]['actualUser'] : chartObj[name]['Total'] += result[element][key]['actualUser'];
            if(type != "SUBJECT") chartObj[name]['totalUserCount'] += result[element][key]['Total'];

          }
        }

      });

      Object.keys(chartObj).forEach(element => {
        //console.log(chartObj[element]);

        let subtitleString = "";
        for(let key in chartObj[element]){
          if(key == 'Total'){
            subtitleString += `<br>Users - ${chartObj[element][key]}`;
            delete chartObj[element][key];
          }else if(key == 'totalUserCount' && type != "SUBJECT"){
            subtitleString += `, Total users- ${chartObj[element][key]}`;
            delete chartObj[element][key];
          }else{
            if(chartObj[element][key]) chartObj[element][key].y = Number((chartObj[element][key].y/iLength).toFixed(2));
            subtitleString += `${key} - ${ chartObj[element][key].y }% ,`;              
          }
        }

        let genderChart = new Chart({
            title: {
              text: `<b>Learning Percentage - ${element}</b>`
            },
            subtitle: {
              text: subtitleString
            },      
            credits: {
              enabled: false
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: this.pieOption,
              series: {
                point: {
                  events: {
                    click: function (e) {
                    // this.selectChange('gender', [e.point.options.name])
                    console.log("Medium change")
                    }.bind(this)
                  }
                }
              }
            },
            series: [
              {
                type: 'pie',
                name: 'Gender',
                data: Object.values(chartObj[element])
              }
            ]
        });

        iArr.push(genderChart); 

        
      });    
  }


  onGradeClick(gradeNumber){

    let gradeId = 0;
    for(let i = 0 ; i < this.gradeArray.length; i++){
      if(gradeNumber == this.gradeArray[i].gradeName){
        gradeId = this.gradeArray[i]._id;
        break;
      }
    }
    if(gradeId != 0){

      if(localStorage.getItem("userType") == "DISTRICTADMIN" || localStorage.getItem("userType") == "SPONSOR" || localStorage.getItem("userType") == "ADMIN" || localStorage.getItem("userType") == "SUPERADMIN") {
        this.payload['perGradeId'] = [gradeId];
        this.payload['divisionmediumId'] = [];
        this.payload['userId'] = [];
        this.getSchoolDashboardProgressReport();
      }else{
        this.payload['perGradeId'] = [gradeId];
        //this.pieChartArr = [];
        //this.getGradewiseSchoolReport();
  
        this.payload['userId'] = [];
        this.payload['divisionId'] = [];
        this.payload['divisionmediumId'] = [];
        this.payload['subjectId'] = [];
        this.payload['chapterId'] = [];
        this.pieSubjectChartArr = [];
        this.avgSubjectChart = null;
        this.barSubjectChart = null;
        this.avgChapterChart = null;
        this.barChapterChart = null;
        this.chapterArray = [];
        this.chapterdataLength = this.chapterArray.length;
        this.chapterDataSource = null
        this.pieSubjectChartArr = [];
        this.pieDivisionChartArr = [];
        this.getDivisionDataSpecificGradeSchoolDashboard();
        //this.getSubjectDataSpecificGradeSchoolDashboard();
        this.resetTableFetchingIndex();
        this.pageIndex = 1;
        this.getSchoolDashboardProgressReport();
      }
      
      
    }
  }

  resetTableFetchingIndex(){
    this.pageSize = 10;
    this.pageIndex = 1;;
  }
  
  getDivisionDataSpecificGradeSchoolDashboard(){
    this.loader = true;
    this.adminService.getDivisionDataSpecificGradeSchoolDashboard(this.startDate, this.endDate,this.payload)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
            console.log(res);
            this.divisionArray = res.result.divisionList;
            this.generateAvgDivisionChart(res.result.divisionList,res.result.totalUser);
            this.generateNotActiveUserChart(res.result.totalUser,res.result.actualUser,this.pieDivisionChartArr);
            this.generateGenderDynamicChart("DIVISION",res.result.genderdata,res.result.divisionList.length,this.pieDivisionChartArr);
            this.generateMediumDynamicChart("DIVISION",res.result.mediumdata,res.result.divisionList.length,this.pieDivisionChartArr);
        }
      });
  }
 
  public generateAvgDivisionChart(res,totalUser) {
    let division = [];

    let divisionArr = [];
    let mediumPrereqArr = {};

    this.mediumArray.map(medium => {
      mediumPrereqArr[medium._id] = medium.name;
    });

    let gradeArr = [];
    this.gradeArray.map(element => {
      if(this.payload['perGradeId'].indexOf(element._id) > -1){
        gradeArr.push(element.gradeName);
      };
    });

    res.forEach(element => {
      division.push(element.overAllPercentage);
      divisionArr.push(element.divisionName+"-"+mediumPrereqArr[element.mediumId]);
    });
  
    console.log(division);

    this.avgDivisionChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: '<b>AVG - Learning Per Division</b>'
      },
      subtitle: {
        text: 'Users - '+totalUser
      },
      xAxis: {
        categories: divisionArr,
        title: {
          text: "Grade "+gradeArr.join(", ")+" division"
        }
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Learning Percentage(%)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
      },
      tooltip: {
          valueSuffix: ' %',
          formatter: function() {
            var ret = '';
            for(let  i = 0 ; i < res.length ; i++){
              let divisionName = res[i].divisionName+"-"+mediumPrereqArr[res[i].mediumId]
              if(divisionName == this.point.category){
                ret = this.series.name+" : "+res[i].overAllPercentage+"% (Users : "+(res[i].userLength ? res[i].userLength : 0)+")"
                break;
              }
            }
            return ret;
          }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        },
        series: {
          point: {
            events: {
              click: function (e) {
              // this.selectChange('gender', [e.point.options.name])
              console.log("Division click - "+e.point.category)

              this.onDivisionClick(e.point.category);

              }.bind(this)
            }
          }
        }
      },
      legend: {
        enabled : false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Learning Completion',
        type: 'bar',
        data: division,
        // color: 'steelblue',
        states: {
        	select: {
            	color: 'blue'
            }
        },
        allowPointSelect: true
      }]
    });
  }

  getSubjectDataSpecificGradeSchoolDashboard(){
    this.loader = true;
    this.adminService.getSubjectDataSpecificGradeSchoolDashboard(this.startDate, this.endDate,this.payload)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
            console.log(res);
            this.subjectArray = res.result.subjectList;
            this.generateAvgSubjectChart(res.result.subjectList,res.result.totalUser);
            this.generatebarSubjectChart(res.result.subjectList,res.result.totalUser);
            this.generateGenderDynamicChart("SUBJECT",res.result.genderdata,res.result.subjectList.length,this.pieSubjectChartArr);
            this.generateMediumDynamicChart("SUBJECT",res.result.mediumdata,res.result.subjectList.length,this.pieSubjectChartArr);
        }
      });
  }
  
  public generateAvgSubjectChart(res,totalUser) {
    let subject = [];

    let subjectArr = [];
    let mediumPrereqArr = {};

    this.mediumArray.map(medium => {
      mediumPrereqArr[medium._id] = medium.name;
    });

    let divisionArr = [];
    this.divisionArray.map(element => {
      if(this.payload['divisionId'].indexOf(element._id) > -1){
        divisionArr.push(element.divisionName+"-"+mediumPrereqArr[element.mediumId]);
      };
    });

    res.forEach(element => {
      subject.push(element.overAllPercentage);
      subjectArr.push(element.name+"-"+mediumPrereqArr[element.mediumId]);
    });
  
    console.log(subject);

    this.avgSubjectChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: '<b>AVG - Learning Per Subject</b>'
      },
      subtitle: {
        text: 'Users - '+totalUser
      },
      xAxis: {
        categories: subjectArr,
        title: {
          text: "Division "+divisionArr.join(", ")+" subjects"
        }
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Learning Percentage(%)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
      },
      tooltip: {
          valueSuffix: ' %',
          formatter: function() {
            var ret = '';
            for(let  i = 0 ; i < res.length ; i++){
              let subjectName = res[i].name+"-"+mediumPrereqArr[res[i].mediumId]
              if(subjectName == this.point.category){
                ret = this.series.name+" : "+res[i].overAllPercentage+"% (Users : "+(res[i].userLength ? res[i].userLength : 0)+")"
                break;
              }
            }
            return ret;
          }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        },
        series: {
          point: {
            events: {
              click: function (e) {
              // this.selectChange('gender', [e.point.options.name])
              console.log("Subject click - "+e.point.category)

              this.onSubjectClick(e.point.category);

              }.bind(this)
            }
          }
        }
      },
      legend: {
        enabled : false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Learning Completion',
        type: 'bar',
        data: subject,
        // color: 'steelblue',
        states: {
        	select: {
            	color: 'blue'
            }
        },
        allowPointSelect: true
      }]
    });
  }

  public generatebarSubjectChart(res,totalUser) {

    let subject = [];

    let subjectArr = [];
    let mediumPrereqArr = {};

    this.mediumArray.map(medium => {
      mediumPrereqArr[medium._id] = medium.name;
    });

    let videoPercentageArr = [];
    let notePercentageArr = [];
    let audioPercentageArr = [];
    let ebookPercentageArr = [];
    let testPercentageArr = [];
    res.forEach(element => {

      videoPercentageArr.push(element.videoPercentage ? element.videoPercentage : 0);
      notePercentageArr.push(element.notePercentage ? element.notePercentage : 0);
      audioPercentageArr.push(element.audioPercentage ? element.audioPercentage : 0);
      ebookPercentageArr.push(element.ebookPercentage ? element.ebookPercentage : 0);
      testPercentageArr.push(element.testPercentage ? element.testPercentage : 0);

      subjectArr.push(element.name+"-"+mediumPrereqArr[element.mediumId]);
    });

    subject.push({
      name: 'Video',
      type: 'column',
      data: videoPercentageArr

    });

    subject.push({
      name: 'Note',
      type: 'column',
      data: notePercentageArr
    });

    subject.push({
      name: 'Audio',
      type: 'column',
      data: audioPercentageArr
    });

    subject.push({
      name: 'EBook',
      type: 'column',
      data: ebookPercentageArr
    });

    subject.push({
      name: 'Test',
      type: 'column',
      data: testPercentageArr
    });

    this.barSubjectChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: '<b>Subject wise Learning Percentage</b>'
      },
      subtitle: {
        text: `Users ${totalUser}`
      },
      xAxis: {
        categories: subjectArr,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Learning Percentage'
        }
      },            
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: subject
    })
  }

  onDivisionClick(iDivisionName){
    let divisionId = 0;
    let mediumId = 0;
    let mediumPrereqArr = {};
    this.mediumArray.map(medium => {
      mediumPrereqArr[medium._id] = medium.name;
    });
    
    for(let i = 0 ; i < this.divisionArray.length; i++){
      let divisionName = this.divisionArray[i].divisionName+"-"+mediumPrereqArr[this.divisionArray[i].mediumId]

      if(divisionName == iDivisionName){
        divisionId = this.divisionArray[i]._id;
        mediumId = this.divisionArray[i].mediumId;
        break;
      }
    }
    if(divisionId != 0){
      this.payload['divisionId'] = [divisionId];
      this.payload['divisionmediumId'] = [mediumId];
      this.pieSubjectChartArr = [];

      this.payload['subjectId'] = [];
      this.payload['chapterId'] = [];
      this.barChapterChart = null;
      this.avgSubjectChart = null;
      this.barSubjectChart = null;
      this.avgChapterChart = null;
      this.chapterArray = [];
      this.chapterdataLength = this.chapterArray.length;
      this.chapterDataSource = null
      this.pieSubjectChartArr = [];

      this.getSubjectDataSpecificGradeSchoolDashboard();
      this.resetTableFetchingIndex();
      this.pageIndex = 1;
      this.getSchoolDashboardProgressReport();

      //this.pieDivisionChartArr = [];
      //this.getDivisionDataSpecificGradeSchoolDashboard();
    }
  }



  onSubjectClick(iSubjectName){
    let mediumId = 0;
    let subjectId = 0;
    let mediumPrereqArr = {};
    this.mediumArray.map(medium => {
      mediumPrereqArr[medium._id] = medium.name;
    });
    for(let i = 0 ; i < this.subjectArray.length; i++){
      let subjectName = this.subjectArray[i].name+"-"+mediumPrereqArr[this.subjectArray[i].mediumId]

      if(subjectName == iSubjectName){
        subjectId = this.subjectArray[i]._id;
        mediumId = this.subjectArray[i].mediumId;
        break;
      }
    }

    if(subjectId != 0){
      this.payload['subjectId'] = [subjectId];
      this.getChapterDataSpecificGradeSchoolDashboard();
    }
  }

  getChapterDataSpecificGradeSchoolDashboard(){
    this.loader = true;
    this.adminService.getChapterDataSpecificGradeSchoolDashboard(this.startDate, this.endDate,this.payload)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
            console.log(res);
            this.chapterArray = res.result.chapterList;
            this.generateAvgChapterChart(res.result.chapterList,res.result.totalUser);
            this.chapterdataLength = this.chapterArray.length;
            this.chapterDataSource = new MatTableDataSource<any>(res.result.chapterList);
            this.chapterDataSource.sort = this.sort;
            // this.generatebarSubjectChart(res.result.subjectList,res.result.totalUser);
            // this.generateGenderDynamicChart("SUBJECT",res.result.genderdata,res.result.subjectList.length,this.pieSubjectChartArr);
            // this.generateMediumDynamicChart("SUBJECT",res.result.mediumdata,res.result.subjectList.length,this.pieSubjectChartArr);
        }
      });
  }

  public generateAvgChapterChart(res,totalUser) {
    let chapter = [];

    let chapterArr = [];
    let mediumPrereqArr = {};

    this.mediumArray.map(medium => {
      mediumPrereqArr[medium._id] = medium.name;
    });

    let subjectArr = [];
    this.subjectArray.map(element => {
      if(this.payload['subjectId'].indexOf(element._id) > -1){
        subjectArr.push(element.name+"-"+mediumPrereqArr[element.mediumId]);
      };
    });

    res.forEach(element => {
      chapter.push(element.overAllPercentage);
      chapterArr.push(element.title);
    });
  
    console.log(chapter);

    this.avgChapterChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: '<b>AVG - Learning Per Chapter</b>'
      },
      subtitle: {
        text: 'Users - '+totalUser
      },
      xAxis: {
        categories: chapterArr,
        title: {
          text: "Subject "+subjectArr.join(", ")+" chapters"
        }
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Learning Percentage(%)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
      },
      tooltip: {
          valueSuffix: ' %',
          formatter: function() {
            var ret = '';
            for(let  i = 0 ; i < res.length ; i++){
              if(res[i].title == this.point.category){
                ret = this.series.name+" : "+res[i].title+" - "+res[i].overAllPercentage+"% (Users : "+(res[i].userLength ? res[i].userLength : 0)+")"
                break;
              }
            }
            return ret;
          }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        },
        series: {
          point: {
            events: {
              click: function (e) {
              // this.selectChange('gender', [e.point.options.name])
              console.log("Chapter click - "+e.point.category)

              this.onChapterClick(e.point.category);

              }.bind(this)
            }
          }
        }
      },
      legend: {
        enabled : false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Learning Completion',
        type: 'bar',
        data: chapter,
        //color: 'steelblue',
        states: {
        	select: {
            	color: 'blue'
            }
        },
        allowPointSelect: true
      }]
    });
  }

  onChapterClick(iChapterName){
    
    let chapterId = 0;
    for(let i = 0 ; i < this.chapterArray.length; i++){
      let chapterName = this.chapterArray[i].title;

      if(chapterName == iChapterName){
        chapterId = this.chapterArray[i]._id;
        break;
      }
    }

    if(chapterId != 0){
      this.payload['chapterId'] = [chapterId];
      this.getSpecificChapterProgressDataSchoolDashboard();
    }
    
  }

  getSpecificChapterProgressDataSchoolDashboard(){

    this.loader = true;
    this.adminService.getSpecificChapterProgressDataSchoolDashboard(this.startDate, this.endDate,this.payload)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
            console.log(res);
            if(res.result.chapterData)
              this.generatebarChapterChart(res.result.chapterData,res.result.totalUser);
            
        }
      });
  }

  public generatebarChapterChart(res,totalUser) {

    let chapter = [];

    let chapterArr = [];
    let mediumPrereqArr = {};

    let videoPercentageArr = [];
    let notePercentageArr = [];
    let audioPercentageArr = [];
    let ebookPercentageArr = [];
    let testPercentageArr = [];

    videoPercentageArr.push(res.videoPercentage ? res.videoPercentage : 0);
    notePercentageArr.push(res.notePercentage ? res.notePercentage : 0);
    audioPercentageArr.push(res.audioPercentage ? res.audioPercentage : 0);
    ebookPercentageArr.push(res.ebookPercentage ? res.ebookPercentage : 0);
    testPercentageArr.push(res.testPercentage ? res.testPercentage : 0);

    chapterArr.push(res.title);

    chapter.push({
      name: 'Video',
      type: 'column',
      data: videoPercentageArr

    });

    chapter.push({
      name: 'Note',
      type: 'column',
      data: notePercentageArr
    });

    chapter.push({
      name: 'Audio',
      type: 'column',
      data: audioPercentageArr
    });

    chapter.push({
      name: 'EBook',
      type: 'column',
      data: ebookPercentageArr
    });

    chapter.push({
      name: 'Test',
      type: 'column',
      data: testPercentageArr
    });

    this.barChapterChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: '<b>Chapter "'+res.title+'" Learning Percentage</b>'
      },
      subtitle: {
        text: `Users ${totalUser}`
      },
      xAxis: {
        categories: chapterArr,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Learning Percentage'
        }
      },            
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: chapter
    })
  }

  public selectChange(type, e) {
    console.log(type);
    this.payload[type] = [...e];
    console.log(this.payload);

    this.getGradewiseSchoolReport();

    if(type == 'gradeId'){
      this.payload['perGradeId'] = [];
      this.pageIndex = 1;
      this.getSchoolDashboardProgressReport();
      this.payload['divisionId'] = [];
      this.payload['divisionmediumId'] = [];
      this.payload['subjectId'] = [];
      this.payload['chapterId'] = [];
      this.pieSubjectChartArr = [];
      this.avgSubjectChart = null;
      this.barSubjectChart = null;
      this.avgChapterChart = null;
      this.avgDivisionChart = null;
      this.chapterArray = [];
      this.chapterdataLength = this.chapterArray.length;
      this.chapterDataSource = null
      this.pieSubjectChartArr = [];
      this.pieDivisionChartArr = [];

    }else{
        this.pageIndex = 1;
        this.getSchoolDashboardProgressReport();
        this.payload['divisionId'] = [];
        this.payload['divisionmediumId'] = [];
        this.payload['subjectId'] = [];
        this.payload['chapterId'] = [];

        this.pieSubjectChartArr = [];
        this.avgSubjectChart = null;
        this.barSubjectChart = null;
        this.avgChapterChart = null;
        this.avgDivisionChart = null;
        this.chapterArray = [];
        this.chapterdataLength = this.chapterArray.length;
        this.chapterDataSource = null
        this.pieSubjectChartArr = [];
        this.pieDivisionChartArr = [];

        // if(localStorage.getItem("userType") == "SPONSOR") {

        // }else{
          // if(this.payload['perGradeId'].length == 1)
          //   this.getDivisionDataSpecificGradeSchoolDashboard();
          // if(this.payload['divisionId'].length > 0)
          //   this.getSubjectDataSpecificGradeSchoolDashboard();
          // if(this.payload['subjectId'].length > 0)  
          //   this.getChapterDataSpecificGradeSchoolDashboard
        //}

        
    }
    
    
  }

  onClickStudentRow(iStudent){
    console.log(iStudent)
    // this.payload['userId'] = [iStudent._id];
    // this.payload['perGradeId'] = [iStudent.gradeId._id];
    // this.payload['divisionmediumId'] = [iStudent.mediumId._id];

    // this.pieSubjectChartArr = [];
    // this.payload['subjectId'] = [];
    // this.payload['subjectId'] = [];
    // this.payload['chapterId'] = [];
    // this.barChapterChart = null;
    // this.avgSubjectChart = null;
    // this.barSubjectChart = null;
    // this.avgChapterChart = null;
    // this.chapterArray = [];
    // this.chapterdataLength = this.chapterArray.length;
    // this.chapterDataSource = null
    // this.pieSubjectChartArr = [];

    // this.getSubjectDataSpecificGradeSchoolDashboard();
  }

}

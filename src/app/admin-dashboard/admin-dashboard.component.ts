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
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  public gradeArray = [];
  public mediumArray = [];
  public stateArray = [];
  public districtArray = [];
  public genderArray = ['Male','Female'];
  public schoolArray = [];
  // public yearArray = [];
  // public yearSelected : number;
  public roleArray = ['TEACHER', 'STUDENT','PARENT','OTHER'];
  public startDate = undefined;//moment().subtract(30, 'd').format('YYYY-MM-DD');
  public endDate = undefined;//moment().format('YYYY-MM-DD');
  public payload = {
    mediumId: [],
    gradeId: [],
    role: [],
    schoolId: [],
    gender: ["Male", "Female"],
    stateId : [],
    districtId : [],
    sponsorId : [],
  }

  roleChartColor = {
    'TEACHER': "#58595b",
    'STUDENT': "#48b24f",
    'PARENT': "#e57438",
    'OTHER': "#50aed3"
  };

  genderChartColor = {
    'Male': "#e4b031",
    'Female': "#84d2f4",
    'Other': "#cad93f",
  };

  mediumChartColor = {

  }

  userType : string = "";
  public showGMap : boolean = true;
  gradewiseStudentCountLoader : boolean = false;
  gradewiseRoleStudentCountLoader : boolean = false;
  gradewiseMediumStudentCountLoader : boolean = false;
  showSchoolResult : boolean = false;
  showUserList : boolean = false;
  showSchool : boolean = false;
  public increaseCriteriaPercentage = [];
  public top5Gender = [];

  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  public dataSource: any = null;


  public dataSourceUL: any = null;

  public pageSizeUL = 10;
  public pageSizeOptionsUL = [10];
  public pageIndexUL = 1;
  public dataLengthUL = 100;

  public displayedColumnsUL: string[] = [
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

  public displayedColumns: string[] = [
    'schoolName',
    'schoolCode',
    'schoolMedium',
    'center',
    'taluka',
    'schoolManagement',
    'schoolType',
    'usersCount',
    'maleCount',
    'femaleCount'
  ];
  public onboardingChart;
  public mediumChart;
  public roleChart;
  public genderChart;
  public avgComponentChart;
  public avgGradeRoleComponentChart;
  public avgGradeMediumComponentChart;

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
    zoom : 7,
    center:  {
      lat: 19.7515,
      lng: 75.7139,
    },
    disableDoubleClickZoom: false,
    // maxZoom: 15,
    // minZoom: 8,
  }

  constructor(private adminService: AdminService) {

    this.userType = localStorage.getItem("userType");
  }

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

    if(localStorage.getItem("userType") == "SPONSOR") {
      this.payload['sponsorId'] = [localStorage.getItem("sponsorId")];
      this.showSchoolResult = false;
      this.showUserList = true;
      this.showSchool = false;
    }else if(localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER") {
      this.payload['schoolId'] = [localStorage.getItem("schoolId")];
      this.showSchoolResult = false;
      this.showUserList = true;
      this.showSchool = false;
    }else if(localStorage.getItem("userType") == "ADMIN" || localStorage.getItem("userType") == "SUPERADMIN") {
      this.showSchoolResult = false;
      this.showUserList = true;
      this.showSchool = true;
    }else if(localStorage.getItem("userType") == "DISTRICTADMIN") {
      this.showSchoolResult = true;
      this.showUserList = false;
      this.showSchool = true;
    }

    this.getState();
    this.getDistrict();
    this.getGrade();
    this.getMedium();
   // this.getSchools();
   // this.generateDashboardReport();
   // this.generateCharts();
  }

  onPrint(divName) {
    const printContents = document.getElementById(divName).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}

  dateRangeChange() {
    this.startDate = moment(this.range.value.start).format('YYYY-MM-DD');
    this.endDate = moment(this.range.value.end).format('YYYY-MM-DD');
    if(this.showUserList) {
      this.getAdminDashboardProgressReport();
    }
    this.generateCharts();
  }

  public getState() {
    this.adminService.getState().subscribe((res: any) => {
      this.stateArray.push(...res.result);
    })
  }

  public getDistrict() {
    this.adminService.getDistrict().subscribe((res: any) => {
      if(localStorage.getItem("userType") == 'DISTRICTADMIN'){
        res.result.map(element => {
          if(element._id == localStorage.getItem("districtId")){
            this.payload['districtId'].push(element._id);
            this.districtArray.push(element);
          }
        });

        this.getSchools();
      }else{
        this.districtArray.push(...res.result);
      }

      if(this.stateArray.length == 1){
        this.payload['stateId'] = [this.stateArray[0]._id];
       // this.getDistrictWiseMaleFemaleCount();
        this.generateCharts();
       // this.getIncreasedPercentageRatio();
        if(this.showUserList) {
          this.getAdminDashboardProgressReport();
        }
        if(this.showSchoolResult) {
          this.getAdminDashboardSchoolReport();
          this.getTop5ResultSchoolWise();
        }
        
      }
      
    })
  }

  getIncreasedPercentageRatio(){
    this.increaseCriteriaPercentage = [];
    this.getIncreasedPercentageOfGenderWise();
    this.getIncreasedPercentageOfRoleWise();
    this.getIncreasedPercentageOfMediumWise();
  }

  getIncreasedPercentageOfGenderWise(){
    let body = Object.assign({}, this.payload);
    this.adminService.getIncreasedPercentageOfGenderWise(this.startDate, this.endDate, body)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          console.log("getIncreasedPercentageOfGenderWise - ",res);

          this.payload['gender'].forEach(element => {
            if(res.result && res.result[element]){

              let arrow = "";
              if(res.result[element].increasePerceUsers > 0){
                arrow = res.result[element].increasePerceUsers > 10 ? "fa-angle-double-up" : "fa-angle-up"; 
              }else{
                arrow = res.result[element].increasePerceUsers < -10 ? "fa-angle-double-down" : "fa-angle-down"; 
              }

              this.increaseCriteriaPercentage.push({
                  name : element,
                  increasedPercentage : res.result[element].increasePerceUsers,
                  arrow : arrow
              });
            }
          });
        }
      });
  }

  getIncreasedPercentageOfRoleWise(){
    let body = Object.assign({}, this.payload);
    this.adminService.getIncreasedPercentageOfRoleWise(this.startDate, this.endDate, body)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          console.log("getIncreasedPercentageOfRoleWise - ",res);


          for(let key in res.result){

            let arrow = "";
            if(res.result[key].increasePerceUsers > 0){
              arrow = res.result[key].increasePerceUsers > 10 ? "fa-angle-double-up" : "fa-angle-up"; 
            }else{
              arrow = res.result[key].increasePerceUsers < -10 ? "fa-angle-double-down" : "fa-angle-down"; 
            }
              
            this.increaseCriteriaPercentage.push({
              name : key,
              increasedPercentage : res.result[key].increasePerceUsers,
              arrow : arrow
            });
          }
        
        }
      });
  }

  getIncreasedPercentageOfMediumWise(){
    let body = Object.assign({}, this.payload);
    this.adminService.getIncreasedPercentageOfMediumWise(this.startDate, this.endDate, body)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          console.log("getIncreasedPercentageOfMediumWise - ",res);

          let mediumPrereqArr = {};
          this.mediumArray.map(medium => {
            mediumPrereqArr[medium._id] = medium.name;
          });

          //fa-angle-double-up
          //fa-angle-double-down
          //fa-angle-up
          //fa-angle-down

          for(let key in res.result){

            let arrow = "";
            if(res.result[key].increasePerceUsers > 0){
              arrow = res.result[key].increasePerceUsers > 10 ? "fa-angle-double-up" : "fa-angle-up"; 
            }else{
              arrow = res.result[key].increasePerceUsers < -10 ? "fa-angle-double-down" : "fa-angle-down"; 
            }

            this.increaseCriteriaPercentage.push({
              name : mediumPrereqArr[key],
              increasedPercentage : res.result[key].increasePerceUsers,
              arrow : arrow
            });
          }

        }
      });
  }

  public getGrade() {
    this.adminService.getGrade().subscribe((res: any) => {
      this.gradeArray.push(...res.result);
    //   this.gradeArray.map(element => {
    //     if(element.gradeName == '10')
    //      this.payload['gradeId'].push(element._id);
    //  });
    })
  }

  public getMedium() {
    let mediumColor = ['#267278', '#65338d','#4770b3','#d21f75','#3b3689','#65338d','#65338d'];

    this.adminService.getMedium().subscribe((res: any) => {
      this.mediumArray.push(...res.result);
        
        this.mediumArray.map((element,index) => {
            this.payload['mediumId'].push(element._id);
            this.mediumChartColor[element._id] = mediumColor[index]; 

        });
    })

  }

  public getSchools() {
    this.adminService.getSchools(this.payload).subscribe((res: any) => {
      this.schoolArray = res.result
      // .filter((element) => {
      //   if (element.schoolCode && element.schoolCode.length) {
      //     return element;
      //   }
      // })
      
    })
  }

  openMarkerInfo(marker: MapMarker,content){
    console.log(marker,content)
    this.infoContent = content;
    this.info.open(marker);
  }

  public getDistrictWiseMaleFemaleCount() {
    this.loader = true;
    this.adminService.getDistrictWiseMaleFemaleCount(this.payload)
      .subscribe((res: any) => {
        this.loader = false;
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

  public getAdminDashboardProgressReport() {
    this.loader = true;
    this.adminService.getAdminDashboardProgressReport(this.startDate, this.endDate, this.payload, this.pageIndexUL, this.pageSizeUL)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          console.log(res);
          this.dataLengthUL = res.totalCount;
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
          this.dataSourceUL = new MatTableDataSource<any>(res.result);
          this.dataSourceUL.sort = this.sort;
        }
      });
  }

  public getAdminDashboardSchoolReport() {
    this.loader = true;
    let body = Object.assign({}, this.payload);

    if(body.mediumId.length == this.mediumArray.length){
      body.mediumId = [];
    }
    this.adminService.getAdminDashboardSchoolReport(this.startDate, this.endDate, body, this.pageIndex, this.pageSize)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          console.log(res);
          this.dataLength = res.totalCount;
          this.dataSource = new MatTableDataSource<any>(res.result);
          this.dataSource.sort = this.sort;
        }
      });
  }

  public getTop5ResultSchoolWise() {
    this.top5Gender = [];
    this.getTop5SchoolResultGenderWise();
    this.getTop5SchoolResultMediumWise();
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
  
  public getTop5SchoolResultGenderWise() {
    this.loader = true;
    let body = Object.assign({}, this.payload);
    this.adminService.getTop5SchoolResultGenderWise(this.startDate, this.endDate, body)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          console.log("getTop5SchoolResultGenderWise - ",res);
          // this.top5MaleSchools = res.result.top5MaleSchoolList;
          // this.bottom5MaleSchools = res.result.bottom5MaleSchoolList;

          // this.top5FemaleSchools = res.result.top5FemaleSchoolList;
          // this.bottom5FemaleSchools = res.result.bottom5FemaleSchoolList;

          if(res.result.top5MaleSchoolList && res.result.top5MaleSchoolList.length > 0){
            this.top5Gender.push({
              countTitle : "Male",
              title : "Top 5 Male Schools",
              className : "top5-data-heading",
              data : res.result.top5MaleSchoolList,
              missingRow : 5 - res.result.top5MaleSchoolList.length
            });
          }
          if(res.result.bottom5MaleSchoolList && res.result.bottom5MaleSchoolList.length > 0){
            this.top5Gender.push({
              countTitle : "Male",
              title : "Bottom 5 Male Schools",
              className : "bottom5-data-heading",
              data : res.result.bottom5MaleSchoolList,
              missingRow : 5 - res.result.bottom5MaleSchoolList.length
            });
          }
          if(res.result.top5FemaleSchoolList && res.result.top5FemaleSchoolList.length > 0){
            this.top5Gender.push({
              countTitle : "Female",
              title : "Top 5 Female Schools",
              className : "top5-data-heading",
              data : res.result.top5FemaleSchoolList,
              missingRow : 5 - res.result.top5FemaleSchoolList.length
            });
          }
          if(res.result.bottom5FemaleSchoolList && res.result.bottom5FemaleSchoolList.length > 0){
            this.top5Gender.push({
              countTitle : "Female",
              title : "Bottom 5 Female Schools",
              className : "bottom5-data-heading",
              data : res.result.bottom5FemaleSchoolList,
              missingRow : 5 - res.result.bottom5FemaleSchoolList.length
            });
          }

          // this.top5Gender.push(res.result.bottom5MaleSchoolList);
          // this.top5Gender.push(res.result.top5FemaleSchoolList);
          // this.top5Gender.push(res.result.bottom5FemaleSchoolList);



        }
      });
  }

  public getTop5SchoolResultMediumWise() {
    this.loader = true;
    let body = Object.assign({}, this.payload);

    let mediumPrereqArr = {};
    this.mediumArray.map(medium => {
      mediumPrereqArr[medium._id] = medium.name;
    });

    this.payload['mediumId'].forEach(element => {

      body.mediumId = [element];
      console.log("body ----------------",body)
      this.adminService.getTop5SchoolResultMediumWise(this.startDate, this.endDate, body)
      .subscribe((res: any) => {
        this.loader = false;
        if (res.responseCode == 200) {
          console.log("getTop5SchoolResultMediumWise - ",res);
          
          if(res.result.top5MediumSchoolList && res.result.top5MediumSchoolList.length > 0){
            this.top5Gender.push({
              title : `Top 5 ${mediumPrereqArr[res.result.mediumId]} Schools`,
              countTitle : "Users",
              className : "top5-data-heading",
              data : res.result.top5MediumSchoolList,
              missingRow : 5 - res.result.top5MediumSchoolList.length
            });
          }
          if(res.result.bottom5MediumSchoolList && res.result.bottom5MediumSchoolList.length > 0){
            this.top5Gender.push({
              title : `Bottom 5 ${mediumPrereqArr[res.result.mediumId]} Schools`,
              countTitle : "Users",
              className : "bottom5-data-heading",
              data : res.result.bottom5MediumSchoolList,
              missingRow : 5 - res.result.bottom5MediumSchoolList.length
            });
          }
        }
      });

    });
      

    
  }

  public generateCharts() {
    this.adminService.generateCharts(this.startDate, this.endDate, this.payload)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.userListLength = res.result.length;
         // console.log(res.result);
          this.createMediumChart(res.result);
          this.createRoleChart(res.result);
          this.createGenderChart(res.result);
          this.createOnboardingChart(res.result);
          this.getGradeWiseGenderCount();
          this.getGradeWiseRoleCount();
          this.getGradeWiseMediumCount();
          
        }
      });
  }

  public selectChange(type, e) {
  
    this.payload[type] = [...e];
    console.log(this.payload,type);
    if(type == 'districtId'){
      if(this.showSchool) {
        this.getSchools();
      }
      
    }
    //

    
    this.generateCharts();
    if(this.showUserList) {
      this.pageIndexUL = 1;
      this.getAdminDashboardProgressReport();
    }
    if(this.showSchoolResult) {
      this.pageIndex = 1;
      this.getAdminDashboardSchoolReport();
      this.getTop5ResultSchoolWise();
    }
    //this.getDistrictWiseMaleFemaleCount();

    
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
      if (mediumReport[element.mediumId?.name])
        mediumReport[element.mediumId?.name].y += 1;
    });

    let subtitleString = "";
    for(let key in mediumReport){
      subtitleString += `${key} - ${ mediumReport[key].y } `
    }

    console.log(Object.values(mediumReport));

    let chartOption = Object.assign({},this.pieOption);
    chartOption.colors =  ['#267278', '#65338d','#4770b3','#d21f75','#3b3689','#65338d','#65338d'];

    this.mediumChart = new Chart({
      title: {
        text: '<b>Medium</b>'
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: subtitleString
      },
      plotOptions: {
        pie: { ...chartOption },
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
        color : this.roleChartColor['TEACHER']
      },
      'STUDENT': {
        name: 'STUDENT',
        y: 0,
        color : this.roleChartColor['STUDENT']
      },
      'PARENT': {
        name: 'PARENT',
        y: 0,
        color : this.roleChartColor['PARENT']
      },
      'OTHER': {
        name: 'OTHER',
        y: 0,
        color : this.roleChartColor['OTHER']
      }
    };
    result.forEach(element => {
      //console.log(element.userType)
      if (roleReport[element.userType])
        roleReport[element.userType].y += 1;
    });

    let subtitleString = "";
    for(let key in roleReport){
      subtitleString += `${key} - ${ roleReport[key].y } `
    }

    // let chartOption = Object.assign({},this.pieOption);
    // chartOption.colors =  ['#58595b', '#48b24f','#e57438','#50aed3','#569d79','#569dd2'];
    this.roleChart = new Chart({
      title: {
        text: '<b>Role</b>'
      },
      subtitle: {
        text: subtitleString
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
        y: 0,
        color :  this.genderChartColor['Male']
      },
      'Female': {
        name: 'Female',
        y: 0,
        color :  this.genderChartColor['Female']
      }
    };

    
    result.forEach(element => {
      if (genderReport[element.gender])
        genderReport[element.gender].y += 1;
    });

    let subtitleString = "";
    for(let key in genderReport){
      subtitleString += `${key} - ${ genderReport[key].y } `
    }

  //  let chartOption = Object.assign({},this.pieOption);
    //chartOption.colors =  ['#e4b031', '#84d2f4','#cad93f'];
    this.genderChart = new Chart({
      title: {
        text: '<b>Gender</b>'
      },
      subtitle: {
        text: subtitleString
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
    // let date = new Date();
    // date.setMonth(4);

    // let monthsRequired = 12;
    // for (let i = 1; i <= monthsRequired; i++) {
    //   dateData.push(moment(date).add(i, 'months').format('MMMM YYYY'));
    // }

    if(result.length == 0){
      this.onboardingChart = null;
      return
    }

    result.forEach(element => {
      let date = moment(element.createdAt).format("MMMM YYYY");
      if(dateData.indexOf(date) == -1)
        dateData.push(date);
    });


    console.log(dateData);
    // date blank object
    dateData.forEach(element => {
      let obj = {
        name: element,
        y: 0
      }
      dateObj[element] = {
        name: element,
        y: 0
      };
      activeObj[element] = {
        name: element,
        y: 0
      };
    })
    // assigning counts in date obj * active obj
    result.forEach(element => {
      let date = moment(element.createdAt).format("MMMM YYYY");

      if(dateObj[date]){
        dateObj[date].y += 1;
        if (element.SubscriptionCode != '0' && element.SubscriptionCode != '1' && element.SubscriptionCode != '2') {
          activeObj[date].y += 1;
        }
      }
    });

    console.log(dateObj);
    console.log(activeObj);

    let startMonth = dateData[0];
    let endMonth = dateData[dateData.length-1];

    this.onboardingChart = new Chart({
      title: {
        text: '<b>Onboarding Trend</b>',
        // align : 'left',
        // verticalAlign : 'top'
      },
      subtitle: {
        text: `New user onboarding from ${startMonth} - ${endMonth}`,
        // align : 'left',
        // verticalAlign : 'top'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: 'Student Count'
        }
      },
      series: [
        {
          type: 'column',
          name: 'New Onboard',
          data: Object.values(dateObj),
          color:"#135c0b",
          dataLabels: {
            enabled: true
          }
        },
        {
          type: 'line',
          name: 'Licence Active',
          color:"#ff3800",
          data: Object.values(activeObj),
          dataLabels: {
            enabled: true
          }
        }
      ]
    },
    );
  }

  public getGradeWiseGenderCount() {
    this.gradewiseStudentCountLoader = true;
    this.adminService.getGradeWiseGenderCount(this.startDate, this.endDate, this.payload)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          console.log(res.result);
          let femaleArr = [];
          let maleArr = [];
          let maleCount = 0;
          let femaleCount = 0;
          let gradeArr = [];

          res.result.forEach(element => {
            maleCount = maleCount + (element.Male ? element.Male : 0)
            femaleCount = femaleCount + (element.Female ? element.Female : 0)
            maleArr.push({ y : (element.Male ? element.Male : 0), color : this.genderChartColor['Male'] });
            femaleArr.push({ y : (element.Female ? element.Female : 0), color : this.genderChartColor['Female'] });
            gradeArr.push(element.gradeName == 'Other' ? 'Other' : ("Grade "+element.gradeName));
          });


          //colors =  ['#e4b031', '#84d2f4','#cad93f'];

          console.log(maleArr);
          console.log(femaleArr);
          
          this.avgComponentChart = new Chart({
            chart: {
              type: 'column'
            },
            title: {
              text: '<b>Grade - Gender Students</b>'
            },
            subtitle: {
              text: `Male - ${ maleCount } Female - ${ femaleCount }`
            },
            xAxis: {
              categories: gradeArr,
              crosshair: true
            },
            credits: {
              enabled: false
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Student Count'
              }
            },            
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            series: [{
              name: 'Male',
              type: 'column',
              color : this.genderChartColor['Male'],
              data: maleArr,      
            }, {
              name: 'Female',
              type: 'column',
              color : this.genderChartColor['Female'],
              data: femaleArr
      
            }]
          })

          this.gradewiseStudentCountLoader = false;
        }
      });
  }

  public getGradeWiseRoleCount() {
    this.gradewiseRoleStudentCountLoader = true;
    this.adminService.getGradeWiseRoleCount(this.startDate, this.endDate, this.payload)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          console.log(res.result);
        
          let gradeArr = [];

          let roleGraphObj = {};
          this.roleArray.forEach(roleelement => {
            roleGraphObj[roleelement] = {
                name: roleelement,
               // type: 'column',
                color : this.roleChartColor[roleelement],
                data: []
              };
          });
       
          res.result.forEach(element => {
            gradeArr.push(element.gradeName == 'Other' ? 'Other' : ("Grade "+element.gradeName));
            
            this.roleArray.forEach(roleElement => {
              if(element[roleElement] || element[roleElement] == 0){
                roleGraphObj[roleElement].data.push({ y : element[roleElement], color : this.roleChartColor[roleElement]});
              }
            });
          });
          console.log(roleGraphObj);

          let roleGraphArr = [];          
          for(let key in roleGraphObj){
            roleGraphArr.push(roleGraphObj[key])
          }
          this.avgGradeRoleComponentChart = new Chart({
            chart: {
              type: 'column'
            },
            title: {
              text: '<b>Grade - Role Students</b>'
            },
            // subtitle: {
            //   text: `Male - ${ maleCount } Female - ${ femaleCount }`
            // },
            xAxis: {
              categories: gradeArr,
              crosshair: true
            },
            credits: {
              enabled: false
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Student Count'
              },
              stackLabels: {
                enabled: true,
                // style: {
                //   fontWeight: 'bold',
                //   color: ( // theme
                //     Highcharts.defaultOptions.title.style &&
                //     Highcharts.defaultOptions.title.style.color
                //   ) || 'gray'
                // }
              }
            },
            tooltip: {
              headerFormat: '<b>{point.x}</b><br/>',
              pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },        
            plotOptions: {
              column: {
                stacking: 'normal',
                dataLabels: {
                  enabled: true
                }
              }
            },
            series: roleGraphArr
          })

          this.gradewiseRoleStudentCountLoader = false;
        }
      });
  }

  public getGradeWiseMediumCount() {
    this.gradewiseMediumStudentCountLoader = true;
    this.adminService.getGradeWiseMediumCount(this.startDate, this.endDate, this.payload)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          console.log(res.result);
  
          let gradeArr = [];
          let mediumGraphObj = {};
          this.mediumArray.forEach(mediumelement => {
            mediumGraphObj[mediumelement._id] = {
                name: mediumelement.name,
                type: 'column',
                color : this.mediumChartColor[mediumelement._id],
                data: []
              };
          });

          res.result.forEach(element => {
            gradeArr.push(element.gradeName == 'Other' ? 'Other' : ("Grade "+element.gradeName));

            this.mediumArray.map(medium => {
              if(element[medium._id] || element[medium._id] == 0){
                mediumGraphObj[medium._id].data.push(element[medium._id]);
              }
            });
          });

          console.log(mediumGraphObj);
          

          let mediumGraphArr = [];          
          for(let key in mediumGraphObj){
            mediumGraphArr.push(mediumGraphObj[key])
          }
          this.avgGradeMediumComponentChart  = new Chart({
            chart: {
              type: 'column'
            },
            title: {
              text: '<b>Grade - Medium Students</b>'
            },
            // subtitle: {
            //   text: `Male - ${ maleCount } Female - ${ femaleCount }`
            // },
            xAxis: {
              categories: gradeArr,
              crosshair: true
            },
            credits: {
              enabled: false
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Student Count'
              }
            },            
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            series: mediumGraphArr
          })

          this.gradewiseMediumStudentCountLoader = false;
        }
      });
  }

  

  public getNext(e) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    //this.getAdminDashboardProgressReport();
    this.getAdminDashboardSchoolReport();
  }


  public getStudentNext(e) {
    this.pageIndexUL = e.pageIndex + 1;
    this.pageSizeUL = e.pageSize;
    this.getAdminDashboardProgressReport();
  }

  public reset() {
    this.payload = {
      mediumId: [],
      gradeId: [],
      role: [],
      schoolId: [],
      gender: ["Male", "Female"],
      stateId : [],
      districtId : [],
      sponsorId : []
    }
    this.startDate = moment().subtract(30, 'd').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    this.range.controls['start'].setValue(null);
    this.range.controls['end'].setValue(null);
    if(this.showUserList) {
      this.getAdminDashboardProgressReport();
    }
    if(this.showSchoolResult) {
      this.getAdminDashboardSchoolReport();
      this.getTop5ResultSchoolWise();
    }
    this.generateCharts();
  }

}

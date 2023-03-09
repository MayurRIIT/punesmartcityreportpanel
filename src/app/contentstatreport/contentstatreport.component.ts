import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ExcelService } from '../core/services/excel.service';
import { TableUtil } from '../core/helpers/tableUtil';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-contentstatreport',
  templateUrl: './contentstatreport.component.html',
  styleUrls: ['./contentstatreport.component.scss'],
})
export class ContentstatreportComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  gradeList : any = [];
  subjectList : any = [];
  subjectId  : any = 0;
  gradeId : any = 0;
  mediumsList : any = [];
  mediumId  : any = 0;
  loading : boolean = false;
  datalist : any = [];
  totalVideo : number = 0;
  totalEBook : number = 0;
  totalNotes : number = 0;
  totalAudio : number = 0;
  totalTest : number = 0;
  contentType : any = '';
  searchTerm : string = '';
  gradeData : any = 0;
  subjectData  : any = 0;
  mediumData  : any = 0;
  contentTypeData : any = '';
  //totalInteractiveTestList : number = 0;
  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService : UserService,
      private alertService: AlertService,
      private excelService:ExcelService
  ) {
    
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
          'excel'
      ]
    };

  }

  ngAfterViewInit() {
    this.getGrade();
    this.getMediumsList();
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getGrade(){
    this.userService.getGrade().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.gradeList = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }


  getMediumsList(){
    this.userService.getMediumsList().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.mediumsList = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  onMediumChangeGetSubjectList(event){
    console.log(event);
    this.getSubjectList();
  }

  getSubjectList(){
      this.subjectId = 0;
      this.subjectList  = [];
      let mediumId = 0;
      let gradeId = 0;
      if(this.gradeId == "0"){
        gradeId = 0;
      }else{
        gradeId = this.gradeId._id;
      }

      if(this.mediumId == "0"){
        mediumId = 0;
      }else{
        mediumId = this.mediumId._id;
      }

      this.userService.getSubjectList(gradeId,mediumId).subscribe(response => {
        console.log(response);  
            if(response.responseCode == 200){
              this.subjectList = response.result;
            }else{
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

  loadDashboardData(){
      this.alertService.clear();
      // if(this.gradeId == "0"){
      //   this.alertService.error("Please select grade");
      //   return;
      // }

      // if(this.userCategory == "0"){
      //     if(this.sponsorId == "0"){
      //       this.alertService.error("Please select sponsor");
      //       return;
      //     }
      // }

      console.log(this.gradeId,this.subjectId)

      let gradeId = 0;
      if(this.gradeId == "0"){
        gradeId = 0;
      }else{
        gradeId = this.gradeId._id;
      }

      let mediumId = 0;
      if(this.mediumId == "0"){
        mediumId = 0;
      }else{
        mediumId = this.mediumId._id;
      }

      let subjectId = 0;
      if(this.subjectId == "0"){
        subjectId = 0;
      }else{
        subjectId = this.subjectId._id;
      }

      this.totalVideo = 0;
      this.totalEBook = 0;
      this.totalNotes = 0;
      this.totalAudio = 0;
      this.totalTest  = 0;

      
      this.loading = true;
      this.userService.getContentStatusReport(gradeId,mediumId,subjectId,this.contentType).subscribe(response => {

            console.log(response);  
            
            //this.totalInteractiveTestList = 0;
            if(response.responseCode == 200){
                this.datalist = response.result.chapterdata;
                this.loading = false;
                
                if(this.dtElement && this.dtElement.dtInstance){
                  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    // Destroy the table first
                    dtInstance.destroy();
                    this.dtTrigger.next();
                    // Call the dtTrigger to rerender again
                  });
                  
                }else{
                  this.dtTrigger.next();
                }


                this.gradeData = this.gradeId;
                this.mediumData = this.mediumId;
                this.subjectData = this.subjectId;
                this.contentTypeData = this.contentType;
                this.totalVideo = response.result.totalVideoList;
                this.totalEBook = response.result.totalEbookList;
                this.totalNotes = response.result.totalNoteList;
                this.totalAudio = response.result.totalAudioList;
                this.totalTest  = response.result.totalTestList;
                ///this.totalInteractiveTestList  = response.result.totalInteractiveTestList;
            }else{
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

}

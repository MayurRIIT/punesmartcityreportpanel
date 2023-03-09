import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ViewSdkService } from '../core/services/view-sdk.service';

@Component({
  selector: 'app-evaluate-testseries-response',
  templateUrl: './evaluate-testseries-response.component.html',
  styleUrls: ['./evaluate-testseries-response.component.scss'],
})
export class EvaluateTestSeriesResponseComponent implements OnInit {
  public testSeriesId: string = '';
  public testPaperResponseId: string = '';
  public testSeriesObj: any = null;
  public gradeId: string = '';
  public mediumId: string = '';
  public questionArray = [];
  public responsePayload = {
    questionsMarks: [

    ],
    obtainedTotalMarks: "",
    totalMarks: "",
    averagePercentage: 0.0,
    evaluatedAnswerSheetUrl: "",
    passingStatus: ""
  };
  public responseId = '';
  public fileToUpload: any = null;
  constructor(
    private user: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viewSDKClient: ViewSdkService,
    private alertService: AlertService
  ) {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params);
        this.testSeriesId = params.testSeriesId;
        this.testPaperResponseId = params.testPaperResponseId;
        this.gradeId = params.gradeId;
        this.mediumId = params.mediumId;

        this.getTestPaperResponse()

        console.log("=========testPaperResponseId=====>", this.testPaperResponseId);
      });
  }

  ngOnInit() {
    
  
  }

  getTestPaperResponse() {
    this.user.getTestPaperResponse(this.testPaperResponseId)
      .subscribe((response: any) => {
        console.log(response);
        this.testSeriesObj = response.result;
        this.responsePayload.obtainedTotalMarks = this.testSeriesObj.obtainedTotalMarks ? this.testSeriesObj.obtainedTotalMarks : ""
        this.responsePayload.totalMarks = this.testSeriesObj.totalMarks ? this.testSeriesObj.totalMarks : ""
        
        this.triggerPDFViewer(this.testSeriesObj);
        //this.responseId = this.testSeriesObj._id;
      });
  }

  public triggerPDFViewer(obj) {
    console.log("triggerPDFViewer --->",obj);

    let _obj = {
      fileName : obj.fileName,
      _id : obj._id
    }
    if(this.testSeriesObj.passingStatus != 'SUBMITTED'){
      _obj = {
        fileName : obj.evaluatedAnswerSheetUrl,
        _id : obj._id
      }
    }
    setTimeout(() => {
      console.log(_obj);

      this.viewSDKClient.ready().then(() => {
        /* Invoke file preview */
        /* By default the embed mode will be Full Window */
        this.viewSDKClient.previewFile('pdf-div', {
          /* Pass the embed mode option here */
          // embedMode: 'IN_LINE'

        }, _obj);
        console.log(_obj);

      });
    }, 2000);
  }

  public getTotal() {
    // this.responsePayload.obtainedTotalMarks = this.questionArray.map(
    //   (item: any) => item.marks)
    //   .reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0);
    console.log(this.responsePayload);
    if(this.responsePayload.obtainedTotalMarks != "" && this.responsePayload.totalMarks != "")
      this.responsePayload.averagePercentage = (Number(this.responsePayload.obtainedTotalMarks) / Number(this.responsePayload.totalMarks)) * 100;
  };

  public handleFileInput(files: any) {

    this.fileToUpload = files.target.files.item(0);
    //this.fileToUpload = files.item(0);
    console.log(files);
  }

  // upload pdf api
  public updateResponse() {

      console.log(this.testSeriesObj);
      if(this.testSeriesObj.passingStatus == 'SUBMITTED'){
          if(this.fileToUpload == null){
            alert("Please upload the modified answer sheet")
            return;
          }

          if(this.responsePayload.obtainedTotalMarks == ""){
            alert("Please enter the obtain mark")
            return;
          }

          if(this.responsePayload.totalMarks == ""){
            alert("Please enter the total mark")
            return;
          }
      }

      if(Number(this.responsePayload.obtainedTotalMarks) > Number(this.responsePayload.totalMarks)){
        alert("Mark obtained should not be greater than Total Marks")
        return;
      }

      const uploadData = new FormData();
      uploadData.append('answersheet', this.fileToUpload);
      uploadData.append('subjectId', this.testSeriesObj?.paperId?.subjectId?._id);
      uploadData.append('subjectName', this.testSeriesObj?.paperId?.subjectId?.name);
      uploadData.append('testseriesId', this.testSeriesId);
      uploadData.append('testseriesName', this.testSeriesObj?.testSeriesId?.name);
      uploadData.append('userId', this.testSeriesObj?.student_id?._id);
      uploadData.append('testPaperResponseId', this.testPaperResponseId);

      uploadData.append('obtainedTotalMarks', this.responsePayload.obtainedTotalMarks);
      uploadData.append('totalMarks', this.responsePayload.totalMarks);

      console.log(uploadData);     
      this.user.uploadUserAnswerSheet(uploadData).subscribe((response) => {
  
            console.log(response);  
            if(response.responseCode == 200){
              this.router.navigate(['/home/view-testseries-response'], { queryParams: { testSeriesId: this.testSeriesId,  gradeId : this.gradeId, mediumId : this.mediumId } });
            }else{
              alert(response.responseMessage);
            }       
      },
      error => {
        alert(error);
      });
  }




}

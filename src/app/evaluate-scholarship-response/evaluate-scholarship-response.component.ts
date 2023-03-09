import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ViewSdkService } from '../core/services/view-sdk.service';

@Component({
  selector: 'app-evaluate-scholarship-response',
  templateUrl: './evaluate-scholarship-response.component.html',
  styleUrls: ['./evaluate-scholarship-response.component.scss'],
})
export class EvaluateScholarshipResponseComponent implements OnInit {
  public scholarshipId: string = '';
  public testPaperResponseId: string = '';
  public gradeId: string = '';
  public mediumId: string = '';
  public scholarshipObj: any = null;
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
        this.scholarshipId = params.scholarshipId;
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
    this.user.getscholarshipTestPaperResponse(this.testPaperResponseId)
      .subscribe((response: any) => {
        console.log(response);
        this.scholarshipObj = response.result;
        this.responsePayload.obtainedTotalMarks = this.scholarshipObj.obtainedTotalMarks ? this.scholarshipObj.obtainedTotalMarks : ""
        this.responsePayload.totalMarks = this.scholarshipObj.totalMarks ? this.scholarshipObj.totalMarks : ""
        
        this.triggerPDFViewer(this.scholarshipObj);
        //this.responseId = this.scholarshipObj._id;
      });
  }

  public triggerPDFViewer(obj) {
    console.log("triggerPDFViewer --->",obj);

    let _obj = {
      fileName : obj.fileName,
      _id : obj._id
    }
    if(this.scholarshipObj.passingStatus != 'SUBMITTED'){
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

      console.log(this.scholarshipObj);
      if(this.scholarshipObj.passingStatus == 'SUBMITTED'){
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
      uploadData.append('subjectId', this.scholarshipObj?.paperId?.subjectId?._id);
      uploadData.append('subjectName', this.scholarshipObj?.paperId?.subjectId?.name);
      uploadData.append('scholarshipId', this.scholarshipId);
      uploadData.append('scholarshipName', this.scholarshipObj?.scholarshipId?.name);
      uploadData.append('userId', this.scholarshipObj?.student_id?._id);
      uploadData.append('testPaperResponseId', this.testPaperResponseId);

      uploadData.append('obtainedTotalMarks', this.responsePayload.obtainedTotalMarks);
      uploadData.append('totalMarks', this.responsePayload.totalMarks);

      console.log(uploadData);     
      this.user.uploadUserAnswerSheetscholarship(uploadData).subscribe((response) => {
  
            console.log(response);  
            if(response.responseCode == 200){
              this.router.navigate(['/home/view-scholarship-response'], { queryParams: { scholarshipId: this.scholarshipId, gradeId : this.gradeId, mediumId : this.mediumId } });
            }else{
              alert(response.responseMessage);
            }       
      },
      error => {
        alert(error);
      });
  }




}

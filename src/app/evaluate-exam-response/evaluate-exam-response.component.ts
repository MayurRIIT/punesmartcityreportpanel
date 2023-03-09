import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ViewSdkService } from '../core/services/view-sdk.service';
@Component({
  selector: 'app-evaluate-exam-response',
  templateUrl: './evaluate-exam-response.component.html',
  styleUrls: ['./evaluate-exam-response.component.scss'],
})
export class EvaluateExamResponseComponent implements OnInit {
  public examId: string = '';
  public examObj: any = null;
  public questionArray = [];
  public responseId = '';
  public fileToUpload: any = null;
  public evaluationId: string = '';
  public modify: any = false;
  public responseForm: FormGroup;
  public questionMarks: FormArray;
  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private viewSDKClient: ViewSdkService
  ) {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.examId = res.examId;
      this.evaluationId = res.evaluationId;
      this.getExamResponse();
    });
  }

  ngOnInit() {

  }



  getExamResponse() {
    this.user.getEvaluatedSheet(this.evaluationId)
      .subscribe((res: any) => {
        this.examObj = res.result;
        this.createForm(this.examObj);
        this.responseId = this.examObj._id;
        this.triggerPDFViewer(this.examObj);
      });
  }

  public createForm(obj) {
    this.responseForm = this.fb.group({
      questionMarks: this.fb.array([], Validators.required),
      obtainedTotalMarks: [0, Validators.required],
      totalMarks: [100, Validators.required],
      averagePercentage: ['0%', Validators.required],
      evaluatedAnswerSheetUrl: ['', Validators.required],
      passingStatus: ['', Validators.required],
      oldData: ['']
    })
    this.createItem(obj);
    this.fillOldData(obj);
    this.preFillData(obj);
  }

  get evaluatedAnswerSheetUrl() { return this.responseForm.get('evaluatedAnswerSheetUrl'); }
  get passingStatus() { return this.responseForm.get('passingStatus'); }
  get totalMarks() { return this.responseForm.get('totalMarks'); }
  get obtainedTotalMarks() { return this.responseForm.get('obtainedTotalMarks'); }

  public createItem(obj) {
    for (let i = 0; i < obj.examId.quesCount; i++) {
      let item = this.fb.group({
        questionNumber: [JSON.stringify(i + 1), Validators.required],
        marks: [0],
      });
      this.questionMarks = this.responseForm.get('questionMarks') as FormArray;
      this.questionMarks.push(item);
    }
  }

  public getTotal() {
    // update total
    this.responseForm.controls['obtainedTotalMarks'].setValue(
      this.responseForm.controls['questionMarks'].value.map(
        (item: any) => item.marks)
        .reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0)
    );
    let percentage = (
      this.responseForm.controls['obtainedTotalMarks'].value /
      this.responseForm.controls['totalMarks'].value
    ) * 100
    // update percentage
    this.responseForm.controls['averagePercentage'].setValue(
      percentage + '%'
    )

    if (percentage >= 33) {
      this.responseForm.controls['passingStatus'].setValue('Pass');
    }
    else {
      this.responseForm.controls['passingStatus'].setValue('Fail');
    }
  };

  public preFillData(obj) {
    let fields = ['passingStatus', 'obtainedTotalMarks', 'totalMarks', 'averagePercentage', 'evaluatedAnswerSheetUrl'];
    fields.forEach((element) => {
      this.responseForm.controls[element].setValue(obj[element]);
    })

    for (let i = 0; i < obj.questionsMarks.length; i++) {
      this.responseForm.get('questionMarks')['controls'][i]['controls']['questionNumber'].setValue(obj.questionsMarks[i]['questionNumber']);
      this.responseForm.get('questionMarks')['controls'][i]['controls']['marks'].setValue(obj.questionsMarks[i]['marks']);
    }
  }

  public triggerPDFViewer(obj) {
    setTimeout(() => {
      this.viewSDKClient.ready().then(() => {
        /* Invoke file preview */
        /* By default the embed mode will be Full Window */
        this.viewSDKClient.previewFile('pdf-div', {
          /* Pass the embed mode option here */
          // embedMode: 'IN_LINE'
        }, obj);
      });
    }, 2000);
  }

  // hit post api
  public saveResponse() {
    this.user.postExamEvaluationResponse(this.responseId, this.responseForm.value)
      .subscribe((res) => {
        this.router.navigate(['../view-exam-response', this.examId], { relativeTo: this.activatedRoute });
      })

  }

  public handleFileInput(e: any) {
    this.fileToUpload = e.files.item(0);
    if (this.fileToUpload)
      this.uploadQuestionPaper();
  }

  // upload pdf api
  public uploadQuestionPaper(callback?: any) {
    const uploadData = new FormData();
    uploadData.append('file', this.fileToUpload);
    this.user.uploadQuestionPaper(uploadData)
      .subscribe((res: any) => {
        this.responseForm.controls['evaluatedAnswerSheetUrl'].setValue(res.result.url);
        this.alertService.success('Data uploaded successfully');
        (callback) ? callback() : '';
      },
        (error) => this.alertService.error(error)

      );
  }

  // callback method for upload and post
  public updateResponse() {
    // this.uploadQuestionPaper(() => {
    //   this.saveResponse()
    // })
    this.saveResponse()
  }

  public fillOldData(obj) {
    let oldObj = {
      questionsMarks: [],
      obtainedTotalMarks: 0,
      totalMarks: 0,
      averagePercentage: '0%',
      evaluatedAnswerSheetUrl: '',
      passingStatus: ''
    }
    // question marks
    if (obj.questionsMarks.length) {
      obj.questionsMarks.forEach(element => {
        element.marks ?
          oldObj['questionsMarks'].push(
            {
              'questionNumber': element.questionNumber,
              'marks': element.marks
            }
          )
          :
          oldObj['questionsMarks'].push(
            {
              'questionNumber': element.questionNumber,
              'marks': 0
            }
          )
      });
    }
    // marks obtained
    obj.obtainedTotalMarks ? oldObj.obtainedTotalMarks = obj.obtainedTotalMarks : oldObj.obtainedTotalMarks = 0;
    // totalMarks
    obj.totalMarks ? oldObj.totalMarks = obj.totalMarks : oldObj.totalMarks = 0;
    // avg %
    obj.averagePercentage ? oldObj.averagePercentage = obj.averagePercentage : oldObj.averagePercentage = '0%';
    // ans sheet url
    obj.evaluatedAnswerSheetUrl ? oldObj.evaluatedAnswerSheetUrl = obj.evaluatedAnswerSheetUrl : oldObj.evaluatedAnswerSheetUrl = '';
    // status
    obj.passingStatus ? oldObj.passingStatus = obj.passingStatus : oldObj.passingStatus = '';
    this.responseForm.controls['oldData'].setValue(oldObj);
  }




}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-exam-evaluation',
  templateUrl: './edit-exam-evaluation.component.html',
  styleUrls: ['./edit-exam-evaluation.component.scss'],
})
export class EditExamEvaluationComponent implements OnInit {
  public examObj: any = null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log('my data', this.data);
  }

}

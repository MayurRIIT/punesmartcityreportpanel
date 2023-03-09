import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";

export interface DialogData {
  email: string;
}

@Component({
  selector: "app-pupup-form",
  templateUrl: "./pup-up-form.html",
  //   providers: [MatDialogModule]
})
export class PupupFormComponent {
  constructor(
    public dialogRef: MatDialogRef<PupupFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

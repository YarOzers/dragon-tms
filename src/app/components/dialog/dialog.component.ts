import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import {NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {MatFormField, MatInput, MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    FormsModule,
    FlexModule,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    MatDialogClose,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  projectForm: FormGroup;
  testPlanForm: FormGroup;
  folderForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectForm = this.fb.group({
      projectName: [this.data.projectName || '', [Validators.required, Validators.minLength(3)]]
    });
    this.testPlanForm = this.fb.group({
      testPlanName: [this.data.testPlanName || '', [Validators.required, Validators.minLength(3)]]
    });
    this.folderForm = this.fb.group({
      folderName: [this.data.folderName || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  getProjectErrorMessage() {
    const control = this.projectForm.get('projectName');
    if (control?.hasError('required')) {

      return 'Вы должны ввести название проекта';
    }
    if (control?.hasError('minlength')) {
      return 'Минимальная длина 3 символа';
    }
    return '';
  }

  getTestPlanErrorMessage() {
    const control = this.testPlanForm.get('testPlanName');
    if (control?.hasError('required')) {

      return 'Вы должны ввести название тест плана';
    }
    if (control?.hasError('minlength')) {
      return 'Минимальная длина 3 символа';
    }
    return '';
  }

  getFolderErrorMessage() {
    const control = this.folderForm.get('folderName');
    if (control?.hasError('required')) {

      return 'Вы должны ввести название папки';
    }
    if (control?.hasError('minlength')) {
      return 'Минимальная длина 3 символа';
    }
    return '';
  }

  save() {
    if (this.data.type === 'project') {
      this.addProject();
    } else if (this.data.type === 'test-plan') {
      this.addTestPlan();
    } else if (this.data.type === 'folder') {
      this.addFolder();
    } else {
      this.dialogRef.close();
    }

  }

  addProject() {
    if (this.projectForm.valid) {
      this.data.projectName = this.projectForm.get('projectName')?.value;
      console.log('addProject testPlanName : ', this.data.projectName);
      this.dialogRef.close(this.data.projectName);
    }
  }

  addTestPlan() {
    if (this.testPlanForm.valid) {
      this.data.testPlanName = this.testPlanForm.get('testPlanName')?.value;
      console.log('this.data.testPlanName: ', this.data.testPlanName);
      this.dialogRef.close(this.data.testPlanName);
    }
  }


  closeMatDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  private addFolder() {
    if (this.folderForm.valid) {
      this.data.folderName = this.folderForm.get('folderName')?.value;
      console.log('this.data.folderName: ', this.data.folderName);
      this.dialogRef.close(this.data.folderName);
    }
  }
}

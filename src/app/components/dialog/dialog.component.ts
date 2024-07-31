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
export class DialogComponent implements OnInit{
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      projectName: [this.data.projectName || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  getErrorMessage() {
    const control = this.form.get('projectName');
    if (control?.hasError('required')) {

      return 'Вы должны ввести название проекта';
    }
    if (control?.hasError('minlength')) {
      return 'Минимальная длина 3 символа';
    }
    return '';
  }

  saveProject() {
    if (this.form.valid) {
      this.data.projectName = this.form.get('projectName')?.value;
      console.log(this.data.projectName);
      this.dialogRef.close(this.data.projectName);
    }
  }

  closeMatDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}

import {Component, Inject} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf, NgSwitchCase} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {DialogComponent} from "../../dialog/dialog.component";
import {style} from "@angular/animations";

@Component({
  selector: 'app-create-test-case',
  standalone: true,
  host: {style:'--mdc-dialog-container-shape: 0px'},
  imports: [
    FlexModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    NgSwitchCase,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './create-test-case.component.html',
  styleUrl: './create-test-case.component.scss'
})
export class CreateTestCaseComponent {

  constructor(
    private dialogRef: MatDialogRef<CreateTestCaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  closeMatDialog() {
    this.dialogRef.close();
  }

  save() {

      this.dialogRef.close('43759235');

  }



  // EDITOR
  editors: number[] = [1, 2, 3]; // три текстовых редактора для примера
  activeEditor: HTMLElement | null = null;

  execCommand(command: string, value?: string | null) {
    if (this.activeEditor && value) {
      this.activeEditor.focus();
      document.execCommand(command, false, value);
    }
  }

  setActiveEditor(event: FocusEvent) {
    this.activeEditor = event.target as HTMLElement;
  }


  protected readonly prompt = prompt;
}

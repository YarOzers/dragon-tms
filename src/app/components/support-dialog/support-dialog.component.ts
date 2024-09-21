import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-support-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './support-dialog.component.html',
  styleUrl: './support-dialog.component.css'
})
export class SupportDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

}

import {Component, inject} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-role-info-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogContent,
    MatIcon
  ],
  templateUrl: './role-info-dialog.component.html',
  styleUrl: './role-info-dialog.component.css'
})
export class RoleInfoDialogComponent {

}

import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../../dialog/dialog.component";
import {FolderService} from "../../../../services/folder.service";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {TestCaseService} from "../../../../services/test-case.service";

@Component({
  selector: 'app-move-and-copy-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    NgIf,
    MatButton
  ],
  templateUrl: './move-and-copy-dialog.component.html',
  styleUrl: './move-and-copy-dialog.component.css'
})
export class MoveAndCopyDialogComponent implements OnInit, AfterViewInit {

  constructor(
    private folderService: FolderService,
    private testCaseService: TestCaseService,
    private dialogRef: MatDialogRef<MoveAndCopyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  closeMatDialog() {
    this.dialogRef.close()
  }


  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  move() {
    if (this.data.type === 'FOLDER') {
      const folderId = this.data.folderId;
      const targetFolderId = this.data.targetFolderId;
      this.folderService.moveFolder(folderId, targetFolderId).subscribe(folder => {
        console.log('Move folder::', folder);
        this.dialogRef.close(folder);
      })
    }
    if (this.data.type === 'TESTCASE') {
      const testCaseId = this.data.testCaseId;
      const targetFolderId = this.data.targetFolderId;
      this.testCaseService.moveTestCase(testCaseId, targetFolderId).subscribe(testCase => {
        console.log('Moved test case:: ', testCase.name);
        this.dialogRef.close(testCase);
      })
    }

  }

  copy() {
    if (this.data.type === 'FOLDER') {
      const folderId = this.data.folderId;
      const targetFolderId = this.data.targetFolderId;
      const isCopyFolder = true;
      this.folderService.copyFolder(folderId, targetFolderId).subscribe(folder => {
        console.log('Move folder::', folder);
        this.dialogRef.close(isCopyFolder);
      })
    }
    if (this.data.type === 'TESTCASE') {
      const testCaseId = this.data.testCaseId;
      const targetFolderId = this.data.targetFolderId;
      this.testCaseService.copyTestCase(testCaseId, targetFolderId).subscribe(testCase => {
        console.log('Moved test case:: ', testCase.name);
        this.dialogRef.close(testCase);
      })
    }
  }
}

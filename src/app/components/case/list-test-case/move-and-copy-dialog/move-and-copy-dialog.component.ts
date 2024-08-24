import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../../dialog/dialog.component";
import {FolderService} from "../../../../services/folder.service";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";

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
export class MoveAndCopyDialogComponent implements OnInit, AfterViewInit{

constructor(
  private folderService: FolderService,
  private dialogRef: MatDialogRef<MoveAndCopyDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) {
}
  closeMatDialog(){
    this.dialogRef.close()
  }


  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  moveFolder(){
  const folderId = this.data.folderId;
  const targetFolderId = this.data.targetFolderId;
    this.folderService.moveFolder(folderId, targetFolderId).subscribe(folder => {
      console.log('Move folder::', folder);
      this.dialogRef.close(folder);
    })
  }

}

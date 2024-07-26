import {Component, OnInit} from '@angular/core';
import {Folder} from "../../models/folder";
import {TestCase} from "../../models/test-case";
import {
  CdkDrag,
  CdkDragDrop, CdkDragEnd, CdkDragMove,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {KeyValuePipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-test-case-list',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    NgForOf,
    KeyValuePipe,
    NgClass,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './test-case-list.component.html',
  styleUrl: './test-case-list.component.css'
})
export class TestCaseListComponent implements OnInit{

  testCase1: TestCase = {
    id: 1,
    name: 'testcase 1',
    folder: 'folder 1'
  }
  testCase2: TestCase = {
    id: 2,
    name: 'testcase 2',
    folder: 'folder 1'
  }
  testCase3: TestCase = {
    id: 3,
    name: 'testcase 3',
    folder: 'folder 3'
  }
  testCase4: TestCase = {
    id: 4,
    name: 'testcase 4',
    folder: 'folder 3'
  }
  testCase5: TestCase = {
    id: 5,
    name: 'testcase 5',
    folder: 'folder 3'
  }
  testCase6: TestCase = {
    id: 6,
    name: 'testcase 6',
    folder: 'folder 4'
  }
  private folder5: Folder = {
    id: 5,
    parentFolderId: 4,
    name: 'folder 5',
    testCases: []
  }
  private folder4: Folder = {
    id: 4,
    name: 'folder 4',
    parentFolderId: 1,
    testCases: [this.testCase6],
    folders: [this.folder5]
  }
  private folder1: Folder = {
    id: 1,
    name: 'folder 1',
    folders: [this.folder4],
    testCases: [this.testCase1, this.testCase2]
  }

  private folder2: Folder = {
    id: 2,
    name: 'folder 2',
    testCases: [this.testCase3, this.testCase4]
  }

  private folder3: Folder = {
    id: 3,
    name: 'folder 3',
    testCases: [this.testCase5]
  }


  protected TEST_CASE_DATA: Folder[] = [this.folder1, this.folder2, this.folder3];
  testCasesMap: { [key: string]: TestCase[] } = {};

  ngOnInit(): void {
    this.generateTestCaseArrays();
  }

  private generateTestCaseArrays() {
    this.TEST_CASE_DATA.forEach(folder => {
      this.addTestCasesToMap(folder);
    });
    console.log('Test Cases Map after generation:', this.testCasesMap);
  }

  private addTestCasesToMap(folder: Folder) {
    if (folder.name) {
      this.testCasesMap[folder.name] = folder.testCases!;
      if (folder.folders) {
        folder.folders.forEach(subFolder => this.addTestCasesToMap(subFolder));
      }
    }
  }

  drop(event: CdkDragDrop<TestCase[]>, targetFolderName: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const testCase = event.previousContainer.data[event.previousIndex];
      testCase.folder = targetFolderName;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateTestCaseData();
    }
  }

  private updateTestCaseData() {
    this.TEST_CASE_DATA.forEach(folder => {
      this.syncFolderTestCases(folder);
    });
    console.log('Updated TEST_CASE_DATA:', this.TEST_CASE_DATA);
  }

  private syncFolderTestCases(folder: Folder) {
    if (folder.name) {
      folder.testCases = this.testCasesMap[folder.name];
      if (folder.folders) {
        folder.folders.forEach(subFolder => this.syncFolderTestCases(subFolder));
      }
    }
  }
}

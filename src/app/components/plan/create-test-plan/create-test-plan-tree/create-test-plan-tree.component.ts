import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TestCase} from "../../../../models/test-case";
import {ProjectService} from "../../../../services/project.service";
import {RouterParamsService} from "../../../../services/router-params.service";
import {Folder} from "../../../../models/folder";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-create-test-plan-tree',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatProgressBar,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    NgClass,
    MatMenuTrigger
  ],
  templateUrl: './create-test-plan-tree.component.html',
  styleUrl: './create-test-plan-tree.component.css'
})
export class CreateTestPlanTreeComponent implements OnInit, AfterViewInit {
  dataLoading: boolean = false;
  private projectId: number | null = 0;
  private testCases: TestCase[] = [];
  @Output() testCasesFromTree = new EventEmitter<any>();
  protected TEST_CASE_DATA: Folder[] | null = [];
  testCasesMap: { [key: string]: TestCase[] } = {};

  constructor(
    private projectService: ProjectService,
    private routerParamsService: RouterParamsService,
  ) {
    this.routerParamsService.projectId$.subscribe(id => {
      this.projectId = id;
    })
  }

  ngOnInit(): void {
    this.dataLoading = false;
    this.projectService.getProjectFolders(Number(this.projectId)).subscribe(folders => {
      console.log('getProjectFolders: ', folders);
      if (folders) {
        this.TEST_CASE_DATA = [...folders];
        this.generateTestCaseArrays();
        if (this.TEST_CASE_DATA) {
          this.TEST_CASE_DATA.forEach(folder => folder.expanded = true);
        }
      }
      console.log('TEST_CASE_DATA: ', this.TEST_CASE_DATA);
      this.dataLoading = true;
    });
  }

  sentTestCasesFromTree() {
    if (this.testCasesFromTree) {
      this.testCasesFromTree.emit(this.testCases)
    }

  }

  ngAfterViewInit(): void {

  }

  private generateTestCaseArrays() {
    console.log('GenerateTestCaseArray :', this.TEST_CASE_DATA);
    if (this.TEST_CASE_DATA) {
      this.TEST_CASE_DATA.forEach(folder => {
        this.addTestCasesToMap(folder);
      });
    }
    console.log('Test Cases Map after generation:', this.testCasesMap);
  }

  private addTestCasesToMap(folder: Folder) {
    console.log('addTestCaseToMap folder: ', folder);
    if (folder.name) {
      console.log('folder.name: ', folder.name);
      this.testCasesMap[folder.name] = folder.testCases!;
      console.log('testCaseMap: ', this.testCasesMap);
      if (folder.folders) {
        folder.folders.forEach(subFolder => this.addTestCasesToMap(subFolder));
        console.log('afterAdding Test cases to map: ', this.testCasesMap);
      }
    }
  }

  private syncFolderTestCases(folder: Folder) {
    if (folder.name) {
      folder.testCases = this.testCasesMap[folder.name];
      if (folder.folders) {
        folder.folders.forEach(subFolder => this.syncFolderTestCases(subFolder));
      }
    }
  }

  toggleFolder(folder: Folder, event: MouseEvent) {
    folder.expanded = !folder.expanded;
    (event.target as HTMLElement).blur();
  }

  getTestCases(folderId: number) {
    console.log('getTestCases WAs executed, folderId: ', folderId )
    if (this.projectId) {
      console.log('projectId: ', this.projectId);
      this.projectService.getTestCasesInFolder(+this.projectId, folderId).subscribe({
        next: (testCases) => {
          console.log('TestCases: ', testCases)
          this.testCases = testCases;
          this.sentTestCasesFromTree();
        },
        error: (err) => {
          console.error(`Ошибка при загрузке тест кейсов папки ${folderId}.`)
        }
      })
    }
  }

}

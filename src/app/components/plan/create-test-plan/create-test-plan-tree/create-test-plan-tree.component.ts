import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TestCase} from "../../../../models/test-case";
import {ProjectService} from "../../../../services/project.service";
import {RouterParamsService} from "../../../../services/router-params.service";
import {Folder} from "../../../../models/folder";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";

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
    MatMenuTrigger,
    MatCheckbox,
    MatButton
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

  // Хранение состояния чекбоксов
  selectedFolders: Set<number> = new Set();
  selectedTestCases: Set<number> = new Set();

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
      if (folders) {
        this.TEST_CASE_DATA = [...folders];
        this.generateTestCaseArrays();
        if (this.TEST_CASE_DATA) {
          this.TEST_CASE_DATA.forEach(folder => folder.expanded = true);
        }
      }
      this.dataLoading = true;
    });
  }

  sentTestCasesFromTree() {
    if (this.testCasesFromTree) {
      this.testCasesFromTree.emit(this.testCases)
    }
  }

  ngAfterViewInit(): void {}

  private generateTestCaseArrays() {
    if (this.TEST_CASE_DATA) {
      this.TEST_CASE_DATA.forEach(folder => {
        this.addTestCasesToMap(folder);
      });
    }
  }

  private addTestCasesToMap(folder: Folder) {
    if (folder.name) {
      this.testCasesMap[folder.name] = folder.testCases!;
      if (folder.folders) {
        folder.folders.forEach(subFolder => this.addTestCasesToMap(subFolder));
      }
    }
  }

  toggleFolder(folder: Folder, event: MouseEvent) {
    folder.expanded = !folder.expanded;
    (event.target as HTMLElement).blur();
  }

  getTestCases(folderId: number) {
    if (this.projectId) {
      this.projectService.getTestCasesInFolder(+this.projectId, folderId).subscribe({
        next: (testCases) => {
          this.testCases = testCases;
          this.sentTestCasesFromTree();
        },
        error: (err) => {
          console.error(`Ошибка при загрузке тест кейсов папки ${folderId}.`)
        }
      })
    }
  }

  // Функции для обработки состояния чекбоксов
  isFolderChecked(folder: Folder): boolean {
    return this.areAllTestCasesChecked(folder) &&
      ((folder.folders?? []).filter(subFolder => !this.isFolderCheckboxDisabled(subFolder)).every(subFolder => this.isFolderChecked(subFolder)) ?? false);
  }

  isFolderIndeterminate(folder: Folder): boolean {
    const someCasesChecked = this.areSomeTestCasesChecked(folder);
    const someFoldersChecked = ((folder.folders?? []).filter(subFolder => !this.isFolderCheckboxDisabled(subFolder)).some(subFolder => this.isFolderChecked(subFolder) || this.isFolderIndeterminate(subFolder)) ?? false);
    return (someCasesChecked || someFoldersChecked) && !this.isFolderChecked(folder);
  }

  isFolderCheckboxDisabled(folder: Folder): boolean {
    // Чекбокс блокируется, если в папке и всех её дочерних папках нет тест-кейсов
    return !this.hasTestCasesOrSubFoldersWithTestCases(folder);
  }

  private hasTestCasesOrSubFoldersWithTestCases(folder: Folder): boolean {
    if (this.testCasesMap[folder.name]?.length > 0) {
      return true;
    }
    return folder.folders?.some(subFolder => this.hasTestCasesOrSubFoldersWithTestCases(subFolder)) ?? false;
  }

  areAllTestCasesChecked(folder: Folder): boolean {
    return this.testCasesMap[folder.name]?.every(tc => this.selectedTestCases.has(tc.id)) ?? false;
  }

  areSomeTestCasesChecked(folder: Folder): boolean {
    return this.testCasesMap[folder.name]?.some(tc => this.selectedTestCases.has(tc.id)) ?? false;
  }

  areAllSubFoldersChecked(folder: Folder): boolean {
    return ((folder.folders?? []).every(subFolder => this.isFolderChecked(subFolder)) ?? false);
  }

  areSomeSubFoldersChecked(folder: Folder): boolean {
    return folder.folders?.some(subFolder => this.isFolderChecked(subFolder) || this.isFolderIndeterminate(subFolder)) ?? false;
  }

  toggleFolderCheckbox(folder: Folder, event: MatCheckboxChange) {
    if (event.checked) {
      this.selectFolderAndContents(folder);
    } else {
      this.deselectFolderAndContents(folder);
    }
  }

  toggleTestCaseCheckbox(folder: Folder, testCase: TestCase, event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedTestCases.add(testCase.id);
    } else {
      this.selectedTestCases.delete(testCase.id);
    }
  }

  selectFolderAndContents(folder: Folder) {
    this.selectedFolders.add(folder.id);
    this.testCasesMap[folder.name]?.forEach(tc => this.selectedTestCases.add(tc.id));
    folder.folders?.forEach(subFolder => this.selectFolderAndContents(subFolder));
  }

  deselectFolderAndContents(folder: Folder) {
    this.selectedFolders.delete(folder.id);
    this.testCasesMap[folder.name]?.forEach(tc => this.selectedTestCases.delete(tc.id));
    folder.folders?.forEach(subFolder => this.deselectFolderAndContents(subFolder));
  }

  getSelectedIds() {
    console.log("This selected foldersIds::", Array.from(this.selectedFolders));
    console.log("This selected testCaseIds::", Array.from(this.selectedTestCases));
    return {
      folders: Array.from(this.selectedFolders),
      testCases: Array.from(this.selectedTestCases)
    };
  }

  isTestCaseChecked(testCase: TestCase): boolean {
    return this.selectedTestCases.has(testCase.id);
  }
}


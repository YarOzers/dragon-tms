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
import {FormsModule} from "@angular/forms";

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
    MatButton,
    FormsModule
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
    console.log('getGEtstCases')
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

// Проверка состояния чекбоксов
  isFolderChecked(folder: Folder): boolean {
    return folder.selected || false;
  }

  isFolderIndeterminate(folder: Folder): boolean {
    const someCasesChecked = this.areSomeTestCasesChecked(folder);
    const someFoldersChecked = (folder.folders ?? []).some(subFolder => this.isFolderChecked(subFolder) || this.isFolderIndeterminate(subFolder));
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
    return this.testCasesMap[folder.name]?.every(tc => tc.selected) ?? false;
  }

  areSomeTestCasesChecked(folder: Folder): boolean {
    return this.testCasesMap[folder.name]?.some(tc => tc.selected) ?? false;
  }

// Изменение состояния чекбоксов
  toggleFolderCheckbox(folder: Folder, event: MatCheckboxChange) {
    if (folder.selected === null) {
      folder.selected = true; // Все выбрано
    } else if (folder.selected) {
      folder.selected = false; // Ничего не выбрано
    } else {
      folder.selected = null; // Частично выбрано
    }
    this.selectOrDeselectFolderAndContents(folder, folder.selected);
  }

  toggleTestCaseCheckbox(folder: Folder, testCase: TestCase, event: MatCheckboxChange) {
    testCase.selected = event.checked;
    this.syncTreeSelectionWithPartialSelection();
  }

  selectOrDeselectFolderAndContents(folder: Folder, select: boolean | null) {
    if (select === null) {
      return; // Не изменяем состояния, если select null
    }
    folder.selected = select;
    this.testCasesMap[folder.name]?.forEach(tc => tc.selected = select);
    folder.folders?.forEach(subFolder => this.selectOrDeselectFolderAndContents(subFolder, select));
  }


  getSelectedIds() {
    const selectedFolders = this.TEST_CASE_DATA?.filter(folder => folder.selected).map(folder => folder.id) || [];
    const selectedTestCases = Object.values(this.testCasesMap).flat().filter(tc => tc.selected).map(tc => tc.id) || [];
    console.log("Selected foldersIds:", selectedFolders);
    console.log("Selected testCaseIds:", selectedTestCases);
    return {
      folders: selectedFolders,
      testCases: selectedTestCases
    };
  }

  private findFolderContainingTestCase(testCase: TestCase): Folder | null {
    for (const folderName in this.testCasesMap) {
      const testCasesInFolder = this.testCasesMap[folderName];
      if (testCasesInFolder.some(tc => tc.id === testCase.id)) {
        return this.findFolderByName(folderName, this.TEST_CASE_DATA!);
      }
    }
    return null;
  }

  private findFolderByName(folderName: string, folders: Folder[]): Folder | null {
    for (const folder of folders) {
      if (folder.name === folderName) {
        return folder;
      }
      const foundInSubFolder = this.findFolderByName(folderName, folder.folders || []);
      if (foundInSubFolder) {
        return foundInSubFolder;
      }
    }
    return null;
  }

  syncTreeSelectionWithPartialSelection() {
    this.TEST_CASE_DATA?.forEach(folder => {
      folder.selected = this.areAllTestCasesChecked(folder) || this.areSomeTestCasesChecked(folder);
    });
  }

}


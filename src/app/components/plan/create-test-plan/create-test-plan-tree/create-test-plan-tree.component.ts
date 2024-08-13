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
  selectedFolder: Folder | null = null;
  dataLoading: boolean = false;
  private projectId: number | null = 0;
  private testCases: TestCase[] = [];
  @Output() testCasesFromTree = new EventEmitter<any>();
  public TEST_CASE_DATA: Folder[] | null = [];
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
        this.initializeTreeSelection(this.TEST_CASE_DATA);
      }
      this.dataLoading = true;
    });
  }

  initializeTreeSelection(folders: Folder[]): void {
    folders.forEach(folder => {
      this.deselectFolderAndContents(folder);
    });
    console.log('Tree initialized. All selections set to false.');
  }

  private deselectFolderAndContents(folder: Folder): void {
    folder.selected = false;
    console.log(`Folder ${folder.name} deselected.`);

    // Устанавливаем значение `selected` для всех тест-кейсов в папке
    folder.testCases.forEach(testCase => {
      testCase.selected = false;
      console.log(`TestCase ${testCase.id} in Folder ${folder.name} deselected.`);
    });

    // Рекурсивно обрабатываем вложенные папки
    folder.folders?.forEach(subFolder => {
      this.deselectFolderAndContents(subFolder);
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
    this.selectedFolder = this.findFolderById(folderId, this.TEST_CASE_DATA!);
    if (this.projectId) {
      this.projectService.getTestCasesInFolder(+this.projectId, folderId).subscribe({
        next: (testCases) => {
          testCases.forEach(newTestCase => {
            const existingTestCase = this.testCases.find(tc => tc.id === newTestCase.id);
            if (existingTestCase) {
              newTestCase.selected = existingTestCase.selected;
            }
          });
          this.testCases = testCases;
          this.sentTestCasesFromTree();
        },
        error: (err) => {
          console.error(`Ошибка при загрузке тест кейсов папки ${folderId}.`)
        }
      });
    }
  }

  private findFolderById(id: number, folders: Folder[]): Folder | null {
    for (const folder of folders) {
      if (folder.id === id) {
        return folder;
      }
      const found = this.findFolderById(id, folder.folders || []);
      if (found) {
        return found;
      }
    }
    return null;
  }

  updateCheckboxForFolder(folder: Folder | null, isChecked: boolean | null) {
    if (folder) {
      folder.selected = isChecked;
      folder.testCases.forEach(testCase => testCase.selected = isChecked);
      folder.folders?.forEach(subFolder => this.updateCheckboxForFolder(subFolder, isChecked));
    }
  }

// Проверка состояния чекбоксов
  // Определяем, отмечена ли папка (все элементы внутри папки отмечены)
  isFolderChecked(folder: Folder): boolean {
    const allTestCasesChecked = this.areAllTestCasesChecked(folder);
    const allFoldersChecked = (folder.folders ?? []).every(subFolder => this.isFolderChecked(subFolder));
    return allTestCasesChecked && allFoldersChecked;
  }


  // Определяем, находится ли папка в промежуточном состоянии (отмечены только некоторые элементы внутри папки)
  isFolderIndeterminate(folder: Folder): boolean {
    const someTestCasesChecked = this.areSomeTestCasesChecked(folder);
    const someFoldersIndeterminate = (folder.folders ?? []).some(subFolder => this.isFolderIndeterminate(subFolder));
    const someFoldersChecked = (folder.folders ?? []).some(subFolder => this.isFolderChecked(subFolder));
    return (someTestCasesChecked || someFoldersChecked || someFoldersIndeterminate) && !this.isFolderChecked(folder);
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

  // Проверяем, выбраны ли все тест-кейсы в папке
  areAllTestCasesChecked(folder: Folder): boolean {
    return this.testCasesMap[folder.name]?.every(tc => tc.selected === true) ?? false;
  }

  // Проверяем, выбраны ли некоторые тест-кейсы в папке
  areSomeTestCasesChecked(folder: Folder): boolean {
    return this.testCasesMap[folder.name]?.some(tc => tc.selected === true) ?? false;
  }


// Изменение состояния чекбоксов
  // Изменение состояния чекбоксов папок
  toggleFolderCheckbox(folder: Folder, event: MatCheckboxChange) {
    const newValue = event.checked ? true : (this.isFolderIndeterminate(folder) ? null : false);

    // Обновляем состояние папки и всех вложенных объектов
    this.selectOrDeselectFolderAndContents(folder, newValue);
    // Синхронизируем состояние родительских папок (если есть) после изменения состояния
    this.updateParentFoldersState(folder);
  }

  // Обновляем состояние родительских папок на основе состояний дочерних
  updateParentFoldersState(folder: Folder) {
    const parentFolder = this.findParentFolder(this.TEST_CASE_DATA!, folder);
    if (parentFolder) {
      const allSelected = this.isFolderChecked(parentFolder);
      const indeterminate = this.isFolderIndeterminate(parentFolder);

      parentFolder.selected = allSelected ? true : (indeterminate ? null : false);
      this.updateParentFoldersState(parentFolder);
    }
  }

  // Поиск родительской папки для данной папки
  findParentFolder(folders: Folder[], targetFolder: Folder): Folder | null {
    for (const folder of folders) {
      if ((folder.folders ?? []).some(subFolder => subFolder.id === targetFolder.id)) {
        return folder;
      }
      const foundParent = this.findParentFolder(folder.folders ?? [], targetFolder);
      if (foundParent) {
        return foundParent;
      }
    }
    return null;
  }

  toggleTestCaseCheckbox(folder: Folder, testCase: TestCase, event: MatCheckboxChange) {
    testCase.selected = event.checked;
    this.syncTreeSelectionWithPartialSelection();
  }

  // Рекурсивно обновляем состояние всех дочерних элементов (папок и тест-кейсов)
  selectOrDeselectFolderAndContents(folder: Folder, select: boolean | null) {
    folder.selected = select;
    this.testCasesMap[folder.name]?.forEach(tc => tc.selected = select);
    folder.folders?.forEach(subFolder => this.selectOrDeselectFolderAndContents(subFolder, select));
  }


  getSelectedIds() {
console.log(this.TEST_CASE_DATA)
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
      const allSelected = this.areAllTestCasesChecked(folder);
      const indeterminate = this.areSomeTestCasesChecked(folder) ||
        (folder.folders ?? []).some(subFolder => subFolder.selected === true || subFolder.selected === null);

      // Если все выбраны, устанавливаем selected = true
      if (allSelected) {
        folder.selected = true;
      }
      // Если есть промежуточное состояние, устанавливаем null
      else if (indeterminate) {
        folder.selected = null;
      }
      // Если ничего не выбрано, устанавливаем false
      else {
        folder.selected = false;
      }

      console.log(`syncTreeSelectionWithPartialSelection: folder ${folder.name} selected = ${folder.selected}, indeterminate = ${indeterminate}`);
    });
  }



}


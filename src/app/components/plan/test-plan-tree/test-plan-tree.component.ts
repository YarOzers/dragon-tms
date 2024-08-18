import {Component, EventEmitter, Output} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {TestCase} from "../../../models/test-case";
import {ProjectService} from "../../../services/project.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {MatDialog} from "@angular/material/dialog";
import {Folder} from "../../../models/folder";
import {DialogComponent} from "../../dialog/dialog.component";
import {CreateTestCaseComponent} from "../../case/create-test-case/create-test-case.component";

@Component({
  selector: 'app-test-plan-tree',
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
  templateUrl: './test-plan-tree.component.html',
  styleUrl: './test-plan-tree.component.scss'
})
export class TestPlanTreeComponent {
  dataLoading: boolean = false;
  private projectId: number | null = 0;
  private testCases: TestCase[] = [];
  @Output() testCasesFromTestPlanTree = new EventEmitter<any>();
  private testPlanId: number | null = null;

  constructor(
    private projectService: ProjectService,
    private routerParamsService: RouterParamsService,
    private dialog: MatDialog
  ) {
    this.routerParamsService.projectId$.subscribe(id => {
      this.projectId = id;
    });
    this.routerParamsService.testPlanId$.subscribe(testPlanId =>{
      this.testPlanId = testPlanId;
    });
  }

  protected TEST_CASE_DATA: Folder[] | null = [];

  testCasesMap: { [key: string]: TestCase[] } = {};


  ngOnInit(): void {

    this.dataLoading = false;
    console.log('ProjectId::', this.projectId);
    console.log('TestPlanId::', this.testPlanId);
    this.projectService.getTestPlanFolders(Number(this.projectId), Number(this.testPlanId)).subscribe(folders => {
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
    if (this.testCasesFromTestPlanTree) {
      this.testCasesFromTestPlanTree.emit(this.testCases)
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
      if (folder.childFolders) {
        folder.childFolders.forEach(subFolder => this.addTestCasesToMap(subFolder));
        console.log('afterAdding Test cases to map: ', this.testCasesMap);
      }
    }
  }

  private updateTestCaseData() {
    if (this.TEST_CASE_DATA) {
      this.TEST_CASE_DATA.forEach(folder => {
        this.syncFolderTestCases(folder);
      });
    }
    console.log('Updated TEST_CASE_DATA:', this.TEST_CASE_DATA);
  }

  private syncFolderTestCases(folder: Folder) {
    if (folder.name) {
      folder.testCases = this.testCasesMap[folder.name];
      if (folder.childFolders) {
        folder.childFolders.forEach(subFolder => this.syncFolderTestCases(subFolder));
      }
    }
  }

  onDrop(event: CdkDragDrop<any[]>, type: string, targetId: any) {
    if (type === 'testCase' && event.item.data.type === 'testCase') {
      this.dropTestCase(event, targetId);
    } else if (type === 'folder' && event.item.data.type === 'folder') {
      this.dropFolder(event, targetId);
    }
  }

  dropTestCase(event: CdkDragDrop<TestCase[]>, targetFolderName: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const testCase = event.previousContainer.data[event.previousIndex];
      testCase.folderName = targetFolderName;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateTestCaseData();
    }
  }

  moveFolder(event: CdkDragDrop<Folder[]>, targetFolderId: number) {
    if (event.item.data.id === 0) {
      console.log("ОШИБКА: Нельзя переместить корневую папку!!!")
      return;
    }
    console.log('eventFolderId: ', event.item.data.id);
    console.log('targetFolderId: ', targetFolderId);
    const currentFolderId = event.item.data.id;
    let sourceFolder: Folder | undefined;
    let targetFolder: Folder | undefined;

    const findFolders = (folders: Folder[] | null, parentFolder: Folder | null = null) => {
      for (let folder of folders ?? []) {
        if (folder.id === currentFolderId) {
          sourceFolder = folder;
          if (parentFolder) {
            if (parentFolder.childFolders) {
              parentFolder.childFolders = parentFolder.childFolders.filter(f => f.id !== currentFolderId);
            }
          } else {
            if (this.TEST_CASE_DATA) {
              this.TEST_CASE_DATA = this.TEST_CASE_DATA.filter(f => f.id !== currentFolderId);
            }
          }
        }
        if (folder.id === targetFolderId) {
          targetFolder = folder;
        }
        if (folder.childFolders) {
          findFolders(folder.childFolders, folder);
        }
      }
    };

    findFolders(this.TEST_CASE_DATA);

    if (sourceFolder && targetFolder) {
      if (!targetFolder.childFolders) {
        targetFolder.childFolders = [];
      }
      targetFolder.childFolders.push(sourceFolder);

      console.log('TEST_CASE_DATA after moveFolder: ', this.TEST_CASE_DATA);
    }
  }

  toggleFolder(folder: Folder, event: MouseEvent) {
    folder.expanded = !folder.expanded;
    (event.target as HTMLElement).blur();
  }

  dropFolder(event: CdkDragDrop<Folder[]>, targetFolderId: number) {
    this.checkNestedFoldersForId(event, targetFolderId);

  }

  checkNestedFoldersForId(event: CdkDragDrop<Folder[]>, targetFolderId: number): void {
    const sourceFolderId = event.item.data.id;
    if (sourceFolderId === targetFolderId) {
      console.log("Нельзя переместиться в ту же папку");
      return
    }
    const findFolderById = (folders: Folder[] | null, id: number): Folder | undefined => {
      if (folders) {
        for (let folder of folders) {
          if (folder.id === id) {
            return folder;
          }
          if (folder.childFolders) {
            const nestedFolder = findFolderById(folder.childFolders, id);
            if (nestedFolder) {
              return nestedFolder;
            }
          }
        }
      }
      return undefined;

    };


    const checkForNestedId = (folders: Folder[], id: number): boolean => {
      for (let folder of folders) {
        if (folder.id === id) {
          return true;
        }
        if (folder.childFolders) {
          if (checkForNestedId(folder.childFolders, id)) {
            return true;
          }
        }
      }
      return false;
    };

    const sourceFolder = findFolderById(this.TEST_CASE_DATA, sourceFolderId);
    if (!sourceFolder) {
      console.error(`Source folder with id ${sourceFolderId} not found.`);
      return;
    }

    if (checkForNestedId(sourceFolder.childFolders || [], targetFolderId)) {
      console.log('Error: Target folder ID found within the nested folders of the source folder.');

    } else {
      console.log('No nested folder with the target ID found within the source folder.');
      this.moveFolder(event, targetFolderId);
    }
  }

  addFolder(parentFolderId: number) {

  }

  openDialogToAddFolder(folderId: number): void {

    const dialogRef = this.dialog.open(DialogComponent, {

      width: 'auto',
      data: {
        type: 'folder',
        folderName: ''
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== '') {
        console.log('полученное имя из формы: ', result)
        console.log('Id проекта: ', this.projectId)
        console.log('Id папки: ', folderId)


        this.projectService.addFolder(this.projectId, folderId, result);
        this.ngOnInit();
      } else {
        console.log("Введите имя папки!!!")
      }
    });
  }


  openDialogToDeleteFolder(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {

      width: 'auto',
      data: {
        type: 'folder-del',
        del: false
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("from delFolder in dialog :", result);
        this.projectService.deleteFolder(this.projectId, id).subscribe(folders => {
        });
      }
    });
  }

  openDialogToCreateTestCase(folderId: number, folderName: string): void {

    const dialogRef = this.dialog.open(CreateTestCaseComponent, {

      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        type: 'folder',
        folderId: folderId,
        isNew: true
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(testCase => {
      if (testCase !== undefined && testCase !== '') {
        testCase.data.folderId = folderId;
        testCase.data.folderName = folderName;
        console.log('RESULT from dialog: ', testCase);
        this.projectService.addTestCase(this.projectId!, folderId, testCase);
        this.getTestCases(folderId);
        this.ngOnInit();


      } else {
        console.log("Ошибка при сохранении тест кейса!!!")
      }
    });
  }

  getTestCases(folderId: number) {
    console.log('getTestCases WAs executed, folderId: ', folderId )
    if (this.projectId && this.testPlanId) {
      console.log('projectId: ', this.projectId);
      this.projectService.getTestCasesInTestPlanFolder(+this.projectId,this.testPlanId, folderId).subscribe({
        next: (testCases) => {
          console.log('TestCases: ', testCases)
          this.testCases = testCases;
          this.sentTestCasesFromTree();
        },
        error: (err) => {
          console.error(`Ошибка при загрузке тест кейсов папки ${folderId}.`)
        }
      })
    }else {
      console.error(`В проекте ${this.testPlanId} не найдена папка с id ${this.testPlanId}`)
    }
  }
}

import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {Folder} from "../../models/folder";
import {TestCase} from "../../models/test-case";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ProjectService} from "../../services/project.service";
import {RouterParamsService} from "../../services/router-params.service";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {CreateTestCaseComponent} from "../case/create-test-case/create-test-case.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {DialogTestPlanListComponent} from "../plan/dialog-test-plan-list/dialog-test-plan-list.component";


@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [
    CdkDropListGroup,
    NgForOf,
    NgTemplateOutlet,
    NgClass,
    CdkDropList,
    CdkDrag,
    MatIconButton,
    MatIcon,
    NgIf,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatProgressBar
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent implements OnInit, AfterViewInit {
  dataLoading: boolean = false;
  private projectId: number | null = 0;
  private testCases: TestCase[] = [];
  @Output() testCasesFromTree = new EventEmitter<any>();

  constructor(
    private projectService: ProjectService,
    private routerParamsService: RouterParamsService,
    private dialog: MatDialog
  ) {
    this.routerParamsService.projectId$.subscribe(id => {
      this.projectId = id;
    })
  }

  protected TEST_CASE_DATA: Folder[] | null = [];

  testCasesMap: { [key: string]: TestCase[] } = {};


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
      if (folder.folders) {
        folder.folders.forEach(subFolder => this.syncFolderTestCases(subFolder));
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
            if (parentFolder.folders) {
              parentFolder.folders = parentFolder.folders.filter(f => f.id !== currentFolderId);
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
        if (folder.folders) {
          findFolders(folder.folders, folder);
        }
      }
    };

    findFolders(this.TEST_CASE_DATA);

    if (sourceFolder && targetFolder) {
      if (!targetFolder.folders) {
        targetFolder.folders = [];
      }
      targetFolder.folders.push(sourceFolder);

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
          if (folder.folders) {
            const nestedFolder = findFolderById(folder.folders, id);
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
        if (folder.folders) {
          if (checkForNestedId(folder.folders, id)) {
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

    if (checkForNestedId(sourceFolder.folders || [], targetFolderId)) {
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


        this.projectService.addFolder(Number(this.projectId), folderId, result);
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
    console.log('FolderId ::', folderId);
    console.log('FolderName ::', folderName);

    const dialogRef = this.dialog.open(CreateTestCaseComponent, {

      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        type: 'folder',
        folderId: folderId,
        folderName: folderName,
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

  openDialogToAddFolderInTestPlan(folderId: number , folderName: string) {
    console.log('openDialog was executed!!!, folderId:: ', folderId);
    console.log('openDialog was executed!!!, folderId:: ', folderName);
      const dialogRef = this.dialog.open(DialogTestPlanListComponent, {

        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        data: {
          type: 'folder',
          folderId: folderId,
          folderName: folderName

        } // Можно передать данные в диалоговое окно
      });

      dialogRef.afterClosed().subscribe(testPlanId => {
        if(testPlanId && folderId && this.projectId){
          this.projectService.addFolderToTestPlan(Number(this.projectId), testPlanId,folderId).subscribe(folder=>{
            console.log(`Папка ${folder.name} была добавлена в тест план ${testPlanId}`)
          })
        }

      });
    }
}


//   if(event.item.data.id === 0){
//   console.log("ОШИБКА: Нельзя переместить корневую папку!!!")
//   return;
// }

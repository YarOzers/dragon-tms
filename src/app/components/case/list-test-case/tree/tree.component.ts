import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {Folder, FolderDTO} from "../../../../models/folder";
import {TestCase} from "../../../../models/test-case";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ProjectService} from "../../../../services/project.service";
import {RouterParamsService} from "../../../../services/router-params.service";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {DialogComponent} from "../../../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {CreateTestCaseComponent} from "../../create-test-case/create-test-case.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {DialogTestPlanListComponent} from "../../../plan/dialog-test-plan-list/dialog-test-plan-list.component";
import {FolderService} from "../../../../services/folder.service";
import {TestCaseService} from "../../../../services/test-case.service";


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
    private folderService: FolderService,
    private testCaseService: TestCaseService,
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
    this.folderService.getProjectFolders(Number(this.projectId)).subscribe(folders => {
      if (folders) {
        this.TEST_CASE_DATA = [...folders];
        this.generateTestCaseArrays();
        if (this.TEST_CASE_DATA) {
          this.TEST_CASE_DATA.forEach(folder => folder.expanded = true);
        }
      }
      this.dataLoading = true;
      console.log("TEST_CASE_DATa::", this.TEST_CASE_DATA);
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
    if (this.TEST_CASE_DATA) {
      this.TEST_CASE_DATA.forEach(folder => {
        this.addTestCasesToMap(folder);
      });
    }
  }

  private addTestCasesToMap(folder: Folder) {
    if (folder.name) {
      this.testCasesMap[folder.name] = folder.testCases!;
      if (folder.childFolders) {
        folder.childFolders.forEach(subFolder => this.addTestCasesToMap(subFolder));
      }
    }
  }

  private updateTestCaseData() {
    if (this.TEST_CASE_DATA) {
      this.TEST_CASE_DATA.forEach(folder => {
        this.syncFolderTestCases(folder);
      });
    }
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

  openDialogToAddFolder(parentFolderId: number): void {
    console.log("FolderId::::", parentFolderId);

    const dialogRef = this.dialog.open(DialogComponent, {

      width: 'auto',
      data: {
        type: 'folder',
        folderName: '',
        parentFolderId: parentFolderId
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== '') {
        console.log('полученное имя из формы: ', result)
        console.log('Id проекта: ', this.projectId)
        console.log('Id папки: ', parentFolderId)
        const folderDto: FolderDTO = {
          name: result as string,
          type: 0,
          projectId: Number(this.projectId)
        }
        console.log(`Folder, parentFolderId ${parentFolderId} , folderDto:: ${folderDto}`);
        this.folderService.addChildFolder(parentFolderId, folderDto).subscribe(
          folder=>{
            console.log(`Folder, parentFolderId ${parentFolderId} , folder:: ${folder}`);
          }
        );
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
        folderId: folderId,
        folderName: folderName,
        isNew: true,
        type: "testCase"
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(testCase => {
      if (testCase !== undefined && testCase !== '') {
        testCase.data.folderId = folderId;
        testCase.data.folderName = folderName;
        console.log('RESULT from openDialogToCreateTestCase: ', testCase);
        this.testCaseService.addTestCaseToFolder(folderId, testCase);
        this.getTestCases(folderId);
        this.ngOnInit();


      } else {
        console.log("Ошибка при сохранении тест кейса!!!")
      }
    });
  }

  getTestCases(folderId: number) {
    console.log('getTestCases WAs executed, folderId: ', folderId)
    if (this.projectId) {
      this.testCaseService.getTestCasesInFolder(folderId).subscribe({
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

  openDialogToAddFolderInTestPlan(folderId: number, folderName: string) {
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
      if (testPlanId && folderId && this.projectId) {
        this.projectService.addFolderToTestPlan(Number(this.projectId), testPlanId, folderId).subscribe(folder => {
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
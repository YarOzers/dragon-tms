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
import {ActivatedRoute} from "@angular/router";
import {MoveAndCopyDialogComponent} from "../move-and-copy-dialog/move-and-copy-dialog.component";


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
  private testCases: Folder[] = [];
  @Output() testCasesFromTree = new EventEmitter<any>();

  constructor(
    private projectService: ProjectService,
    private folderService: FolderService,
    private testCaseService: TestCaseService,
    private routerParamsService: RouterParamsService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    // this.routerParamsService.projectId$.subscribe(id => {
    //   this.projectId = id;
    // })

    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    if (!this.projectId) {
      this.routerParamsService.projectId$.subscribe(projectId => {
        this.projectId = projectId;
      })
    }
    this.routerParamsService.setProjectId(this.projectId);

  }

  protected TEST_CASE_DATA: Folder[] | null = [];

  testCasesMap: { [key: number]: TestCase[] } = {};


  ngOnInit(): void {
    this.dataLoading = false;
    this.getProjectFolders();
  }

  findRootFolderId(folders: Folder[]): number | null {
    for (const folder of folders) {
      if (folder.parentFolderId === null) {
        return folder.id;
      }
    }
    return null;
  }

  getProjectFolders() {
    this.folderService.getProjectFolders(Number(this.projectId)).subscribe(folders => {
      if (folders) {
        console.log("FOLDERS:::", folders);
        this.TEST_CASE_DATA = [...folders];
        this.generateTestCaseArrays();
        if (this.TEST_CASE_DATA) {
          this.TEST_CASE_DATA.forEach(folder => folder.expanded = true);
        }
      }
      this.dataLoading = true;
      console.log("TEST_CASE_DATa::", this.TEST_CASE_DATA);
    }, (error) => {
      console.error("Ошибка загрузки тест-кейсов", error)
    }, () => {
      if (this.TEST_CASE_DATA) {
        this.setExpandedTrue(this.TEST_CASE_DATA);
        this.getTestCases(Number(this.findRootFolderId(this.TEST_CASE_DATA)));
      }
    });
  }

  setExpandedTrue(folders: Folder[] | undefined): void {
    if (folders) {
      for (const folder of folders) {
        // Устанавливаем expanded: true для текущей папки
        folder.expanded = true;

        // Рекурсивно вызываем функцию для дочерних папок
        if (!(folder.childFolders) || folder.childFolders.length > 0) {
          this.setExpandedTrue(folder.childFolders);
        }
      }
    }

  }

  setChildrenExpandedTrue(folders: Folder[] | undefined, targetFolderId: number): boolean {
    if (folders) {
      for (const folder of folders) {
        // Если текущая папка имеет совпадающий id, устанавливаем expanded для ее дочерних папок
        if (folder.id === targetFolderId) {
          this.expandChildren(folder.childFolders);
          return true;  // Папка найдена и обработана
        }

        // Рекурсивно проходим по дочерним папкам
        if (!(folder.childFolders) || folder.childFolders.length > 0) {
          const found = this.setChildrenExpandedTrue(folder.childFolders, targetFolderId);
          if (found) return true;  // Останавливаем поиск, если папка уже найдена
        }
      }
    }


    return false;  // Если папка не найдена
  }

  expandChildren(childFolders: Folder[] | undefined): void {
    if (childFolders) {
      for (const child of childFolders) {
        child.expanded = true;  // Устанавливаем expanded: true для дочерних папок

        // Рекурсивно вызываем для вложенных дочерних папок
        if (!(child.childFolders) || child.childFolders.length > 0) {
          this.expandChildren(child.childFolders);
        }
      }
    }

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
    if (folder.id) {
      this.testCasesMap[folder.id] = folder.testCases!;
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
    if (folder.id) {
      folder.testCases = this.testCasesMap[folder.id];
      if (folder.childFolders) {
        folder.childFolders.forEach(subFolder => this.syncFolderTestCases(subFolder));
      }
    }
  }

  onDrop(event: CdkDragDrop<any[]>, type: string, targetId: any, targetFolderName: string) {
    console.log('TYpe::', type);
    console.log('TargetId::', targetId);
    console.log("eventTarget::  ", event.item.data.type);
    if (type === 'testCase' && event.item.data.type === 'TESTCASE') {
      this.dropTestCase(event, targetId, targetFolderName);
    } else if (type === 'folder' && event.item.data.type === 'FOLDER') {
      if (targetFolderName) {
        this.dropFolder(event, targetId, targetFolderName);
      }

    }
  }

  dropTestCase(event: CdkDragDrop<TestCase[]>, targetId: number, targetFolderName: string,) {
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
      this.openMoveTestCaseDialog(testCase.id, testCase.name, targetId, targetFolderName);
      this.updateTestCaseData();

    }
  }

  moveFolder(event: CdkDragDrop<Folder[]>, targetFolderId: number, targetFolderName: string) {
    if (event.item.data.id === 0) {
      return;
    }
    console.log('eventFolderId: ', event.item.data.id);
    console.log('targetFolderId: ', targetFolderId);
    const currentFolderId = event.item.data.id;
    console.log("44444444")
    this.openMoveFolderDialog(currentFolderId, targetFolderId, event.item.data.name, targetFolderName);

    // let sourceFolder: Folder | undefined;
    // let targetFolder: Folder | undefined;
    //
    // const findFolders = (folders: Folder[] | null, parentFolder: Folder | null = null) => {
    //   for (let folder of folders ?? []) {
    //     if (folder.id === currentFolderId) {
    //       sourceFolder = folder;
    //       if (parentFolder) {
    //         if (parentFolder.childFolders) {
    //           parentFolder.childFolders = parentFolder.childFolders.filter(f => f.id !== currentFolderId);
    //         }
    //       } else {
    //         if (this.TEST_CASE_DATA) {
    //           this.TEST_CASE_DATA = this.TEST_CASE_DATA.filter(f => f.id !== currentFolderId);
    //         }
    //       }
    //     }
    //     if (folder.id === targetFolderId) {
    //       targetFolder = folder;
    //     }
    //     if (folder.childFolders) {
    //       findFolders(folder.childFolders, folder);
    //
    //     }
    //   }
    // };
    //
    // findFolders(this.TEST_CASE_DATA);
    //
    // if (sourceFolder && targetFolder) {
    //   if (!targetFolder.childFolders) {
    //     targetFolder.childFolders = [];
    //   }
    //   targetFolder.childFolders.push(sourceFolder);
    //
    // }
  }

  toggleFolder(folder: Folder, event: MouseEvent) {
    folder.expanded = !folder.expanded;
    (event.target as HTMLElement).blur();
  }

  dropFolder(event: CdkDragDrop<Folder[]>, targetFolderId: number, targetFolderName: string) {
    this.checkNestedFoldersForId(event, targetFolderId, targetFolderName);

  }

  checkNestedFoldersForId(event: CdkDragDrop<Folder[]>, targetFolderId: number, targetFolderName: string): void {
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
      const isParentFolder = true;
      this.openMoveFolderDialog(event.item.data.id, targetFolderId, event.item.data.folderName, targetFolderName, isParentFolder)
      console.log('Error: Target folder ID found within the nested folders of the source folder.');

    } else {
      console.log('No nested folder with the target ID found within the source folder.');
      this.moveFolder(event, targetFolderId, targetFolderName);
    }
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
        const folderDto: FolderDTO = {
          name: result as string,
          type: 0,
          projectId: Number(this.projectId)
        }
        this.folderService.addChildFolder(parentFolderId, folderDto).subscribe(
          folder => {
            console.log(`Folder, parentFolderId ${parentFolderId} , folder:: ${folder}`);
          }, error => {
            console.error(`Ошибка при добавлении папки`, error)
          }, () => {
            this.folderService.getProjectFolders(Number(this.projectId)).subscribe(folders => {
              if (folders) {
                console.log("FOLDERS:::", folders);
                this.TEST_CASE_DATA = [...folders];
                this.generateTestCaseArrays();
                if (this.TEST_CASE_DATA) {
                  this.setExpandedTrue(this.TEST_CASE_DATA);
                }
              }
              this.dataLoading = true;
              console.log("TEST_CASE_DATa::", this.TEST_CASE_DATA);
            });
          }
        );
      } else {
        console.log("Введите имя папки!!!")
      }
    });
  }


  openDialogToDeleteFolder(id: number, folderName: string) {
    console.log("FOlderId in deleteDialog::", id);
    const dialogRef = this.dialog.open(DialogComponent, {

      width: 'auto',
      data: {
        type: 'folder-del',
        del: false,
        folderId: id,
        folderName: folderName
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("MSG :: ", result);
      this.getProjectFolders();
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
        console.log('RESULT from openDialogToCreateTestCase: ', testCase);
          this.folderService.getProjectFolders(Number(this.projectId)).subscribe(folders => {
            if (folders) {
              console.log("FOLDERS:::", folders);
              this.TEST_CASE_DATA = [...folders];
              this.generateTestCaseArrays();
              if (this.TEST_CASE_DATA) {
                this.setExpandedTrue(this.TEST_CASE_DATA);
              }
            }
            this.dataLoading = true;
            console.log("TEST_CASE_DATa::", this.TEST_CASE_DATA);
          });



      } else {
        console.log("Ошибка при сохранении тест кейса!!!")
      }
    });
  }

  getTestCases(folderId: number) {
    console.log('getTestCases WAs executed, folderId: ', folderId)
    if (this.projectId) {
      this.testCaseService.getAllTestCases(Number(folderId)).subscribe({
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

  openMoveFolderDialog(folderId: number, targetFolderId: number, folderName: string, targetFolderName: string, isParentFolder?: boolean) {
    if (isParentFolder) {
      const dialogRef = this.dialog.open(MoveAndCopyDialogComponent, {


        width: 'auto',

        data: {
          folderId: folderId,
          targetFolderId: targetFolderId,
          folderName: folderName,
          targetFolderName: targetFolderName,
          type: 'FOLDER',
          onlyCopy: isParentFolder
        } // Можно передать данные в диалоговое окно
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getProjectFolders();
        }
        if(result.name){
          console.log(`Папка ${result.name} была перемещена !`)
        }
      });
    }

    if (!isParentFolder) {
      const dialogRef = this.dialog.open(MoveAndCopyDialogComponent, {


        width: 'auto',

        data: {
          folderId: folderId,
          targetFolderId: targetFolderId,
          folderName: folderName,
          targetFolderName: targetFolderName,
          type: 'FOLDER',
          onlyCopy: false
        } // Можно передать данные в диалоговое окно
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getProjectFolders();
        }
        console.log(`Перемещение папки отменено!`)
      });
    }
  }

  openMoveTestCaseDialog(testCaseId: number, testCaseName: string, targetFolderId: number, targetFolderName: string) {

    const dialogRef = this.dialog.open(MoveAndCopyDialogComponent, {


      width: 'auto',

      data: {
        testCaseId: testCaseId,
        testCaseName: testCaseName,
        targetFolderId: targetFolderId,
        targetFolderName: targetFolderName,
        type: 'TESTCASE'

      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(`Папка ${result.name} была перемещена !`)
      }
    }, (error) => {
      console.error("Ошибка при перемещении папки", error);
    }, () => {
      this.getProjectFolders();
    });
  }

  hoveredTestCase: any = null;

  editTestCase(testCase: any) {
    // Логика редактирования тест-кейса
  }

  openDeleteTestCaseDialog(testCaseId: number, testCaseName: string, folderName: string) {
    const dialogRef = this.dialog.open(DialogComponent, {


      width: 'auto',
      data: {
        testCaseId: testCaseId,
        testCaseName: testCaseName,
        type: 'testCase-del',
        folderName: folderName

      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    }, (error) => {
      console.error(`Ошибка при удалении тест-кейса ${testCaseName}` , error);
    }, () => {
      this.getProjectFolders();
    });
  }

  showData() {
    console.log("testcases-----------: ", this.testCases);
    console.log("DATA-----------: ", this.TEST_CASE_DATA);
  }

  changeTestCaseDialog(testCaseId: number): void {

    const dialogRef = this.dialog.open(CreateTestCaseComponent, {

      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        type: 'project',
        testCaseId: testCaseId,
        projectId: this.projectId,
        isNew: false
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(testCase => {
      if (testCase !== undefined && testCase !== '') {
        console.log('RESULT from openDialogToCreateTestCase: ', testCase);
        this.folderService.getProjectFolders(Number(this.projectId)).subscribe(folders => {
          if (folders) {
            console.log("FOLDERS:::", folders);
            this.TEST_CASE_DATA = [...folders];
            this.generateTestCaseArrays();
            if (this.TEST_CASE_DATA) {
              this.setExpandedTrue(this.TEST_CASE_DATA);
            }
          }
          this.dataLoading = true;
          console.log("TEST_CASE_DATa::", this.TEST_CASE_DATA);
        });
      }
    },error => {
      console.error('Ошибка при изменении тест кейса!')
    },()=>{

    });
  }
}


//   if(event.item.data.id === 0){
//   console.log("ОШИБКА: Нельзя переместить корневую папку!!!")
//   return;
// }

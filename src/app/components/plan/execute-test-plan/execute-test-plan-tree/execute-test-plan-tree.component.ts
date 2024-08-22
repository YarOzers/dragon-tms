import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
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
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {TestCase} from "../../../../models/test-case";
import {ProjectService} from "../../../../services/project.service";
import {RouterParamsService} from "../../../../services/router-params.service";
import {MatDialog} from "@angular/material/dialog";
import {Folder} from "../../../../models/folder";
import {DialogComponent} from "../../../dialog/dialog.component";
import {CreateTestCaseComponent} from "../../../case/create-test-case/create-test-case.component";
import {ActivatedRoute} from "@angular/router";
import {TestPlanService} from "../../../../services/test-plan.service";
import {TestPlan} from "../../../../models/test-plan";

@Component({
  selector: 'app-execute-test-plan-tree',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    MatIcon,
    MatIconButton,
    MatProgressBar,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    NgClass
  ],
  templateUrl: './execute-test-plan-tree.component.html',
  styleUrl: './execute-test-plan-tree.component.css'
})
export class ExecuteTestPlanTreeComponent implements OnInit, AfterViewInit {
  selectedFolder: Folder | null = null;
  dataLoading: boolean = false;
  private projectId: number | null = 0;
  private testCases: TestCase[] = [];
  @Output() testCasesFromTree = new EventEmitter<any>();
  public TEST_CASE_DATA: Folder[] | null = [];
  testCasesMap: { [key: string]: TestCase[] } = {};
  private testPlanId: number | null = 0;
  private testPlan: any;


  constructor(
    private projectService: ProjectService,
    private routerParamsService: RouterParamsService,
    private route: ActivatedRoute,
    private testPlanService: TestPlanService
  ) {
    this.routerParamsService.projectId$.subscribe(id => {
      this.projectId = id;
    });
    if (this.route.snapshot.paramMap.get('testPlanId')) {
      this.testPlanId = Number(this.route.snapshot.paramMap.get('testPlanId'));
    }
  }

  ngOnInit(): void {
    this.dataLoading = false;
    this.testPlanService.getFoldersForTestCasesInTestPlan(Number(this.testPlanId)).subscribe(folders => {
      console.log("TESTPlanId::", this.testPlanId);
      console.log('FolDERs::', folders)
      if (folders) {
        console.log('2 filteredFolders::', folders)
        this.TEST_CASE_DATA?.push(folders);
        console.log("TEstCAseDATA:::", this.TEST_CASE_DATA)

        this.generateTestCaseArrays();
        if (this.TEST_CASE_DATA) {
          this.sentTestCasesFromTree(this.TEST_CASE_DATA);
        }
      }
      this.dataLoading = true;
    }, error => {
      console.error("Ошибка загрузки тест-кейсов", error);
    }, () => {
      if (this.TEST_CASE_DATA) {
        this.setExpandedTrue(this.TEST_CASE_DATA);
      }
    });
  }

  findRootFolderId(folders: Folder[]): number | null {
    for (const folder of folders) {
      if (folder.parentFolderId === null) {
        return folder.id;
      }
    }
    return null;
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

  sentTestCasesFromTree(folders: Folder[]) {
    if (this.testCasesFromTree) {
      this.testCasesFromTree.emit(folders)
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

  toggleFolder(folder: Folder, event: MouseEvent) {
    folder.expanded = !folder.expanded;
    (event.target as HTMLElement).blur();
  }

  getTestCases(folderId: number) {
    if (this.projectId && this.TEST_CASE_DATA) {
      const folder = this.findFolderById(folderId, this.TEST_CASE_DATA);
      if (folder) {
        const folderArray: Folder[] = [folder];
        this.sentTestCasesFromTree(folderArray);
      }
    }
  }

  findFolderById(folderId: number, folders: Folder[]): Folder | null {
    for (const folder of folders) {
      if (folder.id === folderId) {
        return folder;
      }

      if (folder.childFolders && folder.childFolders.length > 0) {
        const foundFolder = this.findFolderById(folderId, folder.childFolders);
        if (foundFolder) {
          return foundFolder;
        }
      }
    }

    return null;
  }


  showTestCaseData() {
    console.log(this.TEST_CASE_DATA);
  }
}

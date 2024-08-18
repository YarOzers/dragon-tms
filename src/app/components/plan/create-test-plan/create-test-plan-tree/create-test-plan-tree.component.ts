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
import {MatCheckbox} from "@angular/material/checkbox";
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
      }
      this.dataLoading = true;
    });
    if (this.TEST_CASE_DATA) {
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
    if (this.projectId  && this.TEST_CASE_DATA) {
    const folder =  this.findFolderById(folderId, this.TEST_CASE_DATA);
    if(folder){
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


  showTestCaseData(){
    console.log(this.TEST_CASE_DATA);
  }

}


import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {NgForOf, NgIf} from "@angular/common";
import {SplitAreaComponent, SplitComponent} from "angular-split";
import {TreeComponent} from "../../case/list-test-case/tree/tree.component";
import {SelectionModel} from "@angular/cdk/collections";
import {TestCase} from "../../../models/test-case";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {FormsModule} from "@angular/forms";
import {TestPlanTreeComponent} from "../test-plan-tree/test-plan-tree.component";
import {ExecuteTestCaseComponent} from "../../case/execute-test-case/execute-test-case.component";
import {ExecuteTestPlanTreeComponent} from "./execute-test-plan-tree/execute-test-plan-tree.component";
import {CreateTestPlanTreeComponent} from "../create-test-plan/create-test-plan-tree/create-test-plan-tree.component";
import {CreateTestPlanComponent} from "../create-test-plan/create-test-plan.component";
import {Folder} from "../../../models/folder";
import {TestPlan} from "../../../models/test-plan";

@Component({
  selector: 'app-execute-test-plan',
  standalone: true,
  imports: [
    FlexModule,
    MatButton,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatProgressBar,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    NgForOf,
    NgIf,
    SplitAreaComponent,
    SplitComponent,
    TreeComponent,
    FormsModule,
    MatMenuTrigger,
    MatHeaderCellDef,
    TestPlanTreeComponent,
    ExecuteTestPlanTreeComponent,
    CreateTestPlanTreeComponent,
  ],
  templateUrl: './execute-test-plan.component.html',
  styleUrl: './execute-test-plan.component.css'
})
export class ExecuteTestPlanComponent implements OnInit, AfterViewInit {
  @ViewChild(CreateTestPlanTreeComponent) treeComponent!: CreateTestPlanTreeComponent;
  @ViewChild(MatSort) sort!: MatSort;
  private syncScheduled = false;
  allColumns = ['select', 'run', 'id', 'name', 'type'];
  displayedColumns: string[] = ['select', 'run', 'id', 'name', 'type'];
  displayedColumnsSelection: { [key: string]: boolean } = {
    select: true,
    id: true,
    name: true,
    type: true
  };

  testPlanName: string = '';
  selection = new SelectionModel<TestCase>(true, []);
  private testCaseTableData: TestCase[] = [];
  dataSource: MatTableDataSource<TestCase> = new MatTableDataSource(this.testCaseTableData);
  isLoading = true;
  protected projectName = '';
  private projectId = 0;
  private folders: Folder[] = [];
  private testPlanId: number = 2;
  protected testPlan: TestPlan = {
    author: "",
    id: this.testPlanId,
    name: this.testPlanName,
    createdDate: '',
    testCaseCount: 0,
    status: 'await',
    qas: [],
    folders: []
  }

  constructor(
    private projectService: ProjectService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private router: Router,
    private headerService: HeaderService,
    private routerParamsService: RouterParamsService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.routerParamsService.projectId$.subscribe((projectId) => {
      this.projectId = Number(projectId);

    });
    if (this.route.snapshot.paramMap.get('testPlanId')) {
      this.testPlanId = Number(this.route.snapshot.paramMap.get('testPlanId'));
    }

    this.projectService.getTestPlanById(+this.projectId, +this.testPlanId).subscribe(testPlan => {
      this.testPlan = testPlan;
      console.log('testPlan:: ', this.testPlan)
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {

  }

  runTestCase(element: TestCase, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    element.isRunning = true;
    setTimeout(() => {
      element.isRunning = false;
    }, 3000);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // получение массива папок
  getTestCasesFromTree(event: Folder[]) {
    console.log('EVENT::', event)
    this.folders = event;
    this.testCaseTableData = this.getAllTestCases(this.folders);
    this.dataSource.data = this.testCaseTableData;
  }

  getAllTestCases(folders: Folder[]): TestCase[] {
    let testCases: TestCase[] = [];

    folders.forEach(folder => {
      if (folder.testCases && folder.testCases.length > 0) {
        testCases = [...testCases, ...folder.testCases];
      }
      if (folder.folders && folder.folders.length > 0) {
        testCases = [...testCases, ...this.getAllTestCases(folder.folders)];
      }
    });

    return testCases;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Обработчик для основного чекбокса
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.dataSource.data.forEach(row => row.selected = false);
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.selected = true;
      });
    }
  }

  runSelectedAutoTests() {
    const selectedAutoTests = this.selection.selected.filter((test) => test.automationFlag === 'auto');
    selectedAutoTests.forEach((test) => {
      this.runTestCase(test);
    });
  }

  updateFoldersWithSelection(testCases: TestCase[], folders: Folder[]): Folder[] {
    const updateFolder = (folder: Folder): Folder => {
      const updatedTestCases = testCases.filter(testCase => testCase.folderId === folder.id);

      const updatedSubFolders = folder.folders
        ? folder.folders.map(updateFolder)
        : [];

      return {
        ...folder,
        testCases: updatedTestCases.map(tc => ({
          ...tc,
          selected: tc.selected // обновляем значение selected
        })),
        folders: updatedSubFolders,
      };
    };

    return folders.map(updateFolder);
  }

  filterSelectedFolders(testCases: TestCase[], folders: Folder[]): Folder[] {
    const filterFolder = (folder: Folder): Folder | null => {
      const selectedTestCases = testCases.filter(testCase => testCase.folderId === folder.id && testCase.selected);

      const selectedSubFolders = folder.folders
        ? folder.folders.map(filterFolder).filter(f => f !== null) as Folder[]
        : [];

      if (selectedTestCases.length > 0 || selectedSubFolders.length > 0) {
        return {
          ...folder,
          testCases: selectedTestCases,
          folders: selectedSubFolders,
        };
      }

      return null;
    };

    return folders.map(filterFolder).filter(f => f !== null) as Folder[];
  }

  // Обработчик для каждого отдельного чекбокса
  onCheckboxChange(row: any, event: any) {
    row.selected = event.checked;
    if (event.checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
  }

  showData() {
    const updatedFolders = this.updateFoldersWithSelection(this.dataSource.data, this.folders);
    const selectedFolders = this.filterSelectedFolders(this.dataSource.data, this.folders);
    console.log('updateSelectedFolders: ', updatedFolders)
    console.log('SelectedFolders: ', selectedFolders)
  }

  executeTestCaseDialog(testCaseId: number) {
    const dialogRef = this.dialog.open(ExecuteTestCaseComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        type: 'project',
        testCaseId,
        projectId: this.projectId,
        isNew: false
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== '') {
        console.log('Result from dialog: ', result);
      } else {
        console.log('Введите имя проекта!!!');
      }
    });
  }
  updateDisplayedColumns() {
    this.displayedColumns = Object.keys(this.displayedColumnsSelection).filter(column => this.displayedColumnsSelection[column]);
  }
}

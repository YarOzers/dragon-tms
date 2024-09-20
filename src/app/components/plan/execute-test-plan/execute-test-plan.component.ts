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
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
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
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {FormsModule} from "@angular/forms";
import {ExecuteTestCaseComponent} from "../../case/execute-test-case/execute-test-case.component";
import {ExecuteTestPlanTreeComponent} from "./execute-test-plan-tree/execute-test-plan-tree.component";
import {CreateTestPlanTreeComponent} from "../create-test-plan/create-test-plan-tree/create-test-plan-tree.component";
import {Folder} from "../../../models/folder";
import {TestPlan} from "../../../models/test-plan";
import {TestPlanService} from "../../../services/test-plan.service";
import {TestCaseService} from "../../../services/test-case.service";
import {TestRunnerService} from "../../../services/test-runner.service";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {WebSocketService} from "../../../services/web-socket.service";

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
    ExecuteTestPlanTreeComponent,
    CreateTestPlanTreeComponent,
    MatMenuItem,
  ],
  templateUrl: './execute-test-plan.component.html',
  styleUrl: './execute-test-plan.component.scss'
})
export class ExecuteTestPlanComponent implements OnInit, AfterViewInit {
  @ViewChild(CreateTestPlanTreeComponent) treeComponent!: CreateTestPlanTreeComponent;
  @ViewChild(MatSort) sort!: MatSort;
  private syncScheduled = false;
  allColumns = ['select', 'run', 'id', 'name', 'type','result'];
  displayedColumns: string[] = ['select', 'run', 'id', 'name', 'type', 'result'];
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
  private testPlanId: number = 0;
  private testResults: any;
  runTests: boolean = true; // Дефолтное значение
  protected testPlan: TestPlan = {
    author: "",
    name: '',
    createdDate: '',
    testCaseCount: 0,
    status: 'await',
    qas: [],
    folders: []
  }

  private user: User = {
    id: 0,
    roles: [],
    name: '',
    email: ''
  }

  constructor(
    private projectService: ProjectService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private router: Router,
    private headerService: HeaderService,
    private routerParamsService: RouterParamsService,
    private route: ActivatedRoute,
    private testPlanService: TestPlanService,
    private testCaseService: TestCaseService,
    private testRunnerService: TestRunnerService,
    private userService: UserService,
    private webSocketService: WebSocketService
  ) {
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.routerParamsService.projectId$.subscribe((projectId) => {
      this.projectId = Number(projectId);

    });
    if (this.route.snapshot.paramMap.get('testPlanId')) {
      this.testPlanId = Number(this.route.snapshot.paramMap.get('testPlanId'));
    }

    if (this.testPlanId){
      this.testPlanService.getTestPlan(Number(this.testPlanId)).subscribe(testPlan => {
        this.testPlan = testPlan;
      });
    }

    this.webSocketService.connect();

    // Подписываемся на обновление статуса тестов
    this.webSocketService.testStatus$.subscribe(status => {
      if (status) {
        console.log("Status From WebSocket:::: ", status);

        for (const st of status) {

          console.log("st::", st);
          this.dataSource.data.forEach(testCase => {
            if (testCase.id === Number(st.AS_ID)) {
              testCase.isRunning = false;
              testCase.reportUrl = st.reportUrl;
              if (st.status === 'passed') {
                testCase.result = 'SUCCESSFULLY';
              }
              if (st.status !== 'passed') {
                testCase.result = 'FAILED';
              }

            }
          });
        }
        console.log("DATASOURCE>DATA:::", this.dataSource.data);
        // Если требуется обновить таблицу данных
        this.dataSource.data = [...this.dataSource.data];
      }
    });


  }

  ngAfterViewInit() {

  }

  runTestCase(element: any, event?: MouseEvent) {
    console.log("Element::", element)
    if (event) {
      event.stopPropagation();
    }
    element.isRunning = true;
    if (element.automationFlag === 'AUTO') {

    }
    let ids: number[] = [];
    ids.push(element.id)

    console.log("TESTPLANID::", this.testPlanId);
    this.testRunnerService.runTests(ids, this.user.email, this.testPlanId, this.projectId).subscribe(
      results => {
        this.testResults = results;
      },
      error => {
        console.error('Ошибка запуска тестов', error);
        this.isLoading = false;
      }
    )

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
      if (folder.childFolders && folder.childFolders.length > 0) {
        testCases = [...testCases, ...this.getAllTestCases(folder.childFolders)];
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
    console.log(this.selection);
    const selectedAutoTests = this.selection.selected.filter(test => test.automationFlag === 'AUTO');
    if (this.runTests && selectedAutoTests.length > 0) {
      console.log("SELSECTEDautotests:::", selectedAutoTests)
      let ids: number[] = [];
      for (const test of selectedAutoTests) {
        ids.push(test.id)
        this.dataSource.data.forEach(testCase => {
          if (testCase.id === Number(test.id)) {
            testCase.isRunning = true;
          }
        })
      }
      console.log("RAAAAANNNNNN!!!!!!!!!")
      this.testRunnerService.runTests(ids, this.user.email, this.testPlanId, this.projectId).subscribe(
        results => {
          this.testResults = results;
        },
        error => {
          console.error('Ошибка запуска тестов', error);
          this.isLoading = false;
        }
      )
    }


    if (!this.runTests) {
      console.log(selectedAutoTests)
      selectedAutoTests.forEach(test => {
        this.runTestCase(test);
      });
    }

  }

  updateFoldersWithSelection(testCases: TestCase[], folders: Folder[]): Folder[] {
    const updateFolder = (folder: Folder): Folder => {
      const updatedTestCases = testCases.filter(testCase => testCase.folderId === folder.id);

      const updatedSubFolders = folder.childFolders
        ? folder.childFolders.map(updateFolder)
        : [];

      return {
        ...folder,
        testCases: updatedTestCases.map(tc => ({
          ...tc,
          selected: tc.selected // обновляем значение selected
        })),
        childFolders: updatedSubFolders,
      };
    };

    return folders.map(updateFolder);
  }

  filterSelectedFolders(testCases: TestCase[], folders: Folder[]): Folder[] {
    const filterFolder = (folder: Folder): Folder | null => {
      const selectedTestCases = testCases.filter(testCase => testCase.folderId === folder.id && testCase.selected);

      const selectedSubFolders = folder.childFolders
        ? folder.childFolders.map(filterFolder).filter(f => f !== null) as Folder[]
        : [];

      if (selectedTestCases.length > 0 || selectedSubFolders.length > 0) {
        return {
          ...folder,
          testCases: selectedTestCases,
          childFolders: selectedSubFolders,
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

    dialogRef.afterClosed().subscribe((testCaseResult) => {
      if (testCaseResult){
        testCaseResult.testPlanId = Number(this.route.snapshot.paramMap.get('testPlanId'));
        console.log("TEstCaseRESULT::::", testCaseResult);
        this.testCaseService.setTestCaseResult(testCaseId, testCaseResult).subscribe(testCase => {
          this.dataSource.data.forEach((tc) => {
            if (tc.id === testCase.id) {
              tc.results?.push(testCaseResult);
            }
          })
          console.log("TestCaseWithResult::", testCase);
        });
      }
    }, (error) => {
      console.error('Ошибка при установке результата тест-кейса', error)
    }, () => {
      console.log("this.dataSource.data:: ", this.dataSource.data);
    });
  }

  updateDisplayedColumns() {
    this.displayedColumns = Object.keys(this.displayedColumnsSelection).filter(column => this.displayedColumnsSelection[column]);
  }

  // Функция для переключения режима
  setRunMode(runInSingle: boolean): void {
    this.runTests = runInSingle;
  }
}

import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {SplitAreaComponent, SplitComponent} from "angular-split";
import {TreeComponent} from "./tree/tree.component";
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
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {TestCase} from "../../../models/test-case";
import {CreateTestCaseComponent} from "../create-test-case/create-test-case.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SelectionModel} from "@angular/cdk/collections";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {FormsModule} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import {TestRunnerServiceService} from "../../../services/test-runner-service.service";
import {WebSocketService} from "../../../services/web-socket.service";
import {User} from "../../../models/user";


@Component({
  selector: 'app-list-test-case',
  standalone: true,
  imports: [
    NgStyle,
    SplitComponent,
    SplitAreaComponent,
    TreeComponent,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatProgressBar,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    NgIf,
    MatHeaderCellDef,
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    MatLabel,
    MatMenu,
    FormsModule,
    MatMenuTrigger,
    FlexModule,
    NgClass,
    MatMenuItem
  ],
  templateUrl: './list-test-case.component.html',
  styleUrl: './list-test-case.component.scss'
})
export class ListTestCaseComponent implements OnInit, AfterViewInit, OnDestroy {

  // Переменная, которая управляет режимом
  runTests: boolean = true; // Дефолтное значение

  private user: User = {
    id: 1,
    role: 'ADMIN',
    name: 'Ярослав Андреевич',
    rights: 'SUPER'
  }
  allColumns = ['select', 'run', 'id', 'name', 'type', 'result'];
  displayedColumns: string[] = ['select', 'run', 'id', 'name', 'type', 'result'];
  testStatus: any;
  displayedColumnsSelection: { [key: string]: boolean } = {
    select: true,
    id: true,
    name: true,
    type: true,
    run: true,
    result: true
  };
  selection = new SelectionModel<any>(true, []);
  private testCaseTableData: TestCase[] = [];
  dataSource: MatTableDataSource<TestCase> = new MatTableDataSource(this.testCaseTableData);
  isLoading = true;
  protected projectName = '';
  private projectId = 0;
  dataIndex: any;
  private testResults: any;
  private testPlanId: number = 1;
  private userId: number = 1;

  constructor(
    private projectService: ProjectService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private router: Router,
    private headerService: HeaderService,
    private routerParamsService: RouterParamsService,
    private testRunnerService: TestRunnerServiceService,
    private webSocketService: WebSocketService
  ) {
  }

  @ViewChild(MatSort) sort!: MatSort;

  // Toggle selection for all rows
  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
    } else {
      this.selection.clear();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleSelection(element: any) {

    this.selection.toggle(element);
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

    this.testRunnerService.runTests(ids, this.userId, 0).subscribe(
      results => {
        this.testResults = results;
      },
      error => {
        console.error('Ошибка запуска тестов', error);
        this.isLoading = false;
      }
    )

  }

  ngOnInit(): void {
    this.routerParamsService.projectId$.subscribe(projectId => {
      this.projectId = Number(projectId);
    })

    this.routerParamsService.testPlanId$.subscribe(testPlanId => {
      this.testPlanId = Number(testPlanId);
    })
    this.projectService.getAllProjectTestCases(this.projectId).subscribe({
      next: (projects) => {

        this.isLoading = false;
      }, error: (err) => {
        console.log("Ошибка при загрузке тест кейсов: ", err);
        this.isLoading = false;
      }, complete() {
      }
    })
    console.log(this.testCaseTableData);
    console.log(this.dataSource.data);

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
    this.dataSource.sort = this.sort;
    console.log(this.dataSource.data)

  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }


  updateTestStatus() {
    // Логика для обновления статуса тестов и отключения лоадера
    console.log('Test Status Updated:', this.testStatus);
    // Остановите лоадер для тестов, которые получили статус
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }

  }


  openTestCaseDialog(testCaseId: number): void {

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

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== '') {
        console.log('result from dialog: ', result);
      } else {
        console.log("Введите имя проекта!!!");
      }
    });
  }

  getTestCasesFromTree(event: any) {
    this.testCaseTableData = [...event];
    this.dataSource.data = this.testCaseTableData;
  }

  runSelectedAutoTests() {
    console.log(this.selection);
    const selectedAutoTests = this.selection.selected.filter(test => test.automationFlag === 'AUTO');
    if (this.runTests) {
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
      this.testRunnerService.runTests(ids, this.userId, 0).subscribe(
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

  updateDisplayedColumns() {
    this.displayedColumns = Object.keys(this.displayedColumnsSelection).filter(column => this.displayedColumnsSelection[column]);
  }

  showTableData() {
    console.log(this.dataSource.data);
  }

  // Функция для переключения режима
  setRunMode(runInSingle: boolean): void {
    this.runTests = runInSingle;
  }
}

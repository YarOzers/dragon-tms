import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {NgForOf, NgIf} from "@angular/common";
import {SplitAreaComponent, SplitComponent} from "angular-split";
import {TreeComponent} from "../../tree/tree.component";
import {SelectionModel} from "@angular/cdk/collections";
import {TestCase} from "../../../models/test-case";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {CreateTestCaseComponent} from "../../case/create-test-case/create-test-case.component";
import {FormsModule} from "@angular/forms";
import {TestPlanTreeComponent} from "../test-plan-tree/test-plan-tree.component";
import {ExecuteTestCaseComponent} from "../../case/execute-test-case/execute-test-case.component";
import {ExecuteTestPlanTreeComponent} from "./execute-test-plan-tree/execute-test-plan-tree.component";

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
    ExecuteTestPlanTreeComponent
  ],
  templateUrl: './execute-test-plan.component.html',
  styleUrl: './execute-test-plan.component.css'
})
export class ExecuteTestPlanComponent implements OnInit, AfterViewInit{
  allColumns = ['select', 'run', 'id', 'name', 'type'];
  displayedColumns: string[] = ['select', 'run', 'id', 'name', 'type'];
  displayedColumnsSelection: { [key: string]: boolean } = {
    select: true,
    id: true,
    name: true,
    type: true
  };
  selection = new SelectionModel<any>(true, []);
  private testCaseTableData: TestCase[] = [];
  dataSource: MatTableDataSource<TestCase> = new MatTableDataSource(this.testCaseTableData);
  isLoading = true;
  protected projectName = '';
  private projectId = 0;
  dataIndex: any;

  constructor(
    private projectService: ProjectService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private router: Router,
    private headerService: HeaderService,
    private routerParamsService: RouterParamsService
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
    if (event) {
      event.stopPropagation();
    }
    element.isRunning = true;
    // Симуляция выполнения
    setTimeout(() => {
      element.isRunning = false;
    }, 3000);
  }

  ngOnInit(): void {
    this.routerParamsService.projectId$.subscribe(projectId => {
      this.projectId = Number(projectId);
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
  }


  getData() {
    console.log('tableData: ', this.testCaseTableData);
    console.log('datasource: ', this.dataSource.data);
    this.dataSource.data = this.testCaseTableData;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(this.dataSource.data)

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

    const dialogRef = this.dialog.open(ExecuteTestCaseComponent, {

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
    const selectedAutoTests = this.selection.selected.filter(test => test.type === 'auto');
    selectedAutoTests.forEach(test => {
      this.runTestCase(test);
    });
  }
}

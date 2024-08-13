import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RouterParamsService} from "../../../services/router-params.service";
import {TestPlan} from "../../../models/test-plan";
import {User} from "../../../models/user";
import {Folder} from "../../../models/folder";
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
import {NgForOf, NgIf, NgSwitchCase} from "@angular/common";
import {SplitAreaComponent, SplitComponent} from "angular-split";
import {TreeComponent} from "../../tree/tree.component";
import {SelectionModel} from "@angular/cdk/collections";
import {TestCase} from "../../../models/test-case";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {HeaderService} from "../../../services/header.service";
import {CreateTestCaseComponent} from "../../case/create-test-case/create-test-case.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CreateTestPlanTreeComponent} from "./create-test-plan-tree/create-test-plan-tree.component";

@Component({
  selector: 'app-create-test-plan',
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
    MatMenuTrigger,
    FormsModule,
    MatHeaderCellDef,
    MatDialogActions,
    MatDialogContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgSwitchCase,
    ReactiveFormsModule,
    CreateTestPlanTreeComponent
  ],
  templateUrl: './create-test-plan.component.html',
  styleUrl: './create-test-plan.component.scss'
})
export class CreateTestPlanComponent implements OnInit, AfterViewInit {
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

  constructor(
    private dialogRef: MatDialogRef<CreateTestPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private router: Router,
    private headerService: HeaderService,
    private routerParamsService: RouterParamsService
  ) {}

  ngOnInit(): void {
    this.routerParamsService.projectId$.subscribe((projectId) => {
      this.projectId = Number(projectId);
    });

    this.projectService.getAllProjectTestCases(this.projectId).subscribe({
      next: (projects) => {
        // Обработка загруженных данных
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Ошибка при загрузке тест кейсов: ', err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.syncTreeSelection();
    this.treeComponent.syncTreeSelectionWithPartialSelection();
  }

  toggleAll(event: MatCheckboxChange) {
    const isChecked = event.checked;
    console.log(`toggleAll: isChecked = ${isChecked}`);

    if (isChecked) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    } else {
      this.selection.clear();
    }

    console.log(`toggleAll: selection = ${JSON.stringify(this.selection.selected.map(tc => tc.id))}`);

    this.syncTreeSelection();
    this.treeComponent.syncTreeSelectionWithPartialSelection();
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    if (numSelected === numRows) {
      return true;
    } else if (numSelected > 0 && numSelected < numRows) {
      return null;  // частично выбранные элементы
    } else {
      return false;
    }
  }

  toggleSelection(element: TestCase) {
    this.selection.toggle(element);
    console.log(`toggleSelection: toggled TestCase ID = ${element.id}, selected = ${element.selected}`);

    // Вместо вызова syncTreeSelection здесь
    this.scheduleSyncTreeSelection();

    this.updateToggleAllCheckboxState();
  }

  private scheduleSyncTreeSelection() {
    if (!this.syncScheduled) {
      this.syncScheduled = true;
      setTimeout(() => {
        this.syncTreeSelection();
        this.treeComponent.syncTreeSelectionWithPartialSelection();
        this.syncScheduled = false;
      }, 0);
    }
  }


  updateToggleAllCheckboxState() {
    const allSelectedState = this.isAllSelected();

    // Учитываем состояние "null" для частично выделенных элементов
    const folderSelectedState = allSelectedState === true ? true : (allSelectedState === null ? null : false);

    this.treeComponent.updateCheckboxForFolder(this.treeComponent.selectedFolder, folderSelectedState);
  }

  syncTreeSelection() {
    const selectedTestCases = this.selection.selected.map(tc => tc.id);
    console.log(`syncTreeSelection: selectedTestCases = ${JSON.stringify(selectedTestCases)}`);

    this.treeComponent.TEST_CASE_DATA?.forEach(folder => {
      folder.selected = folder.testCases.every(tc => selectedTestCases.includes(tc.id));
      console.log(`syncTreeSelection: folder ${folder.name} selected = ${folder.selected}`);

      folder.testCases.forEach(testCase => {
        testCase.selected = selectedTestCases.includes(testCase.id);
        console.log(`syncTreeSelection: TestCase ${testCase.id} selected = ${testCase.selected}`);
      });

      this.updateParentFoldersState(folder); // Обновление состояния родительских папок
    });
  }

  private updateParentFoldersState(folder: Folder) {
    const parentFolder = this.treeComponent.findParentFolder(this.treeComponent.TEST_CASE_DATA!, folder);
    if (parentFolder) {
      const allSelected = this.treeComponent.isFolderChecked(parentFolder);
      const indeterminate = this.treeComponent.isFolderIndeterminate(parentFolder);

      parentFolder.selected = allSelected ? true : (indeterminate ? null : false);

      this.updateParentFoldersState(parentFolder); // Рекурсивное обновление родительских папок
    }
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

  openTestCaseDialog(testCaseId: number): void {
    const dialogRef = this.dialog.open(CreateTestCaseComponent, {
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

  getTestCasesFromTree(event: TestCase[]) {
    this.dataSource.data = event;
    this.selection.clear();

    event.forEach(testCase => {
      if (testCase.selected) {
        this.selection.select(testCase);
      }
    });

    this.updateToggleAllCheckboxState();
  }

  runSelectedAutoTests() {
    const selectedAutoTests = this.selection.selected.filter((test) => test.automationFlag === 'auto');
    selectedAutoTests.forEach((test) => {
      this.runTestCase(test);
    });
  }

  private isTestCaseInFolder(testCase: TestCase, folder: Folder): boolean {
    if (folder.testCases.includes(testCase)) {
      return true;
    }
    return (folder.folders ?? []).some(subFolder => this.isTestCaseInFolder(testCase, subFolder));
  }

  closeMatDialog() {
    this.dialogRef.close();
  }

  save() {
    // Логика сохранения
  }
}

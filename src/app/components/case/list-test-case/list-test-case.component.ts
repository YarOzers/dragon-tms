import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {SplitAreaComponent, SplitComponent} from "angular-split";
import {TreeComponent} from "../../tree/tree.component";
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {Project} from "../../../models/project";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {DialogComponent} from "../../dialog/dialog.component";
import {TestCase} from "../../../models/test-case";
import {CreateTestCaseComponent} from "../create-test-case/create-test-case.component";


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
    MatHeaderCellDef
  ],
  templateUrl: './list-test-case.component.html',
  styleUrl: './list-test-case.component.scss'
})
export class ListTestCaseComponent implements OnInit,AfterViewInit{
  displayedColumns: string[] = ['id', 'name'];
  private testCaseTableData: TestCase[] = [];
  dataSource: MatTableDataSource<TestCase> = new MatTableDataSource(this.testCaseTableData);
  isLoading = true;
  protected projectName = '';
  private projectId  = 0;

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

  ngOnInit(): void {

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

    const dialogRef = this.dialog.open(CreateTestCaseComponent, {

      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        type: 'project',
        testCaseId: testCaseId
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined && result !== ''){
        console.log('result from dialog: ', result);
      }else {
        console.log("Введите имя проекта!!!");
      }
    });
  }

  getTestCasesFromTree(event: any) {
    this.testCaseTableData = [...event];
    this.dataSource.data = this.testCaseTableData;
  }
}

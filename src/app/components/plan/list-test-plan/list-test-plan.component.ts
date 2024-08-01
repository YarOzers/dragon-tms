import {Component, ViewChild} from '@angular/core';
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
import {NgIf} from "@angular/common";
import {Project} from "../../../models/project";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {DialogComponent} from "../../dialog/dialog.component";
import {TestPlan} from "../../../models/test-plan";
import {TestPlanService} from "../../../services/test-plan.service";

@Component({
  selector: 'app-list-test-plan',
  standalone: true,
  imports: [
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
  templateUrl: './list-test-plan.component.html',
  styleUrl: './list-test-plan.component.css'
})
export class ListTestPlanComponent {
  projectId: any;
  displayedColumns: string[] = ['id', 'name'];
  private testPlanTableData: TestPlan[] = [];
  dataSource: MatTableDataSource<TestPlan> = new MatTableDataSource(this.testPlanTableData);
  isLoading = true;
  protected projectName = '';
  private testPlanId = this.testPlanTableData.length;
  private testPlan: TestPlan = {
    id: 0,
    name: '',
    createdDate: '',
    author: '',
    testCaseCount: 0,
    status: 'await',
    qas: [],
    folders: []
  };

  constructor(
    private projectService: ProjectService,
    private testPlanService: TestPlanService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private router: Router,
    private headerService: HeaderService,
    private activeRouter: ActivatedRoute
  ) {
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.activeRouter.paramMap.subscribe(params =>{
      console.log('params id: ',params.get('id'))
      if (params.get('id')){
        this.projectId = params.get('id');
      }
    })

    this.projectService.getTestPlans(+this.projectId).subscribe({
      next: (testPlans) => {
        console.log('from testPlanComponent, testPlans: ', testPlans,)
        console.log('projectID: ', this.projectId,)
        if (testPlans){

          this.dataSource.data = [...testPlans]
        }
        this.isLoading = false;
      }, error: (err) => {
        console.log("Ошибка при загрузке проектов: ", err);
        this.isLoading = false;
      }, complete() {
      }
    })
    console.log(this.testPlanTableData);
    console.log(this.dataSource.data);
  }


  getData() {
    console.log('tableData: ', this.testPlanTableData);
    console.log('datasource: ', this.dataSource.data);
    this.dataSource.data = this.testPlanTableData;
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

  addTestPlan(testPlanName: string) {
    this.testPlan = {
      id: this.testPlanId + 1,
      name: testPlanName,
      createdDate: this.testPlanService.getCurrentDateTimeString(),
      author: '',
      qas: [],
      folders: [],
      status: 'await',
      testCaseCount: 0
    }
    this.testPlanService.createTestPlan(this.testPlan);
    this.isLoading = true;
    this.ngOnInit();

  }


  openDialog(): void {

    const dialogRef = this.dialog.open(DialogComponent, {

      width: 'auto',
      data: {
        type: 'project',
        projectName: ''
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined && result !== ''){
        this.addTestPlan(result);
      }else {
        console.log("Введите имя проекта!!!")
      }
    });
  }

  navigateToProject(row: any) {
    this.headerService.showButtons(true);
    this.router.navigate([`/project-detail/${row.id}`]);
  }
}

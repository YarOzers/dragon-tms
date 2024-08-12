import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../dialog/dialog.component";
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
import {TestPlan} from "../../../models/test-plan";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ProjectService} from "../../../services/project.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {FlexModule} from "@angular/flex-layout";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-dialog-test-plan-list',
  standalone: true,
  imports: [
    MatDialogContent,
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
    FlexModule,
    MatButton,
    MatDialogActions
  ],
  templateUrl: './dialog-test-plan-list.component.html',
  styleUrl: './dialog-test-plan-list.component.scss'
})
export class DialogTestPlanListComponent implements OnInit, AfterViewInit{
  projectId: any;
  displayedColumns: string[] = ['id', 'name'];
  private testPlanTableData: TestPlan[] = [];
  dataSource: MatTableDataSource<TestPlan> = new MatTableDataSource(this.testPlanTableData);
  isLoading = true;
  protected projectName = '';
  private testPlanId = 0;
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
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _liveAnnouncer: LiveAnnouncer,
    private projectService: ProjectService,
    private routerParamsService: RouterParamsService
  ) {

  }

  selectTestPlan(testPlanId: number) {
    this.dialogRef.close(testPlanId);
  }

  closeMatDialog(){
    this.dialogRef.close()
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.routerParamsService.projectId$.subscribe(projectId =>{
      this.projectId = projectId;
    });

    this.projectService.getTestPlans(+this.projectId).subscribe({
      next: (testPlans) => {
        console.log('from testPlanDialog, testPlans: ', testPlans,)
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
}

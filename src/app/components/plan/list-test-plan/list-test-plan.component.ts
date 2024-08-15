import {AfterViewInit, Component, ViewChild} from '@angular/core';
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
import {NgIf} from "@angular/common";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {DialogComponent} from "../../dialog/dialog.component";
import {TestPlan} from "../../../models/test-plan";
import {TestPlanService} from "../../../services/test-plan.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {DialogTestPlanListComponent} from "../dialog-test-plan-list/dialog-test-plan-list.component";
import {CreateTestPlanComponent} from "../create-test-plan/create-test-plan.component";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

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
    MatHeaderCellDef,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './list-test-plan.component.html',
  styleUrl: './list-test-plan.component.scss'
})
export class ListTestPlanComponent implements AfterViewInit{
  projectId: any;
  displayedColumns: string[] = ['id', 'name', 'menu'];
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
    private projectService: ProjectService,
    private testPlanService: TestPlanService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private router: Router,
    private headerService: HeaderService,
    private activeRouter: ActivatedRoute,
    private routerParamsService: RouterParamsService
  ) {
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.activeRouter.paramMap.subscribe(params =>{
      if (params.get('projectId')){
        this.projectId = params.get('projectId');
      }
    });

    this.projectService.getTestPlans(+this.projectId).subscribe({
      next: (testPlans) => {
        if (testPlans){

          this.dataSource.data = [...testPlans]
          this.testPlanId = testPlans.length +1;
        }
        this.isLoading = false;
      }, error: (err) => {
        console.error("Ошибка при загрузке проектов: ", err);
        this.isLoading = false;
      }, complete() {
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
      id: this.testPlanId,
      name: testPlanName,
      createdDate: this.testPlanService.getCurrentDateTimeString(),
      author: '',
      qas: [],
      folders: [],
      status: 'await',
      testCaseCount: 0
    }
    this.projectService.addTestPlan(+this.projectId, this.testPlan);
    this.isLoading = true;
    this.ngOnInit();

  }


  openDialog(): void {

    const dialogRef = this.dialog.open(DialogComponent, {

      width: 'auto',
      data: {
        type: 'test-plan',
        testPlanName: ''
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined && result !== ''){
        this.addTestPlan(result);
        this.router.navigate([`/project-detail/${this.projectId}/test-plan-create/${this.projectId}`]);
      }else {
        console.log("Введите имя тест плана!!!")
      }
    });
  }

  navigateToTestPlan(testPlanId: number) {
    this.testPlanId = testPlanId;
    this.headerService.showButtons(true);
    this.routerParamsService.setProjectId(this.projectId);
    this.routerParamsService.setTestPlanId(Number(this.testPlanId));
    this.router.navigate([`/project-detail/${this.projectId}/test-plan-create/${this.projectId}`]);
  }

  opedEditTestPlanDialog(testPlanId: number){
    let testPlan: TestPlan;
    this.projectService.getTestPlanById(Number(this.projectId),Number(testPlanId)).subscribe(tp=>{
      testPlan = tp;
      console.log('testPlan*** : ', testPlan);
      const dialogRef = this.dialog.open(CreateTestPlanComponent, {


        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        data: {
          projectId: this.projectId,
          testPlanId: testPlanId,
          isNew: false,
          testPlan: testPlan

        } // Можно передать данные в диалоговое окно
      });

      dialogRef.afterClosed().subscribe(testPlan => {
        console.log('testPlan in dialog::', testPlan)
        this.projectService.updateTestPlan(this.projectId, testPlan);
        this.ngOnInit();
      });
    });

  }

  openCreateTestPlanDialog() {
    const dialogRef = this.dialog.open(CreateTestPlanComponent, {

      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        projectId: this.projectId,
        isNew: true

      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(testPlan => {
      console.log('testPlan in dialog::', testPlan)
      this.projectService.updateTestPlan(this.projectId, testPlan);
      this.ngOnInit();
    });
  }
}

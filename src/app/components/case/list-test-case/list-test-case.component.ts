import {Component, ViewChild} from '@angular/core';
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
export class ListTestCaseComponent {
  displayedColumns: string[] = ['id', 'name'];
  private projectTableData: Project[] = [];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource(this.projectTableData);
  isLoading = true;
  protected projectName = '';
  private projectId  = 0;
  private project: Project = {
    id: 0,
    name: ''
  };

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

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        console.log('projects: ', projects)
        this.projectId = projects.length +1;
        console.log('PROJECTID: ',this.projectId);
        this.projectTableData = projects;
        this.dataSource.data = this.projectTableData;
        this.isLoading = false;
      }, error: (err) => {
        console.log("Ошибка при загрузке проектов: ", err);
        this.isLoading = false;
      }, complete() {
      }
    })
    console.log(this.projectTableData);
    console.log(this.dataSource.data);
  }


  getData() {
    console.log('tableData: ', this.projectTableData);
    console.log('datasource: ', this.dataSource.data);
    this.dataSource.data = this.projectTableData;
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

  addProject(projectName: string) {
    this.project = {
      id: this.projectId,
      name: projectName,
      folder: [],
      testPlan: [],
      users: []
    }
    this.projectService.createProject(this.project);
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
        this.addProject(result);
      }else {
        console.log("Введите имя проекта!!!")
      }
    });
  }

  navigateToProject(row: any) {
    this.headerService.showButtons(true);
    this.routerParamsService.setProjectId(row.id);
    this.router.navigate([`/project-detail/${row.id}`]);
  }
}

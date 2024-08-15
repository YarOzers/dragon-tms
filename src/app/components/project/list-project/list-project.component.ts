import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../models/project";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatProgressBar} from "@angular/material/progress-bar";
import {CommonModule, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../dialog/dialog.component";
import {Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {RouterParamsService} from "../../../services/router-params.service";

@Component({
  selector: 'app-list-project',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatProgressBar,
    NgIf,
    FormsModule,
    MatButton,
    DialogComponent,
    CommonModule
  ],
  templateUrl: './list-project.component.html',
  styleUrl: './list-project.component.scss'
})
export class ListProjectComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name'];
  private projectTableData: Project[] = [];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource(this.projectTableData);
  isLoading = true;
  protected projectName = '';
  private projectId = 0;
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
        this.projectId = projects.length + 1;
        this.projectTableData = projects;
        this.dataSource.data = this.projectTableData;
        this.isLoading = false;
      }, error: (err) => {
        console.log("Ошибка при загрузке проектов: ", err);
        this.isLoading = false;
      }, complete() {
      }
    })

  }


  getData() {
    console.log('tableData: ', this.projectTableData);
    console.log('datasource: ', this.dataSource.data);
    this.dataSource.data = this.projectTableData;
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
        type: 'folder',
        folderName: ''
      } // Можно передать данные в диалоговое окно
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== '') {
        this.addProject(result);
      } else {
        console.log("Введите имя проекта!!!")
      }
    });
  }

  navigateToProject(row: any) {
    this.headerService.showButtons(true);
    this.routerParamsService.setProjectId(row.id);
    this.router.navigate(['project', this.projectId,'testcases'],
      {
        state: {go: true}
      });
  }
}

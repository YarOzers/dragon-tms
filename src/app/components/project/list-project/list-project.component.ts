import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Project, ProjectDTO} from "../../../models/project";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatProgressBar} from "@angular/material/progress-bar";
import {CommonModule, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../dialog/dialog.component";
import {Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {RouterParamsService} from "../../../services/router-params.service";
import {HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

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
    CommonModule,
    HttpClientModule,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './list-project.component.html',
  styleUrl: './list-project.component.scss'
})
export class ListProjectComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'menu'];
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
        if(projects){
          console.log(projects);
          this.projectTableData = projects;
          this.dataSource.data = this.projectTableData;
          this.isLoading = false;
        }
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
    console.log(projectName);
    const project: ProjectDTO = {
      name: projectName,
      authorId: 1

    }

    this.projectService.createProject(project).subscribe(proj=>{
      this.dataSource.data.push(proj);
      this.isLoading = true;
      this.ngOnInit();
    });


  }


  openCreateProjectDialog(): void {

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

  navigateToProject(projectId: any) {
    this.headerService.showButtons(true);
    this.routerParamsService.setProjectId(projectId);
    this.router.navigate(['project', projectId,'testcases'],
      {
        state: {go: true}
      });
  }

  deleteProject(id: number) {
    this.projectService.deleteProject(id).subscribe(id=>{
      console.log(`Проект с id ${id} удален!`)
      this.projectService.getProjects().subscribe(projects=>{
        this.dataSource.data = projects;
      })
      }

    )

  }
}

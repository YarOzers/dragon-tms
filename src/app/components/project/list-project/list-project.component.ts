import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../models/project";
import {ProjectService} from "../../../services/project.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-list-project',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatProgressBar,
    NgIf,
    FormsModule
  ],
  templateUrl: './list-project.component.html',
  styleUrl: './list-project.component.css'
})
export class ListProjectComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name'];
  private projectTableData: Project[] = [];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource(this.projectTableData);
  isLoading = true;
  protected projectName = '';
  private projectId = this.projectTableData.length;
  private project: Project = {
    id:0,
    name:''
  };

  constructor(
    private projectService: ProjectService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        console.log('projects: ', projects)
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

  addProject() {
    this.project = {
      id: this.projectId + 1,
      name: this.projectName
    }
    this.projectService.createProject(this.project);
    this.isLoading = true;
    this.ngOnInit();

  }
}

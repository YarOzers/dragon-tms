import {Injectable} from '@angular/core';
import {Project} from "../models/project";
import {delay, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private _projects: Project[]=[
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 1,
      name: 'first project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },
    {id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    }
  ];

  private nextId: number = 1;

  constructor() {}

  //получение текущей даты и времени
  getCurrentDateTimeString(): string {
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // GET: получение всех проектов
  getProjects(): Observable<Project[]> {
    return of(this._projects).pipe(delay(500)); // Симуляция задержки
  }

  // POST: создание нового проекта
  createProject(project: Project): Observable<Project> {
    project.createdDate = this.getCurrentDateTimeString();
    project.id = this.nextId++;
    this._projects.push(project);

    return of(project).pipe(delay(500)); // Симуляция задержки
  }

  // PUT: обновление существующего проекта
  updateProject(project: Project): Observable<Project> {
    const index = this._projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      this._projects[index] = project;
    }
    return of(project).pipe(delay(500)); // Симуляция задержки
  }

  // DELETE: удаление проекта
  deleteProject(id: number): Observable<void> {
    this._projects = this._projects.filter(project => project.id !== id);
    return of(undefined).pipe(delay(500)); // Симуляция задержки
  }

  // Геттер для получения проектов
  get projects(): Project[] {
    return this._projects;
  }

  // Сеттер для установки проектов
  set projects(value: Project[]) {
    this._projects = value;
  }

}

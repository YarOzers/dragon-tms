import {Injectable} from '@angular/core';
import {Project} from "../models/project";
import {delay, Observable, of} from "rxjs";
import {TestCase} from "../models/test-case";
import {Folder} from "../models/folder";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private folder5: Folder = {
    id: 5,
    parentFolderId: 4,
    name: 'folder 5',
    testCases: [],
    type: 'folder'
  };
  private folder4: Folder = {
    id: 4,
    name: 'folder 4',
    parentFolderId: 1,
    testCases: [
      // this.testCase6
    ],
    folders: [this.folder5],
    type: 'folder'
  };
  private folder1: Folder = {
    id: 1,
    name: 'folder 1',
    parentFolderId: 0,
    folders: [this.folder4],
    testCases: [
      // this.testCase1, this.testCase2
    ],
    type: 'folder'
  };

  private folder2: Folder = {
    id: 2,
    parentFolderId: 0,
    name: 'folder 2',
    testCases: [
      // this.testCase3, this.testCase4
    ],
    type: 'folder'
  };

  private folder3: Folder = {
    id: 3,
    parentFolderId: 0,
    name: 'folder 3',
    testCases: [
      // this.testCase5
    ],
    type: 'folder'
  };
  private root_folder: Folder = {
    id: 0,
    name: 'root_folder',
    testCases: [],
    folders: [this.folder1, this.folder2, this.folder3],
    type: 'folder'
  };

  protected TEST_CASE_DATA: Folder[] = [this.root_folder];

  // PROJECTS=======================================================================================

  private _projects: Project[] = [
    {
      id: 1,
      name: 'first project',
      users: [],
      folder: this.TEST_CASE_DATA,
      testPlan: [{
        id: 1,
        name: 'first test plan',
        createdDate: '',
        author: 'author',
        testCaseCount: 0,
        status: 'await',
        qas: [],
        folders: this.TEST_CASE_DATA
      }],
      createdDate: this.getCurrentDateTimeString()
    },
    {
      id: 2,
      name: 'second project',
      users: [],
      folder: [],
      testPlan: [],
      createdDate: this.getCurrentDateTimeString()
    },

  ];
  private testCaseIdCounter: number = 0;


  constructor() {
  }

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

  // GET: получение тестпланов по проекту
  getTestPlans(projectId: number | null): Observable<any[] | undefined> {
    const project = this._projects.find(p => p.id === projectId);
    if (project) {
      console.log('тест-планы найдены:', project.testPlan);
      return of(project.testPlan).pipe(delay(500));
    } else {
      return of([]).pipe(delay(500)); // Возвращаем пустой массив, если проект не найден
    }
  }

// POST: добавление тестплана в проект
  addTestPlan(projectId: number, testPlan: any): Observable<any> {
    console.log('projectId in addTestPlan in service: ', projectId);
    console.log('testPlan in addTestPlan in service: ', testPlan);
    const project = this._projects.find(p => p.id === projectId);

    if (project) {
      if (project.testPlan) {
        project.testPlan.push(testPlan);
        console.log('projects----------------------------------------: ', this._projects)
      }
      return of(testPlan).pipe(delay(500)); // Симуляция задержки
    } else {
      return of(null).pipe(delay(500)); // Возвращаем null, если проект не найден
    }
  }


  // GET: получение папок по проекту
  getProjectFolders(projectId: number | null): Observable<Folder[]> {
    const project = this._projects.find(p => p.id === projectId);
    if (project) {
      if (project.testPlan) {
        const folders = project.testPlan.flatMap(testPlan => testPlan.folders);
        folders.forEach(folder => {
        });
        return of(folders).pipe(delay(500)); // Симуляция задержки
      }
    }
    return of([]).pipe(delay(500)); // Возвращаем пустой массив, если проект не найден или нет testPlan
  }

  // GET: получение определенного тест-плана по id
  getTestPlanById(projectId: number, testPlanId: number): Observable<any | undefined> {
    const project = this._projects.find(p => p.id === projectId);
    if (project) {
      if (project.testPlan) {
        const testPlan = project.testPlan.find(tp => tp.id === testPlanId);
        return of(testPlan).pipe(delay(500)); // Симуляция задержки
      }
    }
    return of(undefined).pipe(delay(500)); // Возвращаем undefined, если проект не найден или нет testPlan
  }

  addFolder(projectId: number | null, parentFolderId: number, name: string): void {
    const project = this._projects.find(p => p.id === projectId);
    const id = this.getMaxFolderId(projectId) + 1;
    const newFolder: Folder = {
      id: id,
      name: name,
      parentFolderId: parentFolderId,
      folders: [],
      testCases: [],
      type: 'folder'
    }

    if (project) {
      console.log('project: ',project);
      const addFolderRecursively = (folders: Folder[]): boolean => {

        for (const folder of folders) {
          if (folder.id === parentFolderId) {
            folder.folders = folder.folders || [];
            folder.folders.push(newFolder);
            console.log('Projects:  ', this._projects)
            return true;
          }
          if (folder.folders) {
            const added = addFolderRecursively(folder.folders);
            if (added) return true;
          }
        }
        return false;
      };
      if (project.testPlan) {
        for (const testPlan of project.testPlan) {
          if (addFolderRecursively(testPlan.folders)) {
            break;
          }
        }
      }

    }
  }


  deleteFolder(projectId: number | null, folderId: number): Observable<Folder[] | undefined> {
    const project: Project | undefined = this._projects.find(p => p.id === projectId);
    if (project && project.testPlan) {
      for (const testPlan of project.testPlan) {
        this.removeFolderRecursively(testPlan.folders, folderId);
      }
    }

    return of(project?.folder).pipe(delay(500)); // Return the updated project with a simulated delay
  }

  private removeFolderRecursively(folders: Folder[] | undefined, folderId: number): boolean  {
    if(!folders){
      return false;
    }
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        folders.splice(i, 1);
        return true;
      } else if (folders[i].folders) {
        const removed = this.removeFolderRecursively(folders[i].folders, folderId);
        if (removed) {
          return true;
        }
      }
    }
    return false;
  }

  getMaxFolderId(projectId: number | null): number {
    const project = this._projects.find(p => p.id === projectId);
    let maxId = 0;

    if (project) {
      const findMaxIdRecursively = (folders: Folder[]): void => {
        for (const folder of folders) {
          if (folder.id > maxId) {
            maxId = folder.id;
          }
          if (folder.folders) {
            findMaxIdRecursively(folder.folders);
          }
        }
      };
      if (project.testPlan) {
        for (const testPlan of project.testPlan) {
          findMaxIdRecursively(testPlan.folders);
        }
      }

    }
    return maxId;
  }

  addTestCase(projectId: number, folderId: number, testCase: TestCase): void {
    this.testCaseIdCounter +=1;
    testCase.id = this.testCaseIdCounter;
    const project = this._projects.find(p => p.id === +projectId);

    if (!project) {
      console.error(`Project with ID ${projectId} not found.`);
      return;
    }

    const addTestCaseRecursively = (folders: Folder[]): boolean => {
      for (const folder of folders) {
        if (folder.id === folderId) {
          folder.testCases = folder.testCases || [];
          folder.testCases.push(testCase);
          return true;
        }
        if (folder.folders) {
          const added = addTestCaseRecursively(folder.folders);
          if (added) return true;
        }
      }
      return false;
    };

    if (project.testPlan) {
      for (const testPlan of project.testPlan) {
        if (addTestCaseRecursively(testPlan.folders)) {
          console.log(`Test case added to folder ID ${folderId} in project ID ${projectId}.`);
          return;
        }
      }
    }
    console.error(`Folder with ID ${folderId} not found in project ID ${projectId}.`);
  }

  removeTestCase(projectId: number, folderId: number, testCaseId: number): void {
    const project = this._projects.find(p => p.id === projectId);

    if (!project) {
      console.error(`Project with ID ${projectId} not found.`);
      return;
    }

    const removeTestCaseRecursively = (folders: Folder[]): boolean => {
      for (const folder of folders) {
        if (folder.id === folderId) {
          const index = folder.testCases.findIndex(tc => tc.id === testCaseId);
          if (index !== -1) {
            folder.testCases.splice(index, 1);
            console.log(`Test case ID ${testCaseId} removed from folder ID ${folderId}.`);
            return true;
          }
        }
        if (folder.folders) {
          const removed = removeTestCaseRecursively(folder.folders);
          if (removed) return true;
        }
      }
      return false;
    };

    if (project.testPlan) {
      for (const testPlan of project.testPlan) {
        if (removeTestCaseRecursively(testPlan.folders)) {
          return;
        }
      }
    }
    console.error(`Test case ID ${testCaseId} not found in folder ID ${folderId} or folder not found in project ID ${projectId}.`);
  }


  getAllProjectTestCases(projectId: number): Observable<TestCase[]> {
    const project = this._projects.find(p => p.id === projectId);
    let allTestCases: TestCase[] = [];

    if (project && project.testPlan) {
      const collectTestCasesRecursively = (folders: Folder[]): void => {
        for (const folder of folders) {
          if (folder.testCases) {
            allTestCases = allTestCases.concat(folder.testCases);
          }
          if (folder.folders) {
            collectTestCasesRecursively(folder.folders);
          }
        }
      };

      for (const testPlan of project.testPlan) {
        collectTestCasesRecursively(testPlan.folders);
      }
    }

    return of(allTestCases).pipe(delay(500)); // Симуляция задержки
  }
  getTestCasesInFolder(projectId: number, folderId: number): Observable<TestCase[]> {
    const project = this._projects.find(p => p.id === projectId);

    if (project && project.testPlan) {
      const collectTestCasesRecursively = (folders: Folder[]): TestCase[] => {
        let testCases: TestCase[] = [];

        for (const folder of folders) {
          // Если находим папку с нужным ID, добавляем её тест-кейсы
          if (folder.id === folderId) {
            testCases = testCases.concat(folder.testCases);

            // Рекурсивно собираем тест-кейсы из всех вложенных папок
            const gatherNestedTestCases = (nestedFolders: Folder[]) => {
              for (const nestedFolder of nestedFolders) {
                testCases = testCases.concat(nestedFolder.testCases);
                if (nestedFolder.folders) {
                  gatherNestedTestCases(nestedFolder.folders);
                }
              }
            };

            if (folder.folders) {
              gatherNestedTestCases(folder.folders);
            }

            break; // Останавливаем цикл, т.к. нужная папка найдена
          } else if (folder.folders) {
            // Продолжаем поиск в вложенных папках
            testCases = testCases.concat(collectTestCasesRecursively(folder.folders));
          }
        }

        return testCases;
      };

      for (const testPlan of project.testPlan) {
        const testCases = collectTestCasesRecursively(testPlan.folders);
        if (testCases.length) {
          return of(testCases).pipe(delay(500)); // Симуляция задержки
        }
      }
    }

    return of([]).pipe(delay(500)); // Возвращаем пустой массив, если папка не найдена
  }


  getTestCaseById(projectId: number, testCaseId: number): Observable<TestCase | undefined> {
    const project = this._projects.find(p => p.id === projectId);

    if (!project || !project.folder) {
      return of(undefined).pipe(delay(500)); // Возвращаем undefined, если проект или папки не найдены
    }

    const findTestCaseRecursively = (folders: Folder[]): TestCase | undefined => {
      for (const folder of folders) {
        // Ищем тест-кейс в текущей папке
        const foundTestCase = folder.testCases?.find(tc => tc.id === testCaseId);
        if (foundTestCase) {
          return foundTestCase;
        }

        // Продолжаем искать в вложенных папках
        if (folder.folders) {
          const nestedFoundTestCase = findTestCaseRecursively(folder.folders);
          if (nestedFoundTestCase) {
            return nestedFoundTestCase;
          }
        }
      }

      return undefined; // Возвращаем undefined, если тест-кейс не найден
    };

    // Начинаем поиск в корневом массиве папок проекта
    const testCase = findTestCaseRecursively(project.folder);

    return of(testCase).pipe(delay(500)); // Возвращаем найденный тест-кейс или undefined с задержкой
  }

  addFolderToTestPlan(projectId: number, testPlanId: number, folder: Folder): Observable<Folder> {
    const project = this._projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    const testPlan = project.testPlan?.find(tp => tp.id === testPlanId);
    if (!testPlan) {
      throw new Error(`Test plan with ID ${testPlanId} not found.`);
    }

    const folderExists = (folders: Folder[], folderId: number): boolean => {
      for (const existingFolder of folders) {
        if (existingFolder.id === folderId) {
          return true;
        }
        if (existingFolder.folders && folderExists(existingFolder.folders, folderId)) {
          return true;
        }
      }
      return false;
    };

    if (folderExists(testPlan.folders, folder.id)) {
      throw new Error(`Folder with ID ${folder.id} already exists in the test plan.`);
    }

    testPlan.folders.push(folder);
    return of(folder).pipe(delay(500)); // Симуляция задержки
  }


  addTestCasesToTestPlanFolder(projectId: number, testPlanId: number, folderId: number, testCases: TestCase[]): Observable<TestCase[]> {
    const project = this._projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    const testPlan = project.testPlan?.find(tp => tp.id === testPlanId);
    if (!testPlan) {
      throw new Error(`Test plan with ID ${testPlanId} not found.`);
    }

    const findFolderRecursively = (folders: Folder[], folderId: number): Folder | undefined => {
      for (const folder of folders) {
        if (folder.id === folderId) {
          return folder;
        }
        if (folder.folders) {
          const foundFolder = findFolderRecursively(folder.folders, folderId);
          if (foundFolder) {
            return foundFolder;
          }
        }
      }
      return undefined;
    };

    const folder = findFolderRecursively(testPlan.folders, folderId);
    if (!folder) {
      throw new Error(`Folder with ID ${folderId} not found in test plan.`);
    }

    const existingTestCaseIds = new Set(folder.testCases.map(tc => tc.id));
    const duplicateTestCases = testCases.filter(tc => existingTestCaseIds.has(tc.id));

    if (duplicateTestCases.length > 0) {
      throw new Error(`Test case(s) with ID(s) ${duplicateTestCases.map(tc => tc.id).join(', ')} already exist in the folder.`);
    }

    folder.testCases.push(...testCases);
    return of(testCases).pipe(delay(500)); // Симуляция задержки
  }



}

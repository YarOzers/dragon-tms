import {Injectable} from '@angular/core';
import {Project} from "../models/project";
import {delay, map, Observable, of} from "rxjs";
import {TestCase} from "../models/test-case";
import {Folder} from "../models/folder";
import {TestPlan} from "../models/test-plan";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private folder5: Folder = {
    id: 5,
    parentFolderId: 4,
    name: 'folder 5',
    testCases: [{
      "id": 5,
      "name": "cxv",
      "lastDataIndex": 0,
      "folderId": 5,
      "folder": "folder 5",
      "type": "testCase",
      "author": {
        "id": 1,
        "role": "admin",
        "name": "Ярослав Андреевич",
        "rights": "super"
      },
      "data": [
        {
          "status": "ready",
          "automationFlag": "auto",
          "changesAuthor": {
            "id": 1,
            "role": "admin",
            "name": "Ярослав Андреевич",
            "rights": "super"
          },
          "createdTime": null,
          "executionTime": "23:35",
          "expectedExecutionTime": "00:00",
          "name": "",
          "preConditionItems": [
            {
              "id": 1,
              "selected": false,
              "action": "xcv",
              "expectedResult": "xcv"
            }
          ],
          "stepItems": [
            {
              "id": 1,
              "selected": false,
              "action": "xcv",
              "expectedResult": "xcv"
            }
          ],
          "postConditionItems": [
            {
              "id": 1,
              "selected": false,
              "action": "xcv",
              "expectedResult": "cxv"
            }
          ],
          "priority": "Highest",
          "type": "functional",
          "version": 1
        }
      ],
      "loading": null,
      "new": true,
      "results": [],
      "selected": null,
      "automationFlag": "auto"
    }],
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
    testCases: [{
      "id": 1,
      "name": "asd",
      "lastDataIndex": 0,
      "folderId": 0,
      "folder": "root_folder",
      "type": "testCase",
      "author": {
        "id": 1,
        "role": "admin",
        "name": "Ярослав Андреевич",
        "rights": "super"
      },
      "data": [
        {
          "status": "ready",
          "automationFlag": "auto",
          "changesAuthor": {
            "id": 1,
            "role": "admin",
            "name": "Ярослав Андреевич",
            "rights": "super"
          },
          "createdTime": null,
          "executionTime": "11:01",
          "expectedExecutionTime": "00:00",
          "name": "",
          "preConditionItems": [
            {
              "id": 1,
              "selected": false,
              "action": "sdf",
              "expectedResult": "sdf"
            }
          ],
          "stepItems": [
            {
              "id": 1,
              "selected": false,
              "action": "sdf",
              "expectedResult": "sdf"
            }
          ],
          "postConditionItems": [
            {
              "id": 1,
              "selected": false,
              "action": "sdf",
              "expectedResult": "sdf"
            }
          ],
          "priority": "Highest",
          "type": "functional",
          "version": 1
        }
      ],
      "loading": null,
      "new": true,
      "results": [],
      "selected": null,
      "automationFlag": "auto",
      "isRunning": false
    },
      {
        "id": 2,
        "name": "ggg",
        "lastDataIndex": 0,
        "folderId": 0,
        "folder": "root_folder",
        "type": "testCase",
        "author": {
          "id": 2,
          "role": "admin",
          "name": "Ярослав Андреевич",
          "rights": "super"
        },
        "data": [
          {
            "status": "ready",
            "automationFlag": "auto",
            "changesAuthor": {
              "id": 1,
              "role": "admin",
              "name": "Ярослав Андреевич",
              "rights": "super"
            },
            "createdTime": null,
            "executionTime": "11:01",
            "expectedExecutionTime": "00:00",
            "name": "",
            "preConditionItems": [
              {
                "id": 1,
                "selected": false,
                "action": "dsf",
                "expectedResult": "sdf"
              }
            ],
            "stepItems": [
              {
                "id": 1,
                "selected": false,
                "action": "sdf",
                "expectedResult": "sdf"
              }
            ],
            "postConditionItems": [
              {
                "id": 1,
                "selected": false,
                "action": "sdf",
                "expectedResult": "sdf"
              }
            ],
            "priority": "Highest",
            "type": "functional",
            "version": 1
          }
        ],
        "loading": null,
        "new": true,
        "results": [],
        "selected": null,
        "automationFlag": "auto"
      },
      {
        "id": 3,
        "name": "cxv",
        "lastDataIndex": 0,
        "folderId": 0,
        "folder": "root_folder",
        "type": "testCase",
        "author": {
          "id": 1,
          "role": "admin",
          "name": "Ярослав Андреевич",
          "rights": "super"
        },
        "data": [
          {
            "status": "ready",
            "automationFlag": "auto",
            "changesAuthor": {
              "id": 1,
              "role": "admin",
              "name": "Ярослав Андреевич",
              "rights": "super"
            },
            "createdTime": null,
            "executionTime": "23:35",
            "expectedExecutionTime": "00:00",
            "name": "",
            "preConditionItems": [
              {
                "id": 1,
                "selected": false,
                "action": "xcv",
                "expectedResult": "xcv"
              }
            ],
            "stepItems": [
              {
                "id": 1,
                "selected": false,
                "action": "xcv",
                "expectedResult": "xcv"
              }
            ],
            "postConditionItems": [
              {
                "id": 1,
                "selected": false,
                "action": "xcv",
                "expectedResult": "cxv"
              }
            ],
            "priority": "Highest",
            "type": "functional",
            "version": 1
          }
        ],
        "loading": null,
        "new": true,
        "results": [],
        "selected": null,
        "automationFlag": "auto"
      },
      {
        "id": 4,
        "name": "cxv",
        "lastDataIndex": 0,
        "folderId": 0,
        "folder": "root_folder",
        "type": "testCase",
        "author": {
          "id": 1,
          "role": "admin",
          "name": "Ярослав Андреевич",
          "rights": "super"
        },
        "data": [
          {
            "status": "ready",
            "automationFlag": "auto",
            "changesAuthor": {
              "id": 1,
              "role": "admin",
              "name": "Ярослав Андреевич",
              "rights": "super"
            },
            "createdTime": null,
            "executionTime": "23:35",
            "expectedExecutionTime": "00:00",
            "name": "",
            "preConditionItems": [
              {
                "id": 1,
                "selected": false,
                "action": "xcv",
                "expectedResult": "xcv"
              }
            ],
            "stepItems": [
              {
                "id": 1,
                "selected": false,
                "action": "xcv",
                "expectedResult": "xcv"
              }
            ],
            "postConditionItems": [
              {
                "id": 1,
                "selected": false,
                "action": "xcv",
                "expectedResult": "cxv"
              }
            ],
            "priority": "Highest",
            "type": "functional",
            "version": 1
          }
        ],
        "loading": null,
        "new": true,
        "results": [],
        "selected": null,
        "automationFlag": "auto"
      }],
    folders: [this.folder1, this.folder2, this.folder3],
    type: 'folder',
    selected: false
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
        folders: [this.folder1]
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
      if (project.folder) {

        return of(project.folder).pipe(delay(500)); // Симуляция задержки
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

    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    const id = this.getMaxFolderId(projectId) + 1;
    const newFolder: Folder = {
      id: id,
      name: name,
      parentFolderId: parentFolderId,
      folders: [],
      testCases: [],
      type: 'folder'
    };

    const addFolderRecursively = (folders: Folder[]): boolean => {
      for (const folder of folders) {
        if (folder.id === parentFolderId) {
          folder.folders = folder.folders || [];
          folder.folders.push(newFolder);
          console.log('Projects:  ', this._projects);
          return true;
        }
        if (folder.folders) {
          const added = addFolderRecursively(folder.folders);
          if (added) return true;
        }
      }
      return false;
    };
    if (project.folder) {
      if (!addFolderRecursively(project.folder)) {
        throw new Error(`Parent folder with ID ${parentFolderId} not found in project.`);
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

  private removeFolderRecursively(folders: Folder[] | undefined, folderId: number): boolean {
    if (!folders) {
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
    this.testCaseIdCounter += 1;
    testCase.id = this.testCaseIdCounter;

    // Ищем проект по ID
    const project = this._projects.find(p => p.id === Number(projectId));
    if (!project) {
      console.error(`Project with ID ${projectId} not found.`);
      return;
    }

    // Функция для рекурсивного поиска папки и добавления тест-кейса
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

    // Добавляем тест-кейс в нужную папку проекта
    if (project.folder) {
      if (addTestCaseRecursively(project.folder)) {
        console.log(`Test case added to folder ID ${folderId} in project ID ${projectId}.`);
      } else {
        console.error(`Folder with ID ${folderId} not found in project ID ${projectId}.`);
      }
    }

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

    if (!project) {
      console.error(`Project with ID ${projectId} not found.`);
      return of([]).pipe(delay(500)); // Возвращаем пустой массив, если проект не найден
    }

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

          return testCases; // Возвращаем найденные тест-кейсы
        } else if (folder.folders) {
          // Продолжаем поиск в вложенных папках
          const nestedTestCases = collectTestCasesRecursively(folder.folders);
          if (nestedTestCases.length) {
            return nestedTestCases; // Возвращаем тест-кейсы, если они найдены в вложенных папках
          }
        }
      }

      return testCases; // Возвращаем тест-кейсы (возможно, пустой массив) если ничего не найдено в папке
    };

    // Проверяем папки в проекте
    if (project.folder) {
      const testCases = collectTestCasesRecursively(project.folder);
      return of(testCases).pipe(delay(500)); // Возвращаем найденные тест-кейсы с симуляцией задержки
    }
    return of([]).pipe(delay(500));
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

  addFolderToTestPlan(projectId: number, testPlanId: number, folderId: number): Observable<Folder> {
    const project = this._projects.find(p => p.id === projectId);

    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    const testPlan = project.testPlan?.find(tp => tp.id === testPlanId);

    if (!testPlan) {
      throw new Error(`Test plan with ID ${testPlanId} not found.`);
    }

    const findFolderById = (folders: Folder[] | undefined, id: number): Folder | null => {
      if (folders) {
        for (const folder of folders) {
          if (folder.id === id) {
            return folder;
          }
          if (folder.folders) {
            const foundFolder = findFolderById(folder.folders, id);
            if (foundFolder) {
              return foundFolder;
            }
          }
        }
      }

      return null;
    };

    const folder = findFolderById(project.folder, folderId);

    if (!folder) {
      throw new Error(`Folder with ID ${folderId} not found in project.`);
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

    // Создаем глубокую копию папки и её содержимого, чтобы избежать мутаций
    const cloneFolder = (folder: Folder): Folder => {
      return {
        ...folder,
        folders: folder.folders?.map(cloneFolder),
        testCases: [...folder.testCases]
      };
    };

    const clonedFolder = cloneFolder(folder);

    testPlan.folders.push(clonedFolder);

    return of(clonedFolder).pipe(delay(500)); // Симуляция задержки
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

  getTestPlanFolders(projectId: number | null, testPlanId: number | null): Observable<Folder[]> {
    if (projectId === null || testPlanId === null) {
      return of([]).pipe(delay(500)); // Возвращаем пустой массив, если projectId или testPlanId не указаны
    }

    const project = this._projects.find(p => p.id === projectId);

    if (!project) {
      console.error(`Project with ID ${projectId} not found.`);
      return of([]).pipe(delay(500)); // Возвращаем пустой массив, если проект не найден
    }

    const testPlan = project.testPlan?.find(tp => tp.id === testPlanId);

    if (!testPlan) {
      console.error(`Test plan with ID ${testPlanId} not found.`);
      return of([]).pipe(delay(500)); // Возвращаем пустой массив, если тест-план не найден
    }

    return of(testPlan.folders).pipe(delay(500)); // Возвращаем папки тест-плана с симуляцией задержки
  }

  getTestCasesInTestPlanFolder(projectId: number, testPlanId: number, folderId: number): Observable<TestCase[]> {
    const project = this._projects.find(p => p.id === projectId);

    if (!project || !project.testPlan) {
      console.error(`Project with ID ${projectId} or Test Plan with ID ${testPlanId} not found.`);
      return of([]).pipe(delay(500)); // Возвращаем пустой массив, если проект или тест-план не найдены
    }

    const testPlan = project.testPlan.find(tp => tp.id === testPlanId);

    if (!testPlan) {
      console.error(`Test Plan with ID ${testPlanId} not found in project with ID ${projectId}.`);
      return of([]).pipe(delay(500)); // Возвращаем пустой массив, если тест-план не найден
    }

    const findFolderById = (folders: Folder[], id: number): Folder | null => {
      for (const folder of folders) {
        if (folder.id === id) {
          return folder;
        }
        if (folder.folders) {
          const foundFolder = findFolderById(folder.folders, id);
          if (foundFolder) {
            return foundFolder;
          }
        }
      }
      return null;
    };

    const collectTestCasesRecursively = (folder: Folder): TestCase[] => {
      let testCases = [...folder.testCases];

      for (const nestedFolder of folder.folders || []) {
        testCases = testCases.concat(collectTestCasesRecursively(nestedFolder));
      }

      return testCases;
    };

    const targetFolder = findFolderById(testPlan.folders, folderId);

    if (targetFolder) {
      const testCases = collectTestCasesRecursively(targetFolder);
      return of(testCases).pipe(delay(500)); // Возвращаем все найденные тест-кейсы с симуляцией задержки
    }

    console.error(`Folder with ID ${folderId} not found in Test Plan with ID ${testPlanId}.`);
    return of([]).pipe(delay(500)); // Возвращаем пустой массив, если папка не найдена
  }

  // Функция для обновления или добавления тестплана в проект
  updateTestPlan(projectId: number, testPlan: TestPlan): Observable<TestPlan | null> {
    console.log("updateTestPlan, testPlan:: ", testPlan);
    const project = this._projects.find(p => p.id === projectId);

    if (project && project.testPlan) {
      const existingTestPlanIndex = project.testPlan.findIndex(tp => tp.id === testPlan.id);
      if (existingTestPlanIndex !== -1) {

        // Если тестплан с таким id уже существует, заменяем его
        project.testPlan[existingTestPlanIndex] = testPlan;
        console.log('Замена тест плана!!!!  ', project.testPlan);
        console.log('Замена тест плана!!!!  ', this._projects);
      } else {
        // Если тестплан с таким id не существует, добавляем новый
        project.testPlan.push(testPlan);
        console.log('Добавление нового тест-плана project.testPlan::   ', project.testPlan);
        console.log('Добавление нового тест-плана this._projects::   ', this._projects);
      }
      return of(testPlan).pipe(delay(500)); // Симуляция задержки
    } else {
      return of(null).pipe(delay(500)); // Возвращаем null, если проект не найден
    }
  }

  // Примерный метод для получения данных
  getFolders(projectId: string, testPlanId: string): Observable<Folder[]> {
    // Здесь должен быть запрос к API, возвращающий Observable<Folder[]>
    // Пример:
    // return this.http.get<Folder[]>(`/api/projects/${projectId}/testPlans/${testPlanId}/folders`);

    // Для примера вернем mock-данные:
    const folders: Folder[] = [
      // Структура папок
    ];

    return of(folders);
  }

// Метод для фильтрации папок
  getSelectedFolders(projectId: number, testPlanId: number): Observable<Folder[]> {
    // Находим нужный проект и тест-план
    const project = this._projects.find(p => p.id === projectId);
    if (project?.testPlan) {
      const testPlan = project?.testPlan.find(tp => tp.id === testPlanId);
      // Если проект или тест-план не найдены, возвращаем пустой массив
      if (!testPlan) {
        return of([]); // Возвращаем пустой Observable массива
      }
      // Фильтруем папки
      const filteredFolders = this.filterFolders(testPlan.folders);

      // Возвращаем результат как Observable
      return of(filteredFolders);
    } else {
      return of([]); // Возвращаем пустой Observable массива
    }
  }

  // Рекурсивная функция для фильтрации папок
  private filterFolders(folders: Folder[]): Folder[] {
    return folders
      .map(folder => {
        // Фильтруем тест-кейсы, оставляя только те, у которых selected == true
        const filteredTestCases = folder.testCases.filter(testCase => testCase.selected);

        // Рекурсивно фильтруем подпапки
        const filteredSubFolders = folder.folders ? this.filterFolders(folder.folders) : [];

        // Возвращаем папку, если у нее есть выбранные тест-кейсы или подпапки
        return {
          ...folder,
          testCases: filteredTestCases,
          folders: filteredSubFolders
        };
      })
      // Удаляем папки, если у них нет выбранных тест-кейсов и подпапок
      .filter(folder => folder.testCases.length > 0 || (folder.folders && folder.folders.length > 0));
  }

}

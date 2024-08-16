import {User} from "./user";
import {TestPlan} from "./test-plan";
import {Folder} from "./folder";

export interface Project {
  id?: number;
  name: string;
  authorId?: number;
  users?: User[];
  folder?: Folder[];
  testPlan?: TestPlan[];
  createdDate?: string;
}

export interface ProjectDTO {
  name: string;
  authorId: number;
  users?: User[];
  folder?: Folder[];
  testPlan?: TestPlan[];
  createdDate?: string;
}

export interface CreateDTO{
  name: string;
  userIDs? : number[];
}

export interface UpdateProjectDTO {
  name?: string;
  userIds?: number[];
  folderIds?: number[];
  testPlanIds?: number[];
}

export interface ProjectFilterDTO {
  name?: string;
  createdAfter?: string;  // Дата, после которой проекты были созданы
  userIds?: number[];
}

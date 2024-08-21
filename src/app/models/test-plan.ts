import {User} from "./user";
import {Folder} from "./folder";

export interface TestPlan {
  id?: number;
  name: string;
  createdDate: string;
  author: string;
  startDate?: string;
  finishDate?: string;
  testCaseCount: number;
  status: 'await' | 'process' | 'finished' | 'AWAIT' | 'PROCESS' | 'FINISHED' | any;
  qas: User[];
  folders: Folder[];
  testCaseIds?: number[]
}

import {User} from "./user";
import {Folder} from "./folder";

export interface TestPlan {
  id: number;
  name: string;
  createdDate: string;
  author: string;
  startDate?: string;
  finishDate?: string;
  testCaseCount: number;
  status: 'await' | 'process' | 'finished';
  qas: User[];
  folders: Folder[];
}

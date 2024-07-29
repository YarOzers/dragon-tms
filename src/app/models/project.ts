import {User} from "./user";
import {TestPlan} from "./test-plan";
import {Folder} from "./folder";

export interface Project {
  id: number;
  name: string;
  users?: User[];
  folder?: Folder[];
  testPlan?: TestPlan[];
  createdDate?: string;
}

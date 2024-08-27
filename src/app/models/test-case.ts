
import {User} from "./user";

export interface TestCase {
  id?: any;
  name: string;
  folderId: number | null;
  folderName: string;
  type: 'testCase' | 'checkList' | 'TESTCASE' | 'CHECKLIST' | any;
  automationFlag? : 'auto' | 'manual' | 'AUTO' | 'MANUAL' | null | any
  // user: User;
  data: TestCaseData[];
  lastDataIndex?: number;
  loading: boolean | null;
  new: boolean;
  results?: TestCaseResult[] | null;
  selected: boolean | null;
  isRunning?: boolean;
}

export interface TestCaseData {
  id?: number; // нужно добавить везде
  automationFlag: 'auto' | 'manual' | 'AUTO' | 'MANUAL' | null | any
  changesAuthor: User;
  createdTime: string | null;
  executionTime: string | null;
  expectedExecutionTime: string | null;
  name: string;
  preConditions: TestCasePreCondition[] | null; //+
  postConditions: TestCasePostCondition[] | null; //+
  priority: 'Highest' | 'High' | 'Medium' | 'Low' | 'HIGHEST' | 'HIGH'| 'MEDIUM' | 'LOW' | null | any;
  steps: TestCaseStep[] | null; //*
  testCaseType: 'functional' | 'system' | 'performance' | 'regression' | 'unit' | 'security' | 'localization' | 'usability' | null | number| 'FUNCTIONAL' | 'SYSTEM' | 'PERFORMANCE' | 'REGRESSION' | 'UNIT' | 'SECURITY' | 'LOCALIZATION' | 'USABILITY' | any;
  version: number;
  status: 'ready' | 'not ready' | 'requires updating' | 'READY' | 'NOT_READY' | 'REQUIRES UPDATING' | any
}

export interface TestCaseResult {
  id?: number;
  user?: User;
  executedTime?: string;
  timeSpent: string;
  result: 'awaits' | 'in_process' | 'successfully' | 'failed' | 'blocked' | null | 'AWAITS' | 'IN_PROGRESS' | 'SUCCESSFULLY' | 'FAILED' | 'BLOCKED' | any;
  testPlanId? : number;
}

export interface TestCaseStep {
  id?: number;
  index: number;
  selected: boolean;
  action: string;
  expectedResult?: string
}

export interface TestCasePreCondition {
  selected: boolean;
  index: number;
  id?: number;
  action: string;
  expectedResult?: string
}

export interface TestCasePostCondition {
  selected: boolean;
  index: number;
  id?: number;
  action: string;
  expectedResult?: string
}

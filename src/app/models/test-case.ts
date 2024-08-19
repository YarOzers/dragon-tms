
import {User} from "./user";

export interface TestCase {
  id?: any;
  name: string;
  folderId: number | null;
  folderName: string;
  type: 'testCase' | 'checkList' | 'TESTCASE' | 'CHECKLIST' | any;
  automationFlag? : 'auto' | 'manual' | 'AUTO' | 'MANUAL' | null | any
  author: User;
  data: TestCaseData[];
  lastDataIndex?: number;
  loading: boolean | null;
  new: boolean;
  results?: testCaseResult[] | null;
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
  preConditionItems: TestCasePreCondition[] | null; //+
  postConditionItems: TestCasePostCondition[] | null; //+
  priority: 'Highest' | 'High' | 'Medium' | 'Low' | 'HIGHEST' | 'HIGH'| 'MEDIUM' | 'LOW' | null | any;
  stepItems: TestCaseStep[] | null; //*
  type: 'functional' | 'system' | 'performance' | 'regression' | 'unit' | 'security' | 'localization' | 'usability' | null | number| 'FUNCTIONAL' | 'SYSTEM' | 'PERFORMANCE' | 'REGRESSION' | 'UNIT' | 'SECURITY' | 'LOCALIZATION' | 'USABILITY' | any;
  version: number;
  status: 'ready' | 'not ready' | 'requires updating' | 'READY' | 'NOT_READY' | 'REQUIRES UPDATING' | any
}

export interface testCaseResult {
  id: number;
  author?: User;
  executedTime?: string;
  result: 'awaits' | 'in_process' | 'successfully' | 'failed' | 'blocked' | null | 'AWAITS' | 'IN_PROGRESS' | 'SUCCESSFULLY' | 'FAILED' | 'BLOCKED' | any;
  testPlanId? : string;
}

export interface TestCaseStep {
  id: number;
  selected: boolean;
  action: string;
  expectedResult?: string
}

export interface TestCasePreCondition {
  selected: boolean;
  id: number;
  action: string;
  expectedResult?: string
}

export interface TestCasePostCondition {
  selected: boolean;
  id: number;
  action: string;
  expectedResult?: string
}

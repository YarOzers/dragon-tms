
import {User} from "./user";

export interface TestCase {
  id: number;
  name: string;
  folderId: number | null;
  folderName: string;
  type: 'testCase' | 'checkList';
  automationFlag? : 'auto' | 'manual' | null
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
  automationFlag: 'auto' | 'manual' | null
  changesAuthor: User;
  createdTime: string | null;
  executionTime: string | null;
  expectedExecutionTime: string | null;
  name: string;
  preConditionItems: TestCasePreCondition[] | null; //+
  postConditionItems: TestCasePostCondition[] | null; //+
  priority: 'Highest' | 'High' | 'Medium' | 'Low' | null;
  stepItems: TestCaseStep[] | null; //*
  type: 'functional' | 'system' | 'performance' | 'regression' | 'unit' | 'security' | 'localization' | 'usability' | null;
  version: number;
  status: 'ready' | 'not ready' | 'requires updating'
}

export interface testCaseResult {
  id: number;
  author?: User;
  executedTime?: string;
  result: 'awaits' | 'in_process' | 'successfully' | 'failed' | 'blocked' | null;
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

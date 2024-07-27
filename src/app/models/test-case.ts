//
// import {User} from "./user";
//
// export interface TestCase {
//   id: number;
//   author: User;
//   data: testCaseData[],
//   folder: string | null;
//   loading: boolean | null;
//   new: boolean;
//   results: testCaseResult[]
//   selected: boolean | null;
// }
//
// export interface testCaseData {
//   automationFlag: 'auto' | 'manual';
//   changesAuthor: User;
//   createdTime: string | null;
//   executionTime: string | null;
//   expectedExecutionTime: string | null;
//   name: string;
//   preConditionItems: TestCasePreCondition[] | null;
//   postConditionItems: TestCasePostCondition[] | null;
//   priority: 'High' | 'Medium' | 'Low';
//   stepItems: TestCaseStep[] | null;
//   type: 'functional' | 'system' | 'performance' | 'regression' | 'unit' | 'security' | 'localization' | 'usability';
//   version: string;
// }
//
// export interface testCaseResult {
//   id: number;
//   author: User;
//   executedTime: string;
//   result: 'awaits' | 'in_process' | 'successfully' | 'failed' | 'blocked';
// }
//
// export interface TestCaseStep {
//   id: number;
//   selected: boolean;
//   action: string;
//   expectedResult: string
// }
//
// export interface TestCasePreCondition {
//   selected: boolean;
//   id: number;
//   action: string;
//   expectedResult: string
// }
//
// export interface TestCasePostCondition {
//   selected: boolean;
//   id: number;
//   action: string;
//   expectedResult: string
// }

import {Folder} from "./folder";

export interface TestCase{
  id: number;
  name: string;
  folder: string;
  type: 'testCase'
}

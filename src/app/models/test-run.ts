import {AutotestResult} from "./autotest-result";

export interface TestRun{
  id: number;
  userId: number;
  testPlanId: number;
  projectId: number;
  name: string;
  created: string;
  autotestResults: AutotestResult[];
}

import {AutotestResult} from "./autotest-result";

export interface TestRun{
  id: number;
  userName: string;
  testPlanName: string;
  projectName: string;
  name?: string;
  createdDate: string;
  autotestResultList: AutotestResult[];
}

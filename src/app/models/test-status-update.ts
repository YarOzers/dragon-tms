import {AutotestResult} from "./autotest-result";

interface TestStatusUpdate {
  status: string;
  testIds?: string[];
  results?: AutotestResult[]; // если результаты иногда приходят массивом
}

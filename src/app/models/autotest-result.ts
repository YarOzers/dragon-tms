export interface AutotestResult{
  AS_ID: string;
  status: string;
  finishTime: string;
  userId: string;
  testPlanId?: string;
  testRunId: string;
}

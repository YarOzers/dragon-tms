import {Routes} from '@angular/router';
import {ListProjectComponent} from "./components/project/list-project/list-project.component";
import {MainContainerComponent} from "./components/main-container/main-container.component";
import {DetailProjectComponent} from "./components/project/detail-project/detail-project.component";
import {CreateTestPlanComponent} from "./components/plan/create-test-plan/create-test-plan.component";
import {ListTestCaseComponent} from "./components/case/list-test-case/list-test-case.component";
import {ExecuteTestPlanComponent} from "./components/plan/execute-test-plan/execute-test-plan.component";

export const routes: Routes = [
  {
    path: '', component: MainContainerComponent,
    children: [
      {path: '', component: ListProjectComponent},
      {path: 'project-detail/:projectId', component: DetailProjectComponent},
      {path: 'project-detail/:projectId/test-plan-create/:testPlanId', component: ExecuteTestPlanComponent},
      {path: 'project-detail/:projectId/testcases', component: ListTestCaseComponent}
    ]
  }
];

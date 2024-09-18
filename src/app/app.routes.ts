import {Routes} from '@angular/router';
import {ListProjectComponent} from "./components/project/list-project/list-project.component";
import {MainContainerComponent} from "./components/main-container/main-container.component";
import {DetailProjectComponent} from "./components/project/detail-project/detail-project.component";
import {ListTestCaseComponent} from "./components/case/list-test-case/list-test-case.component";
import {ExecuteTestPlanComponent} from "./components/plan/execute-test-plan/execute-test-plan.component";
import {redirectGuard} from "./components/guard/redirect.guard";
import {KeycloakAuthGuard} from "keycloak-angular";
import {TestRunsComponent} from "./components/test-runs/test-runs.component";

export const routes: Routes = [
  {
    path: '', component: MainContainerComponent,
    children: [
      {path: '', component: ListProjectComponent},
      {path: 'project/:projectId', component: DetailProjectComponent, canActivate: [redirectGuard]},
      {path: 'project/:projectId/testplan/:testPlanId', component: ExecuteTestPlanComponent, canActivate: [redirectGuard]},
      {path: 'project/:projectId/testcases', component: ListTestCaseComponent, canActivate: [redirectGuard]},
      {path: 'project/:projectId/test-runs', component: TestRunsComponent, canActivate: [redirectGuard]}
    ]
  }
];

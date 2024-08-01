import { Routes } from '@angular/router';
import {ListProjectComponent} from "./components/project/list-project/list-project.component";
import {MainContainerComponent} from "./components/main-container/main-container.component";
import {DetailProjectComponent} from "./components/project/detail-project/detail-project.component";

export const routes: Routes = [
  {path: '', component: MainContainerComponent,
  children:[
    {path: '', component: ListProjectComponent},
    {path: 'project-detail/:id', component: DetailProjectComponent}
  ]}
];

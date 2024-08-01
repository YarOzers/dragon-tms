import { Component } from '@angular/core';
import {ListTestPlanComponent} from "../../plan/list-test-plan/list-test-plan.component";

@Component({
  selector: 'app-detail-project',
  standalone: true,
  imports: [
    ListTestPlanComponent
  ],
  templateUrl: './detail-project.component.html',
  styleUrl: './detail-project.component.css'
})
export class DetailProjectComponent {

}

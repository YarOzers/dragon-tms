import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-create-test-plan',
  standalone: true,
  imports: [],
  templateUrl: './create-test-plan.component.html',
  styleUrl: './create-test-plan.component.css'
})
export class CreateTestPlanComponent implements OnInit {
  protected testPlan: any;
  private projectId: any;
  private testPlanId: any;

  constructor(private projectService: ProjectService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log('params id: ', params.get('projectId'))
      if (params.get('projectId')) {
        this.projectId = params.get('projectId');
      }
      if (params.get('testPlanId')) {
        this.testPlanId = params.get('testPlanId');
      }
    });
    if(this.projectId && this.testPlanId){
      this.projectService.getTestPlanById(Number(this.projectId),Number(this.testPlanId)).subscribe(
        {
          next: (testPlan)=>{
            this.testPlan = testPlan;
            console.log('testPlan from createTestPlan: ',testPlan);
          },
          error: (err)=>{
            console.error('Ошибка при загрузке тест плана: ',err);
          }
        }
      );
    }
  }


}

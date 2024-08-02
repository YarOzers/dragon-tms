import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../services/project.service";
import {ActivatedRoute} from "@angular/router";
import {RouterParamsService} from "../../../services/router-params.service";
import {TestPlan} from "../../../models/test-plan";
import {User} from "../../../models/user";
import {Folder} from "../../../models/folder";

@Component({
  selector: 'app-create-test-plan',
  standalone: true,
  imports: [],
  templateUrl: './create-test-plan.component.html',
  styleUrl: './create-test-plan.component.css'
})
export class CreateTestPlanComponent implements OnInit {
  private projectId: any;
  protected testPlanId: any = 0;
  protected testPlan: TestPlan = {
    id: this.testPlanId,
    name: '',
    createdDate: '',
    author: '',
    testCaseCount: 0,
    status: 'await',
    qas: [],
    folders: []
  };


  constructor(private projectService: ProjectService,
              private activatedRoute: ActivatedRoute,
              private routerParamsService: RouterParamsService) {
this.routerParamsService.projectId$.subscribe(id =>{
  if (id){
    this.projectId = id;
  }
  this.activatedRoute.paramMap.subscribe(params => {
    // console.log('params id: ', params.get('projectId'))
    // if (params.get('projectId')) {
    //   this.projectId = params.get('projectId');
    // }
    if (params.get('testPlanId')) {
      this.testPlanId = params.get('testPlanId');
    }
  });

})
  }

  ngOnInit(): void {
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

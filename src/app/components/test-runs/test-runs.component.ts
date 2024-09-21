import {AfterViewInit, Component, OnInit, viewChild} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatButton, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput} from "@angular/material/datepicker";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {DatePipe, NgClass, NgForOf, NgOptimizedImage} from "@angular/common";
import {TestRunnerService} from "../../services/test-runner.service";
import {RouterParamsService} from "../../services/router-params.service";
import {TestRun} from "../../models/test-run";
import {FlexModule} from "@angular/flex-layout";
import {TestRunService} from "../../services/test-run.service";

@Component({
  selector: 'app-test-runs',
  standalone: true,
  imports: [
    MatButton,
    MatAccordion,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatIcon,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepicker,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    NgForOf,
    DatePipe,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    FlexModule,
    NgOptimizedImage,
    MatIconAnchor,
    NgClass,
    MatIconButton
  ],
  templateUrl: './test-runs.component.html',
  styleUrl: './test-runs.component.css'
})
export class TestRunsComponent implements OnInit, AfterViewInit{
  accordion = viewChild.required(MatAccordion);
  protected data: TestRun[] = [];
  displayedColumns: string[] = ['id', 'status', 'finishTime', 'reportUrl'];
  private projectId: number = 0;

  constructor(
    private testRunService: TestRunService,
    private routerParamsService: RouterParamsService
  ) {
  }
  ngOnInit(): void {
    this.routerParamsService.projectId$.subscribe(projectId =>{
      this.projectId = Number(projectId);
      this.testRunService.getProjectTestRuns(this.projectId).subscribe(testRuns=>{
        this.data = testRuns;
      })
    })
  }

  ngAfterViewInit() {

  }

}

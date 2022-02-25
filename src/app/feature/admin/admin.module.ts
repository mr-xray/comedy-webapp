import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMapComponent } from './components/admin-map/admin-map.component';
import { MultipleChoiceQuestionResultsComponent } from './multiple-choice-question-results/multiple-choice-question-results.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManualTriggerControllerComponent } from './manual-trigger-controller/manual-trigger-controller.component';



@NgModule({
  declarations: [
    AdminMapComponent,
    MultipleChoiceQuestionResultsComponent,
    AdminDashboardComponent,
    ManualTriggerControllerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminModule { }

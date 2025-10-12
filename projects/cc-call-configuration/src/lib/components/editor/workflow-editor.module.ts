import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkflowEditorComponent } from './workflow-editor.component';
import { HttpClientModule } from '@angular/common/http';
// 👇 child standalone component import
import { WorkflowActionPanelComponent } from '../editor/action-panel/workflow-action-panel.component';

@NgModule({
  declarations: [
    WorkflowEditorComponent   // normal component declare
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    WorkflowActionPanelComponent // ✅ standalone child import
  ],
  exports: [
    WorkflowEditorComponent
  ]
})
export class WorkflowEditorModule {}

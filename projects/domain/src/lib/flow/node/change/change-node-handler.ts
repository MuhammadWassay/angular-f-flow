import { ChangeNodeRequest } from './change-node-request';
import { IHandler } from '@foblex/mediator';
import { Injectable } from '@angular/core';
import { IFlowModel } from '../../index';
import { EFormBuilderControlType } from '@shared-components';
import { generateGuid } from '@foblex/utils';

@Injectable({
  providedIn: 'root'
})
export class ChangeNodeHandler implements IHandler<ChangeNodeRequest, IFlowModel[]> {

  public handle(request: ChangeNodeRequest): IFlowModel[] {
    const flow = request.flows.find(x => x.key === request.flowKey);
    if (!flow) throw new Error('Flow not found 3');

    const node = flow.nodes.find(x => x.key === request.nodeKey);
    if (!node) throw new Error('Node not found');

    node.position = request.position;
    node.value = request.value;

    // find outputs group
    const group = node.value?.groups.find(g =>
      g.controls.some(c => c.type === EFormBuilderControlType.OUTPUTS_SELECT)
    );

    if (!group) return request.flows;

    const outputsNumber = parseInt(
      group.controls.find(c => c.type === EFormBuilderControlType.OUTPUTS_SELECT)?.value || '0',
      10
    );

    // Create or remove outputs dynamically
    const existingOutputs = node.outputs || [];
    const updatedOutputs: { key: string; name: string }[] = [];

    for (let i = 0; i < outputsNumber; i++) {
      // check if existing output available
      if (existingOutputs[i]) {
        updatedOutputs.push(existingOutputs[i]);
      } else {
        updatedOutputs.push({ key: generateGuid(), name: `Output ${i + 1}` });
      }
    }

    // Update editable controls for outputs
    const editableControls = updatedOutputs.map((o, idx) => ({
      key: o.key,
      name: `Output ${idx + 1}`,
      type: EFormBuilderControlType.INPUT,
      value: o.name
    }));

    // Replace controls: first OUTPUTS_SELECT, then editable outputs
    const outputsSelectControl = group.controls.find(c => c.type === EFormBuilderControlType.OUTPUTS_SELECT)!;
    group.controls = [outputsSelectControl, ...editableControls];

    node.outputs = updatedOutputs;

    return request.flows;
  }
}

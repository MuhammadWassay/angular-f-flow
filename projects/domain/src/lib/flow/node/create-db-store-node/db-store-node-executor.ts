import { Injectable } from '@angular/core';
import { INodeModel } from '../../i-node-model';
import { ENodeType } from '../../e-node-type';

@Injectable({
  providedIn: 'root'
})
export class DBStoreNodeExecutor {

  public execute(node: INodeModel, context?: any): string | null {
    if (node.type !== ENodeType.DBStore) {
      console.error('Invalid node type passed to DBStoreNodeExecutor');
      return null;
    }

    const conditionGroup = node.value?.groups?.find(g => g.name === 'Condition');
    if (!conditionGroup) return null;

    const variable = conditionGroup.controls.find(c => c.key === 'variable')?.value ?? '';
    const operator = conditionGroup.controls.find(c => c.key === 'operator')?.value ?? '=';
    const value = conditionGroup.controls.find(c => c.key === 'value')?.value ?? '';

    console.log(`DB Store executing: ${variable} ${operator} ${value}`);
    const output = node.outputs[0];
    return output ? output.key : null;
  }
}

import { Injectable } from '@angular/core';
import { INodeModel } from '../../i-node-model';
import { ENodeType } from '../../e-node-type';

@Injectable({
  providedIn: 'root'
})
export class IfElseNodeExecutor {

public execute(node: INodeModel, context?: any): string | null {
  if (node.type !== ENodeType.IfElse) {
    console.error('Invalid node type passed to IfElseNodeExecutor');
    return null;
  }

  const conditionGroup = node.value?.groups?.find(g => g.name === 'Conditions');
  if (!conditionGroup) return null;

  const conditions = conditionGroup.controls.find(c => c.key === 'conditions')?.value || [];
  let result = true;

  for (const cond of conditions) {
    const left = isNaN(cond.leftValue) ? cond.leftValue : Number(cond.leftValue);
    const right = isNaN(cond.rightValue) ? cond.rightValue : Number(cond.rightValue);

    let condResult = false;
    switch (cond.operator) {
      case '==': condResult = left == right; break;
      case '!=': condResult = left != right; break;
      case '>': condResult = left > right; break;
      case '<': condResult = left < right; break;
      case '>=': condResult = left >= right; break;
      case '<=': condResult = left <= right; break;
    }

    // 👇 agar ek bhi false hua to pura false
    if (!condResult) {
      result = false;
      break;
    }
  }

  const output = node.outputs.find(o => o.name === (result ? 'True' : 'False'));
  return output ? output.key : null;
}
}

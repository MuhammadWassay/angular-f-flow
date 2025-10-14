import { CreateNodeRequest } from './create-node-request';
import { IHandler } from '@foblex/mediator';
import { Injectable, Injector } from '@angular/core';
import { ENodeType, IFlowModel, INodeModel } from '../../index';
import { CreateIncomingCallNodeHandler } from '../create-incoming-call-node/create-incoming-call-node-handler';
import { CreateIncomingCallNodeRequest } from '../create-incoming-call-node/create-incoming-call-node-request';
import { CreatePlayTextNodeHandler } from '../create-play-text-node/create-play-text-node-handler';
import { CreatePlayTextNodeRequest } from '../create-play-text-node/create-play-text-node-request';
import { CreateIvrNodeHandler } from '../create-ivr-node/create-ivr-node-handler';
import { CreateIvrNodeRequest } from '../create-ivr-node/create-ivr-node-request';
import { CreateConversationNodeHandler } from '../create-conversation-node/create-conversation-node-handler';
import { CreateConversationNodeRequest } from '../create-conversation-node/create-conversation-node-request';
import { CreateDisconnectNodeHandler } from '../create-disconnect-node/create-disconnect-node-handler';
import { CreateDisconnectNodeRequest } from '../create-disconnect-node/create-disconnect-node-request';
import { CreatePlayFileNodeHandler } from '../create-play-file-node/create-play-file-node-handler';
import { CreatePlayFileNodeRequest } from '../create-play-file-node/create-play-file-node-request';
import { CreateIfElseNodeHandler } from '../create-if-else-node/create-if-else-node-handler';
import { CreateIfElseNodeRequest } from '../create-if-else-node/create-if-else-node-request';
import { CreateDBStoreNodeHandler } from '../create-db-store-node/create-db-store-node-handler';
import { CreateDBStoreNodeRequest } from '../create-db-store-node/create-db-store-node-request';


@Injectable({
  providedIn: 'root'
})
export class CreateNodeHandler implements IHandler<CreateNodeRequest, IFlowModel[]> {

  constructor(
    private injector: Injector
  ) {
  }

  public handle(request: CreateNodeRequest): IFlowModel[] {
    console.log('--- CreateNodeHandler.handle called ---');
    console.log('Request received:', request);

    const flowKeyFromUrl = window.location.pathname.match(/flow\/([a-zA-Z0-9-]+)/)?.[1];
    const effectiveFlowKey = request.flowKey || flowKeyFromUrl;

    // Find the flow, fallback to first
    const flow = request.flows.find(x => x.key === effectiveFlowKey) || request.flows[0];
    if (!flow) {
        console.error('Flow not found. Request flows:', request.flows);
        throw new Error('Flow not found');
    }

    const node: INodeModel<string> = this.getNodeModel(request);

    flow.nodes = [...flow.nodes, node];

    console.log('Node created:', node);
    console.log('Updated flow nodes:', flow.nodes);
    console.log('--- CreateNodeHandler.handle finished ---');

    return request.flows;
}



  private getNodeModel(request: CreateNodeRequest): INodeModel {
    let result: INodeModel | undefined;

    switch (request.type) {
      case ENodeType.IncomingCall:
        result = this.injector.get(CreateIncomingCallNodeHandler).handle(new CreateIncomingCallNodeRequest(request.position));
        break;
      case ENodeType.PlayText:
        result = this.injector.get(CreatePlayTextNodeHandler).handle(new CreatePlayTextNodeRequest(request.position));
        break;
      case ENodeType.UserInput:
        result = this.injector.get(CreateIvrNodeHandler).handle(new CreateIvrNodeRequest(request.position));
        break;
      case ENodeType.ToOperator:
        result = this.injector.get(CreateConversationNodeHandler).handle(new CreateConversationNodeRequest(request.position));
        break;
      case ENodeType.Disconnect:
        result = this.injector.get(CreateDisconnectNodeHandler).handle(new CreateDisconnectNodeRequest(request.position));
        break;
      case ENodeType.PlayFile:
        result = this.injector.get(CreatePlayFileNodeHandler).handle(new CreatePlayFileNodeRequest(request.position));
        break;
      case ENodeType.IfElse:
        result = this.injector.get(CreateIfElseNodeHandler).handle(new CreateIfElseNodeRequest(request.position));
        break;
      case ENodeType.DBStore:
        result = (this.injector.get(CreateDBStoreNodeHandler) as CreateDBStoreNodeHandler).handle(new CreateDBStoreNodeRequest(request.position));
        break;

      default:
        throw new Error('Unknown node type');
    }
    return result;
  }
}

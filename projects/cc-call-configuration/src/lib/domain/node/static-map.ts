import { ENodeType } from '@domain';
import { INodeStaticMapItem } from './i-node-static-map-item';

export const NODE_STATIC_MAP: IMap<INodeStaticMapItem> = {

  [ENodeType.IncomingCall]: {
    name: 'Incoming call',
    icon: 'add_call',
    color: '#39b372',
    isExpandable: false,
    node_name: 'start',
  },
  [ENodeType.UserInput]: {
    name: 'IVR',
    icon: 'call_log',
    color: '#2676ff',
    isExpandable: true,
    node_name: 'user_input',
  },
  [ENodeType.PlayText]: {
    name: 'Play text',
    icon: 'wifi_calling_3',
    color: '#AF94FF',
    isExpandable: true,
    node_name: 'play_text',
  },
  [ENodeType.ToOperator]: {
    name: 'To operator',
    icon: 'wifi_calling_3',
    color: '#ffb62a',
    isExpandable: false,
    node_name: 'to_operator',
  },
  [ENodeType.Disconnect]: {
    name: 'Disconnect',
    icon: 'phone_disabled',
    color: '#ff859b',
    isExpandable: false,
    node_name: 'disconnect',
  },
  [ENodeType.PlayFile]: {
    name: 'Play file',
    icon: 'music_note',
    color: '#00bcd4',
    isExpandable: true,
    node_name: 'play_file',
  },
  [ENodeType.IfElse]: {
    name: 'If / Else',
    icon: 'swap_horiz',
    color: '#ffa500',
    isExpandable: true,
    node_name: 'if_else',
  },
};

interface IMap<T = string> {
  [ key: string ]: T;
}

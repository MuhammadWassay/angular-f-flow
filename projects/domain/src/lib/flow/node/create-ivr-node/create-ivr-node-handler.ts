import { Injectable } from '@angular/core';
import { ENodeType } from '../../e-node-type';
import { INodeModel } from '../../i-node-model';
import { CreateIvrNodeRequest } from './create-ivr-node-request';
import { EFormBuilderControlType } from '@shared-components';
import { generateGuid } from '@foblex/utils';
import { IHandler } from '@foblex/mediator';

@Injectable({
  providedIn: 'root'
})
export class CreateIvrNodeHandler implements IHandler<CreateIvrNodeRequest, INodeModel> {

  public handle(request: CreateIvrNodeRequest): INodeModel {
    
    return {
      key: generateGuid(),
      description: 'Input Caller Lookup',
      input: generateGuid() + '_input',
      outputs: [
        { key: generateGuid(), name: 'Output 1' },
        { key: generateGuid(), name: 'Output 2' },
        { key: generateGuid(), name: 'Output 3' }
      ],
      position: request.position,
      type: ENodeType.UserInput,
      value: {
        groups: [
          {
            name: 'Select Number of Outputs',
            controls: [
              {
                key: generateGuid(),
                name: 'Outputs',
                type: EFormBuilderControlType.OUTPUTS_SELECT,
                value: 3,
              }
            ]
          },
          {
            name: 'Select File',
            controls: [
              {
                key: 'file',
                name: 'File',
                type: EFormBuilderControlType.SELECT,
                value: 'a',
                options: [
                  { label: 'A', value: 'a' },
                  { label: 'B', value: 'b' },
                  { label: 'C', value: 'c' }
                ]
              }
            ]
          },
          {
            name: 'Choose Digit',
            controls: [
              {
                key: 'digits',
                name: 'Select Digit',
                type: EFormBuilderControlType.SELECT_DIGIT,
                value: '1',
                options: [
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                ]
              }

            ]
          },
          {
            name: 'Retry Trials (1 to 5)',
            controls: [
              {
                key: 'retryTrials',
                name: 'Number of Trials (1 to 5)',
                type: EFormBuilderControlType.TEXTAREA, // only allowed type is TEXTBOX
                value: '1'  // default value as string
              }
            ]
          },
          {
            name: 'Maximum Wait Time',
            controls: [
              {
                key: 'maxWaitTime',
                name: 'Time (seconds) for user input',
                type: EFormBuilderControlType.INPUT,
                value: 10 
              }
            ]
          },
        ]
      }
    };
  }
}


// import { Injectable } from '@angular/core';
// import { ENodeType } from '../../e-node-type';
// import { INodeModel } from '../../i-node-model';
// import { CreateIvrNodeRequest } from './create-ivr-node-request';
// import { EFormBuilderControlType } from '@shared-components';
// import { generateGuid } from '@foblex/utils';
// import { IHandler } from '@foblex/mediator';

// @Injectable({
//   providedIn: 'root'
// })
// export class CreateIvrNodeHandler implements IHandler<CreateIvrNodeRequest, INodeModel> {

//   public handle(request: CreateIvrNodeRequest): INodeModel {
//     return {
//       key: generateGuid(),
//       description: 'Input Caller Lookup',
//       input: generateGuid() + '_input',

//       // outputs now linked to form control
//       outputs: [
//         { key: generateGuid(), name: 'Output 1' },
//         { key: generateGuid(), name: 'Output 2' },
//         { key: generateGuid(), name: 'Output 3' }
//       ],

//       position: request.position,
//       type: ENodeType.UserInput,
//       value: {
//         groups: [
//           {
//             name: 'Select Number of Outputs',
//             controls: [
//               {
//                 key: 'outputs',
//                 name: 'Outputs',
//                 type: EFormBuilderControlType.OUTPUTS_SELECT,
//                 value: [
//                   { key: generateGuid(), name: 'Output 1' },
//                   { key: generateGuid(), name: 'Output 2' },
//                   { key: generateGuid(), name: 'Output 3' }
//                 ]
//               }
//             ]
//           },
//           {
//             name: 'Select File',
//             controls: [
//               {
//                 key: 'file',
//                 name: 'File',
//                 type: EFormBuilderControlType.SELECT,
//                 value: 'a',
//                 options: [
//                   { label: 'A', value: 'a' },
//                   { label: 'B', value: 'b' },
//                   { label: 'C', value: 'c' }
//                 ]
//               }
//             ]
//           },
//           {
//             name: 'Choose Digit',
//             controls: [
//               {
//                 key: 'digits',
//                 name: 'Select Digit',
//                 type: EFormBuilderControlType.SELECT_DIGIT,
//                 value: '1',
//                 options: [
//                   { label: '1', value: '1' },
//                   { label: '2', value: '2' }
//                 ]
//               }
//             ]
//           },
//           {
//             name: 'Retry Trials (1 to 5)',
//             controls: [
//               {
//                 key: 'retryTrials',
//                 name: 'Number of Trials (1 to 5)',
//                 type: EFormBuilderControlType.INPUT,
//                 value: 1
//               }
//             ]
//           },
//           {
//             name: 'Maximum Wait Time',
//             controls: [
//               {
//                 key: 'maxWaitTime',
//                 name: 'Time (seconds) for user input',
//                 type: EFormBuilderControlType.INPUT,
//                 value: 10
//               }
//             ]
//           }
//         ]
//       }
//     };
//   }
// }

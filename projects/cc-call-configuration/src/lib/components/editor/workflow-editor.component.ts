import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, Injector, OnDestroy, OnInit,
  ViewChild,
} from '@angular/core';
import {
  EFConnectableSide, EFConnectionBehavior,
  EFConnectionType,
  EFMarkerType,
  FCanvasComponent,
  FCreateConnectionEvent, FCreateNodeEvent,
  FFlowComponent,
  FFlowModule,
  FReassignConnectionEvent, FZoomDirective,
} from '@foblex/flow';
import { IPoint, Point } from '@foblex/2d';
import { FormsModule } from '@angular/forms';
import { WorkflowNodeComponent } from './node/workflow-node.component';
import { WorkflowActionPanelComponent } from './action-panel/workflow-action-panel.component';
import { WorkflowPaletteComponent } from './palette/workflow-palette.component';
import { EFormBuilderControlType } from '@shared-components';
import {ENodeType} from '@domain';

import { distinctUntilChanged, filter, map, merge, Observable, startWith, Subject, Subscription, take } from 'rxjs';
import {
  BulkRemoveHandler, BulkRemoveRequest, ChangeNodeHandler, ChangeNodeRequest,
  CreateConnectionHandler, CreateConnectionRequest,
  DetailsFlowHandler,
  DetailsFlowRequest,
  IFlowViewModel,
  INodeViewModel, ReassignConnectionHandler, ReassignConnectionRequest,
} from '../../domain';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ChangeNodePositionAction, CreateNodeAction, INodeValueModel } from '@domain';
import { EFlowActionPanelEvent } from './action-panel/e-flow-action-panel-event';
import { A, BACKSPACE, DASH, DELETE, NUMPAD_MINUS, NUMPAD_PLUS } from '@angular/cdk/keycodes';
import { EOperationSystem, PlatformService } from '@foblex/platform';

@Component({
  selector: 'workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: [ './workflow-editor.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    WorkflowNodeComponent,
    WorkflowActionPanelComponent,
    WorkflowPaletteComponent,
    FormsModule
  ],
  host: {
    '(keydown)': 'onKeyDown($event)',
    'tabindex': '-1'
  }
})
export class WorkflowEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions$: Subscription = new Subscription();
  public viewModel: IFlowViewModel | undefined;

  @ViewChild(FFlowComponent, { static: false })
  public fFlowComponent!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: false })
  public fCanvasComponent!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: false })
  public fZoomDirective!: FZoomDirective;

  public eMarkerType = EFMarkerType;
  public eConnectableSide = EFConnectableSide;

  public cBehavior: EFConnectionBehavior = EFConnectionBehavior.FIXED;
  public cType: EFConnectionType = EFConnectionType.SEGMENT;

  private hasChanges$: Subject<void> = new Subject<void>();

  private get routeKeyChange$(): Observable<boolean> {
    return this.router.events.pipe(
      startWith(new NavigationEnd(0, '', '')),
      filter((x) => x instanceof NavigationEnd),
      map(() => this.activatedRoute.snapshot.params[ 'key' ]),
      distinctUntilChanged(),
      map(() => true)
    );
  }

  constructor(
    private store: Store,
    private router: Router,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private fPlatform: PlatformService
  ) {}

  ngOnInit(): void {
    this.loadJSONFileFromServer();
    this.subscriptions$.add(this.subscribeReloadEvents());
  }

  private subscribeReloadEvents(): Subscription {
    return merge(this.hasChanges$, this.routeKeyChange$).subscribe((res) => {
      const key = this.activatedRoute.snapshot.params[ 'key' ];
      try {
        this.viewModel = this.injector.get(DetailsFlowHandler).handle(
          new DetailsFlowRequest(key)
        );
      } catch (e) {
        console.error(e);
        this.viewModel = undefined;
      }

      if (res) {
        this.fFlowComponent?.reset();
      }

      this.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.onLoaded();
  }

  public onLoaded(): void {
    this.fCanvasComponent?.fitToScreen(new Point(300, 300), false);
  }

  public onCreateNode(event: FCreateNodeEvent): void {
    this.store.dispatch(
      new CreateNodeAction(this.viewModel!.key, event.data, event.rect)
    ).pipe(take(1)).subscribe(() => {
      this.hasChanges$.next();
    });
  }

  public onNodePositionChanged(point: IPoint, node: INodeViewModel): void {
    node.position = point;
    this.store.dispatch(new ChangeNodePositionAction(this.viewModel!.key, node.key, point));
  }

  public onCreateConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) return;
    this.viewModel = this.injector.get(CreateConnectionHandler).handle(
      new CreateConnectionRequest(this.viewModel!, event.fOutputId, event.fInputId)
    );
    this.changeDetectorRef.detectChanges();
  }

  public onReassignConnection(event: FReassignConnectionEvent): void {
    if (!event.newTargetId) return;
    this.viewModel = this.injector.get(ReassignConnectionHandler).handle(
      new ReassignConnectionRequest(this.viewModel!, event.oldSourceId, event.oldTargetId, event.newTargetId)
    );
    this.changeDetectorRef.detectChanges();
  }

  public onRemoveConnection(outputKey: string): void {
    const connection = this.viewModel!.connections.find((x) => x.from === outputKey);
    this.viewModel = this.injector.get(BulkRemoveHandler).handle(
      new BulkRemoveRequest(this.viewModel!, [], [ connection!.key ])
    );
    this.changeDetectorRef.detectChanges();
  }

  public onRemoveItems(): void {
    const selection = this.fFlowComponent.getSelection();
    this.viewModel = this.injector.get(BulkRemoveHandler).handle(
      new BulkRemoveRequest(this.viewModel!, selection.fNodeIds, selection.fConnectionIds)
    );
    this.changeDetectorRef.detectChanges();
  }

  public onValueChanged(node: INodeViewModel, value: INodeValueModel): void {
    const selected = this.fFlowComponent.getSelection();
    node.value = value;
    this.viewModel = this.injector.get(ChangeNodeHandler).handle(
      new ChangeNodeRequest(this.viewModel!, node)
    );

    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.fFlowComponent.select(selected.fNodeIds, selected.fConnectionIds);
    });
  }

  public onActionPanelEvent(event: EFlowActionPanelEvent): void {
    switch (event) {
      case EFlowActionPanelEvent.DELETE_SELECTED:
        this.onRemoveItems();
        break;
      case EFlowActionPanelEvent.SELECT_ALL:
        this.fFlowComponent.selectAll();
        break;
      case EFlowActionPanelEvent.ZOOM_IN:
        this.fZoomDirective.zoomIn();
        break;
      case EFlowActionPanelEvent.ZOOM_OUT:
        this.fZoomDirective.zoomOut();
        break;
      case EFlowActionPanelEvent.FIT_TO_SCREEN:
        this.fCanvasComponent.fitToScreen();
        break;
      case EFlowActionPanelEvent.ONE_TO_ONE:
        this.fCanvasComponent.resetScaleAndCenter();
        break;
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    switch (event.keyCode) {
      case BACKSPACE:
      case DELETE:
        this.onRemoveItems();
        break;
      case NUMPAD_PLUS:
        if (this.isCommandButton(event)) this.fZoomDirective.zoomIn();
        break;
      case NUMPAD_MINUS:
      case DASH:
        if (this.isCommandButton(event)) this.fZoomDirective.zoomOut();
        break;
      case A:
        if (this.isCommandButton(event)) this.fFlowComponent.selectAll();
        break;
    }
  }

  private isCommandButton(event: { metaKey: boolean, ctrlKey: boolean }): boolean {
    return this.fPlatform.getOS() === EOperationSystem.MAC_OS ? event.metaKey : event.ctrlKey;
  }

  public loadJSONFileFromServer(): void {
    const match = window.location.pathname.match(/builder\/(\d+)/);
    const builderId = match ? match[1] : null;
    if (!builderId) {
      console.warn("Not on a builder page — skipping flow load.");
      return;
    }

    let baseUrl = window.location.origin;
    const localMatch = window.location.pathname.match(/(\/Etaps\/pulse-inventory-system\/public)/i);
    if (localMatch) {
      baseUrl += localMatch[1];
    }

    const url = `${baseUrl}/broadcast-campaign/builder_json/${builderId}`;

    // Hardcoded dropdown options
    const operatorOptions = [
      { label: 'Equals (=)', value: '=' },
    ];

    const valueOptions = [
      { label: 'User Input', value: 'user_input' },
      { label: 'Caller Number', value: 'caller_number' },
      { label: 'System Time', value: 'system_time' },
      { label: 'Custom Textbox', value: 'custom_textbox' }
    ];

    const variableOptions = [
      { label: 'User Input', value: 'user_input' },
      { label: 'Caller Number', value: 'caller_number' },
      { label: 'System Time', value: 'system_time' }
    ];

    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then(response => response.ok ? response.json() : Promise.reject(response))
      .then(data => {
        let parsedFlow: IFlowViewModel | undefined;

        try {
          parsedFlow = data?.flow_json ? JSON.parse(data.flow_json) : undefined;
        } catch (e) {
          console.error("Invalid JSON from server:", e);
          parsedFlow = undefined;
        }

        // Normalize existing nodes if any
        if (parsedFlow?.nodes?.length) {
          parsedFlow.nodes.forEach(node => {
            node.value?.groups?.forEach(group => {
              if (!group.name) group.name = 'Default Group';

              group.controls?.forEach(control => {
                const defaultOptions = control.key === 'operator' ? operatorOptions
                                    : control.key === 'value' ? valueOptions
                                    : control.key === 'variable' ? variableOptions
                                    : [];

                // Assign default options if none exist
                if (!control.options?.length) {
                  control.options = defaultOptions;
                  control.value = control.value ?? defaultOptions[0]?.value;
                }

                // Normalize options
                control.options = control.options.map(opt => ({
                  label: opt.label ?? opt.value,
                  value: opt.value ?? opt.label
                }));
              });
            });
          });
        }

        // Fallback node if flow is empty
        const fallbackNode: INodeViewModel<string> = {
          key: crypto.randomUUID(),
          name: 'Operator & Value Node',
          node_name: 'operator_value_node',
          type: ENodeType.SetVariable,
          color: '#ff9800',
          icon: 'tune',
          isExpanded: true,
          isExpandable: true,
          input: 'dummy_input',
          outputs: [],
          position: { x: 0, y: 0 },
          value: {
            groups: [
              {
                name: 'Default Group',
                controls: [
                  {
                    key: 'variable',
                    name: 'Variable',
                    type: EFormBuilderControlType.SELECT,
                    value: variableOptions[0].value,
                    options: variableOptions
                  },
                  {
                    key: 'operator',
                    name: 'Operator',
                    type: EFormBuilderControlType.SELECT,
                    value: operatorOptions[0].value,
                    options: operatorOptions
                  },
                  {
                    key: 'value',
                    name: 'Value',
                    type: EFormBuilderControlType.SELECT,
                    value: valueOptions[0].value,
                    options: valueOptions
                  }
                ]
              }
            ]
          }
        };

        // Assign viewModel
        if (parsedFlow) {
          if (!parsedFlow.nodes.some(n => n.node_name === 'operator_value_node')) {
            parsedFlow.nodes.push(fallbackNode);
          }
          this.viewModel = parsedFlow;
        } else {
          this.viewModel = {
            key: builderId || crypto.randomUUID(),
            nodes: [fallbackNode],
            connections: []
          };
        }

        this.fFlowComponent?.reset?.();
        this.changeDetectorRef.detectChanges();
        console.log("Flow loaded successfully:", this.viewModel);
      })
      .catch(err => {
        console.error("Failed to load flow:", err);

        const fallbackNode: INodeViewModel<string> = {
          key: crypto.randomUUID(),
          name: 'Operator & Value Node',
          node_name: 'operator_value_node',
          type: ENodeType.SetVariable,
          color: '#ff9800',
          icon: 'tune',
          isExpanded: true,
          isExpandable: true,
          input: 'dummy_input',
          outputs: [],
          position: { x: 0, y: 0 },
          value: {
            groups: [
              {
                name: 'Default Group',
                controls: [
                  {
                    key: 'variable',
                    name: 'Variable',
                    type: EFormBuilderControlType.SELECT,
                    value: variableOptions[0].value,
                    options: variableOptions
                  },
                  {
                    key: 'operator',
                    name: 'Operator',
                    type: EFormBuilderControlType.SELECT,
                    value: operatorOptions[0].value,
                    options: operatorOptions
                  },
                  {
                    key: 'value',
                    name: 'Value',
                    type: EFormBuilderControlType.SELECT,
                    value: valueOptions[0].value,
                    options: valueOptions
                  }
                ]
              }
            ]
          }
        };

        this.viewModel = {
          key: builderId || crypto.randomUUID(),
          nodes: [fallbackNode],
          connections: []
        };

        this.fFlowComponent?.reset?.();
        this.changeDetectorRef.detectChanges();
      });
  }




  public saveFlowToServer(): void {
    if (!this.viewModel) {
      alert("No flow data found!");
      return;
    }
    const matchResult = window.location.pathname.match(/builder\/(\d+)\/flow\/([a-zA-Z0-9-]+)/);
    const builderId = matchResult ? matchResult[1] : null;
    if (!builderId) {
      alert(" No builder ID found in URL!");
      return;
    }
    const fullPath = window.location.href;
    let baseMatch = fullPath.match(/^(https?:\/\/[^/]+(?:\/[^/]+)*?)\/broadcast-campaign/i);
    let baseUrl = baseMatch ? baseMatch[1] : window.location.origin;
    baseUrl = baseUrl.replace(/(\/Etaps\/pulse-inventory-system\/public){2,}/i, '/Etaps/pulse-inventory-system/public');
    const url = `${baseUrl}/broadcast-campaign/builder/flow/${builderId}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
      },
      body: JSON.stringify({
        id: builderId,
        flow_json: this.viewModel,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save flow");
        alert(" Flow saved successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert(" Error saving flow.");
      });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}

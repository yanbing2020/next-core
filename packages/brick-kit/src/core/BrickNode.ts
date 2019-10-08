import { setRealProperties, bindListeners } from "@easyops/brick-utils";
import { getHistory } from "../history";
import { PluginRuntimeContext, BrickLifeCycle } from "@easyops/brick-types";

export interface RuntimeBrick {
  type: string;
  properties: Record<string, any>;
  events: Record<string, any>;
  children?: RuntimeBrick[];
  slotId?: string;
  context?: PluginRuntimeContext;
  lifeCycle?: BrickLifeCycle;
  element?: HTMLElement;
  bg?: boolean;
}

export class BrickNode {
  private currentElement: RuntimeBrick;
  private children: BrickNode[];

  constructor(brick: RuntimeBrick) {
    this.currentElement = brick;
  }

  mount(): HTMLElement {
    const brick = this.currentElement;

    const node = document.createElement(brick.type);
    brick.element = node;

    if (brick.slotId) {
      node.setAttribute("slot", brick.slotId);
    }
    setRealProperties(node, brick.properties);
    // Todo(steve): refine
    bindListeners(node, brick.events, getHistory(), brick.context);

    if (Array.isArray(brick.children)) {
      this.children = brick.children.map(slot => new BrickNode(slot));
      const childNodes = this.children.map(slot => slot.mount());
      childNodes.forEach(slot => node.appendChild(slot));
    } else {
      this.children = [];
    }

    return node;
  }

  unmount(): void {
    this.children.forEach(slot => {
      slot.unmount();
    });
  }
}
import { EventType } from "./event-type-enum";

export type InvokeEvent = any;

export class RequestMapper<I> {
  public mapByEvent = (eventType: EventType, event: any): I => {
    if (EventType.INVOKE === eventType) return this.mapByInvoke(event);
    throw new Error("Event not mapped");
  };

  protected mapByInvoke = (_: InvokeEvent): I => {
    throw new Error("method buildBySchedule() not implemented");
  };
}

import type { Context } from "aws-lambda";
import { EventType } from "./event-type-enum";
import { RequestMapper } from "./request-mapper";

export abstract class Controller<I, O> {
  constructor(private requestMapper: RequestMapper<I>) {}

  protected abstract execute: (
    request: I,
    event?: any,
    context?: Context
  ) => Promise<O>;

  public run = async (
    eventType: EventType,
    event: any,
    context: Context
  ): Promise<O> => {
    const request = this.requestMapper.mapByEvent(eventType, event);
    try {
      const response = await this.execute(request, event, context);
      return response;
    } catch (error) {
      throw error;
    }
  };
}

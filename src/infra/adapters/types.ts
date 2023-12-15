import { EventType } from "@infra/commons/controllers";
import type { Context } from "aws-lambda";

export type RunCommand<Event, Result = any> = (
  eventType: EventType,
  event: Event,
  context: Context
) => Promise<Result>;

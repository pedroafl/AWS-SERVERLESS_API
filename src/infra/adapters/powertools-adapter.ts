import { EventType } from "@infra/commons/controllers";
import middy from "@middy/core";
import type { Context, Handler } from "aws-lambda";

export type RunCommand<Event, Result = any> = (
  eventType: EventType,
  event: Event,
  context: Context
) => Promise<Result>;

export const wrapperMiddy = (handlerLambda: Handler) => middy(handlerLambda);

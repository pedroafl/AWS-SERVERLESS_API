import { RequestContext } from "@application/config/context/request-context";
import { EventType } from "@infra/commons/controllers";
import { CoreException } from "@infra/exceptions/core-exception";
import type { Handler } from "aws-lambda/handler";
import { wrapperMiddy } from "./powertools-adapter";
import type { RunCommand } from "./types";

interface InvokeResponse {
  statusCode: number;
  payload?: unknown;
}

const httpResponse = (
  statusCode: number,
  payload?: unknown
): InvokeResponse => {
  return { statusCode, payload };
};

const ok = (response?: unknown): InvokeResponse => {
  return httpResponse(200, response);
};

const mapByCoreException = (exception: CoreException) => {
  const response = {
    httpCode: exception.httpCode,
    name: exception.name,
    message: exception.message,
    details: undefined,
  };
  return response;
};

const handlerErrorDefault = (error: Error): InvokeResponse => {
  if (error instanceof CoreException) {
    return httpResponse(error.httpCode, mapByCoreException(error));
  }
  return httpResponse(500, {
    stack: error.stack,
    messageError: error.message,
    code: "server_error",
    message: "Ocorreu um erro inesperado",
  });
};

export class InvokeAdapter {
  static invoke(
    run: RunCommand<any>,
    mapResponse: (response: unknown) => InvokeResponse = ok,
    handlerError: (error: Error) => InvokeResponse = handlerErrorDefault
  ): Handler {
    const handler = async (event, context) => {
      try {
        RequestContext.clear();
        RequestContext.add("eventType", EventType.INVOKE);
        RequestContext.add("context", context);
        RequestContext.add("event", event);
        const response = await run(EventType.INVOKE, event, context);
        return mapResponse(response);
      } catch (error) {
        const resultError = handlerError(error);
        return resultError;
      }
    };
    return wrapperMiddy(handler);
  }
}

import { RequestContext } from "@application/config/context/request-context";
import { EventType } from "@infra/commons/controllers";
import type middy from "@middy/core";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { wrapperMiddy } from "./powertools-adapter";
import type { RunCommand } from "./types";
import { CoreException } from "@infra/exceptions/core-exception";

const mapByCoreException = (exception: CoreException) => {
  const response = {
    httpCode: exception.httpCode,
    name: exception.name,
    message: exception.message,
    details: undefined,
  };
  return response;
};

const httpResponse = (
  statusCode: number,
  response?: unknown
): APIGatewayProxyResult => {
  const body = response ? JSON.stringify(response) : undefined;
  const headers = { "Access-Control-Allow-Origin": "*" };
  return { statusCode, body, headers };
};

const ok = (response?: unknown): APIGatewayProxyResult => {
  return httpResponse(200, response);
};

const handlerError = (error: Error): APIGatewayProxyResult => {
  if (error instanceof CoreException) {
    return httpResponse(error.httpCode, mapByCoreException(error));
  }

  return httpResponse(500, {
    httpCode: 500,
    code: "server_error",
    message: "Ocorreu um erro inesperado.",
  });
};

export class ApiGatewayAdapter {
  static http(
    run: RunCommand<APIGatewayProxyEvent>,
    mapResponse: (response: unknown) => APIGatewayProxyResult = ok
  ): middy.MiddyfiedHandler<APIGatewayProxyEvent> {
    const handler: APIGatewayProxyHandler = async (event, context) => {
      try {
        RequestContext.clear();
        RequestContext.add("eventType", EventType.API_GATEWAY);
        RequestContext.add("context", context);
        RequestContext.add("event", event);
        const response = await run(EventType.API_GATEWAY, event, context);
        return mapResponse(response);
      } catch (error) {
        const resultError = handlerError(error);
        return resultError;
      }
    };

    return wrapperMiddy(handler);
  }
}

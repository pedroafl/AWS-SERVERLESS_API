import { AuthorizerCoreService } from "@infra/gateways/conta-simples/authorizer";
import { httpResponse } from "@infra/utils/aws-utils";
import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";

const { SERVICE_NAME, STAGE } = process.env;

export const authorizerCoreCustom = () => {
  const checkAuthorization = async (event: APIGatewayProxyEvent) => {
    const authorizerCoreService = new AuthorizerCoreService();
    console.log("authorizerCoreCustom -> checkAuthorization -> checking the authorization.");

    const body = JSON.parse(event.body);

    return authorizerCoreService
      .authorizeUserV2({
        accessToken: event.headers.Authorization || event.headers.authorization,
        userTransactionCode: body?.authorizer?.userTransactionCode,
        authorizationCode: body?.authorizer?.authorizationCode,
        password: body?.authorizer?.password,
        clientMetaData: {
          ip: event.headers["cf-connecting-ip"] || event.requestContext.identity.sourceIp,
          agent: event.headers["User-Agent"],
          origin: `https://${event.headers.Host}`,
          path: event.requestContext.path || "/",
          lambdaName: process.env.AWS_LAMBDA_FUNCTION_NAME
        }
      })
      .catch((error) => {
        return httpResponse(error.httpCode, { code: error.name, message: error.messages.shift() });
      });
  };

  const before: middy.MiddlewareFn = async (request) => {
    try {
      const { event, context } = request;

      console.log("authorizerCoreCustom -> context ->", JSON.stringify(context));

      switch (context.functionName) {
        case `${SERVICE_NAME}-${STAGE}-cardCreateVirtualHttp`:
          return checkAuthorization(event);
        case `${SERVICE_NAME}-${STAGE}-activateCardHttp`:
          return checkAuthorization(event);
        case `${SERVICE_NAME}-${STAGE}-requestPhysicalCardHttp`:
          return checkAuthorization(event);
        case `${SERVICE_NAME}-${STAGE}-updateCardPasswordHttp`:
          return checkAuthorization(event);
        default:
          console.log("authorizerCoreCustom -> no case created to this function ->", context.functionName);
          break;
      }
    } catch (error) {
      console.error("error on middleware -> authorizerCoreCustom", JSON.stringify(error));
      return httpResponse(401, { code: "authorizer_core_custom", message: "Unauthorized." });
    }
  };

  return {
    before
  };
};

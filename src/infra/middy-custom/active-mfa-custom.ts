import { httpResponse } from "@infra/utils/aws-utils";
import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";

const valuesToSkip = process.env.CLIENTS_ID_BYPASS_MFA?.split(",");
const skipValidationMfa = (event: APIGatewayProxyEvent) =>
  valuesToSkip.some((item) => item.trim().includes(event?.requestContext?.authorizer?.claims?.aud));

export const activeMfaCustom = () => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent> = async (request) => {
    try {
      const { event, context } = request;
      if (skipValidationMfa(event)) return;
      const authorizer = event.requestContext?.authorizer?.claims;
      console.log(JSON.stringify({ message: "validation MFA is active", context, authorizer }));

      const mfaStatus = event?.requestContext?.authorizer?.claims["custom:MFA_STATUS"];
      if (mfaStatus !== "ACTIVE") {
        console.warn(JSON.stringify({ message: "MFA is inactive", context, authorizer }));
        return httpResponse(400, { code: "active_mfa_custom", message: "User's MFA is not active" });
      }
    } catch (error) {
      console.error("error on middleware", JSON.stringify(error));
      return httpResponse(401, { code: "active_mfa_custom", message: "Activate MFA!" });
    }
  };

  return {
    before
  };
};

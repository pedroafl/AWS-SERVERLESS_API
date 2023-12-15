import { getClient } from "@infra/gateways/repositories";
import { httpResponse } from "@infra/utils/aws-utils";
import middy from "@middy/core";
import { authorizeByApiGatewayEvent } from "@conta-simples/authorizer-lib";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const TABLE_NAME = "FunctionRolePermission";

export const functionRoleCustom = () => {
  const before: middy.MiddlewareFn = async (request) => {
    try {
      const { event, context } = request;
      const client = getClient();

      if (!event.requestContext.authorizer) {
        console.log("Requisição sem autenticação", { authorizer: event.requestContext.authorizer });

        return httpResponse(400, {
          code: "function_role_custom",
          message: "Request without authentication."
        });
      }

      const { Item } = await client
        .getItem({
          TableName: TABLE_NAME,
          Key: { id: { S: context.functionName } }
        })
        .promise();

      const permission = unmarshall(Item as any);

      if (!permission) {
        return httpResponse(400, {
          code: "function_role_custom",
          message: "Function without permission."
        });
      }

      authorizeByApiGatewayEvent(
        {
          profiles: permission.profiles,
          permissions: permission.profileManagementClaims
        },
        { apiGatewayEvent: event }
      );
    } catch (error) {
      console.error("error on middleware", JSON.stringify(error));
      return httpResponse(500, {
        code: "function_role_custom",
        message: error.messages?.shift() || "Error on FunctionRoleCustom middleware."
      });
    }
  };

  return {
    before
  };
};

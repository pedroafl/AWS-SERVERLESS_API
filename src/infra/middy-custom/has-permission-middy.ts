import { authorize } from "@conta-simples/authorizer-lib";
import { httpResponse } from "@infra/utils/aws-utils";
import middy from "@middy/core";
import type { APIGatewayProxyEvent } from "aws-lambda";

export namespace Permissions {
  export enum Profiles {
    EXECUTOR = "EXECUTOR",
    CARD_MANAGER = "CARD_MANAGER"
  }
  export enum Claims {
    VISUALIZAR_EXTRATO = "visualizar_extrato_completo",
    EXPORTAR_EXTRATO = "exportar_extrato",
    GERENCIAR_CARTOES = "gerenciar_cartoes"
  }
}

type PermissionInput = { permissions?: string[]; profiles?: string[] };
export const hasPermission = ({ profiles, permissions }: PermissionInput) => {
  const hasValidPermission = async (request: middy.Request<APIGatewayProxyEvent>) => {
    try {
      const {
        requestContext: {
          authorizer: { claims: authorization }
        }
      } = request.event;

      const companyId = authorization["custom:companyId"];

      authorize({ profiles, permissions }, { authorization, companyId });
    } catch (error) {
      return httpResponse(error.httpCode ?? 500, {
        code: error.name,
        message: error?.messages?.shift() ?? error.message
      });
    }
  };

  return {
    before: hasValidPermission
  };
};

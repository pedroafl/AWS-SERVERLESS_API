import { handlerPath } from "@application/config/handlerResolver";
import { Controller } from "@infra/commons/controllers";
import type { AWS } from "@serverless/typescript";
import type { Response } from "./types";
import { Mapper, Request } from "./types";
import { InvokeAdapter } from "@infra/adapters";
import { makeDeleteAccountUsecase } from "@infra/factories/usecases/account/delete-account-usecase-factory";

class DeleteAccountController extends Controller<Request, Response> {
  protected execute = async (request: Request): Promise<any> => {
    const { ...input } = request;

    const accountUsecase = await makeDeleteAccountUsecase().execute(input);

    return accountUsecase;
  };
}

const makeController = () => {
  const controller = new DeleteAccountController(new Mapper());
  return controller.run;
};

export const invoke = InvokeAdapter.invoke(makeController());

const path = `${handlerPath(__dirname)}/index`;

export const deleteAccountTriggers: AWS["functions"] = {
  invoke: {
    handler: `${path}.invoke`,
  },
};

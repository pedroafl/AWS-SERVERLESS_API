import { handlerPath } from "@application/config/handlerResolver";
import { Controller } from "@infra/commons/controllers";
import type { AWS } from "@serverless/typescript";
import type { Response } from "./types";
import { Mapper, Request } from "./types";
import { makeUpdateAccountUsecase } from "@infra/factories/usecases/account/update-account-usecase-factory";
import { InvokeAdapter } from "@infra/adapters";

class UpdateAccountController extends Controller<Request, Response> {
  protected execute = async (request: Request): Promise<any> => {
    const { ...input } = request;

    const accountUsecase = await makeUpdateAccountUsecase().execute(input);

    return accountUsecase;
  };
}

const makeController = () => {
  const controller = new UpdateAccountController(new Mapper());
  return controller.run;
};

export const invoke = InvokeAdapter.invoke(makeController());

const path = `${handlerPath(__dirname)}/index`;

export const updateAccountTriggers: AWS["functions"] = {
  invoke: {
    handler: `${path}.invoke`,
  },
};

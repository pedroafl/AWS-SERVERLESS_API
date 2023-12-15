import { handlerPath } from "@application/config/handlerResolver";
import { Controller } from "@infra/commons/controllers";
import type { AWS } from "@serverless/typescript";
import type { Response } from "./types";
import { Mapper, Request } from "./types";
import { makeCreateAccountUsecase } from "@infra/factories/usecases/account/create-account-usecase-factory";
import { InvokeAdapter } from "@infra/adapters";

class CreateAccountController extends Controller<Request, Response> {
  protected execute = async (request: Request): Promise<any> => {
    const { ...input } = request;

    const accountUsecase = await makeCreateAccountUsecase().execute(input);

    return accountUsecase;
  };
}

const makeController = () => {
  const controller = new CreateAccountController(new Mapper());
  return controller.run;
};

export const invoke = InvokeAdapter.invoke(makeController());

const path = `${handlerPath(__dirname)}/index`;

export const createAccountTriggers: AWS["functions"] = {
  invoke: {
    handler: `${path}.invoke`,
  },
};

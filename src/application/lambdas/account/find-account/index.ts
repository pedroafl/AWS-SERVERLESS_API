import { handlerPath } from "@application/config/handlerResolver";
import { Controller } from "@infra/commons/controllers";
import type { AWS } from "@serverless/typescript";
import type { Response } from "./types";
import { Mapper, Request } from "./types";
import { InvokeAdapter } from "@infra/adapters";
import { makeFindAccountUsecase } from "@infra/factories/usecases/account/find-account-usecase-factory";

class FindAccountController extends Controller<Request, Response> {
  protected execute = async (request: Request): Promise<any> => {
    const { ...input } = request;

    const accountUsecase = await makeFindAccountUsecase().execute(input);

    return accountUsecase;
  };
}

const makeController = () => {
  const controller = new FindAccountController(new Mapper());
  return controller.run;
};

export const invoke = InvokeAdapter.invoke(makeController());

const path = `${handlerPath(__dirname)}/index`;

export const findAccountTriggers: AWS["functions"] = {
  invoke: {
    handler: `${path}.invoke`,
  },
};

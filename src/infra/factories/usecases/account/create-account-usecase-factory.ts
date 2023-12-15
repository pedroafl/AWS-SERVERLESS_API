import { CreateAccountUsecase } from "@domain/account/usecases";
import { AccountDynamodbRepository } from "@infra/gateways/repositories/dynamo/account";

export const makeCreateAccountUsecase = () => {
  return new CreateAccountUsecase(new AccountDynamodbRepository());
};

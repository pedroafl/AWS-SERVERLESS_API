import { FindAccountUsecase } from "@domain/account/usecases/find-account-usecase";
import { AccountDynamodbRepository } from "@infra/gateways/repositories/dynamo/account";

export const makeFindAccountUsecase = () => {
  return new FindAccountUsecase(new AccountDynamodbRepository());
};

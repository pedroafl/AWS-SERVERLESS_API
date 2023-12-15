import { UpdateAccountUsecase } from "@domain/account/usecases/update-account-usecase";
import { AccountDynamodbRepository } from "@infra/gateways/repositories/dynamo/account";

export const makeUpdateAccountUsecase = () => {
  return new UpdateAccountUsecase(new AccountDynamodbRepository());
};

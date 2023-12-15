import { DeleteAccountUsecase } from "@domain/account/usecases/delete-account-usecase";
import { AccountDynamodbRepository } from "@infra/gateways/repositories/dynamo/account";

export const makeDeleteAccountUsecase = () => {
  return new DeleteAccountUsecase(new AccountDynamodbRepository());
};

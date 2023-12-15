import { DeleteAccountUsecase } from "@domain/account/usecases/delete-account-usecase";
import { InvokeEvent, RequestMapper } from "@infra/commons/controllers";

export class Request implements DeleteAccountUsecase.Input {
  numberAccount: number;

  constructor(init: Partial<Request>) {
    this.numberAccount = init.numberAccount;
  }
}

export type Response = DeleteAccountUsecase.Output;

export class Mapper extends RequestMapper<Request> {
  protected mapByInvoke = (event: InvokeEvent): Request => {
    return new Request({
      numberAccount: event.numberAccount,
    });
  };
}

import { CreateAccountUsecase } from "@domain/account/usecases";
import { Type } from "@domain/entities/type-enum";
import { InvokeEvent, RequestMapper } from "@infra/commons/controllers";

export class Request implements CreateAccountUsecase.Input {
  numberAccount: number;
  agency: number;
  type: Type;
  balance: number;

  constructor(init: Partial<Request>) {
    this.numberAccount = init.numberAccount;
    this.agency = init.agency;
    this.type = init.type;
    this.balance = init.balance;
  }
}

export type Response = CreateAccountUsecase.Output;

export class Mapper extends RequestMapper<Request> {
  protected mapByInvoke = (event: InvokeEvent): Request => {
    return new Request({
      numberAccount: event.numberAccount,
      agency: event.agency,
      type: event.type,
      balance: event.balance,
    });
  };
}

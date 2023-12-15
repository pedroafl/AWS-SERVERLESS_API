import { Account } from "@domain/entities/account";
import { Status } from "@domain/entities/status-enum";
import { AccountRepository } from "@domain/gateways/repositories/account-repository";
import { NotFoundException } from "@infra/exceptions/not-found-exception";

export class FindAccountUsecase {
  constructor(private readonly repository: AccountRepository) {
    this.repository = repository;
  }

  async execute(
    input: FindAccountUsecase.Input
  ): Promise<FindAccountUsecase.Output> {
    try {
      let entity = await this.repository.findAccountId(input.numberAccount);
      if (!entity) throw new NotFoundException("Conta não encontrada");

      if (entity.status === Status.INACTIVE)
        throw new NotFoundException("A conta está inativa");

      return entity;
    } catch (error) {
      throw error;
    }
  }
}

export namespace FindAccountUsecase {
  export interface Input {
    numberAccount: number;
  }

  export type Output = Account;
}

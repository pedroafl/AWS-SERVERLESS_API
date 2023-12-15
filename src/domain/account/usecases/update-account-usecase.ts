import { Account } from "@domain/entities/account";
import { Type } from "@domain/entities/type-enum";
import { AccountRepository } from "@domain/gateways/repositories/account-repository";
import { NotFoundException } from "@infra/exceptions/not-found-exception";

export class UpdateAccountUsecase {
  constructor(private readonly repository: AccountRepository) {
    this.repository = repository;
  }

  async execute(
    input: UpdateAccountUsecase.Input
  ): Promise<UpdateAccountUsecase.Output> {
    try {
      const findEntity = await this.repository.findAccountId(
        input.numberAccount
      );
      if (!findEntity) throw new NotFoundException("Conta não encontrada");

      const entity = this.mapEntity({ ...input }, findEntity);

      const result = await this.repository.update(entity);

      return result;
    } catch (error) {
      throw error;
    }
  }

  private mapEntity(
    input: UpdateAccountUsecase.Input,
    accountFind: Account
  ): Account {
    const now = new Date().toISOString();

    return new Account({
      id: accountFind.id,
      numberAccount: accountFind.numberAccount,
      agency: input.agency ? input.agency : accountFind.agency,
      type: input.type ? input.type : accountFind.type,
      status: accountFind.status,
      balance: input.balance ? input.balance : accountFind.balance,
      createdAt: accountFind.createdAt,
      updatedAt: now,
    });
  }
}

export namespace UpdateAccountUsecase {
  export interface Input {
    numberAccount: number;
    agency: number;
    type: Type;
    balance: number;
  }

  export type Output = Account;
}

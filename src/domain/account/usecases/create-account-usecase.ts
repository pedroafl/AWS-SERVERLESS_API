import { Account } from "@domain/entities/account";
import { Status } from "@domain/entities/status-enum";
import { Type } from "@domain/entities/type-enum";
import { AccountRepository } from "@domain/gateways/repositories/account-repository";

export class CreateAccountUsecase {
  constructor(private readonly repository: AccountRepository) {
    this.repository = repository;
  }

  async execute(
    input: CreateAccountUsecase.Input
  ): Promise<CreateAccountUsecase.Output> {
    try {
      const entity = this.mapEntity({ ...input });

      const result = await this.repository.save(entity);

      return result;
    } catch (error) {
      throw error;
    }
  }
  private mapEntity(input: CreateAccountUsecase.Input): Account {
    const now = new Date().toISOString();

    return new Account({
      id: `ACCOUNT#${input.numberAccount}`,
      numberAccount: input.numberAccount,
      agency: input.agency,
      type: input.type,
      status: Status.ACTIVE,
      balance: input.balance,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export namespace CreateAccountUsecase {
  export interface Input {
    numberAccount: number;
    agency: number;
    type: Type;
    balance: number;
  }

  export type Output = {
    id: string;
    numberAccount: number;
    agency: number;
    type: Type;
    status: Status;
    balance: number;
    createdAt: string;
    updatedAt?: string;
  };
}

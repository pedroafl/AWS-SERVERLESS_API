import { Status } from "@domain/entities/status-enum";
import { AccountRepository } from "@domain/gateways/repositories/account-repository";
import { NotFoundException } from "@infra/exceptions/not-found-exception";

export class DeleteAccountUsecase {
  constructor(private readonly repository: AccountRepository) {
    this.repository = repository;
  }

  async execute(
    input: DeleteAccountUsecase.Input
  ): Promise<DeleteAccountUsecase.Output> {
    try {
      let entity = await this.repository.findAccountId(input.numberAccount);
      if (!entity) throw new NotFoundException("Conta não encontrada");

      if (entity.status === Status.INACTIVE)
        throw new NotFoundException("A conta já está inativa");

      entity.status = Status.INACTIVE;

      const result = await this.repository.update(entity);

      return {
        id: result.id,
        message: "Conta bloqueada com sucesso.",
      };
    } catch (error) {
      throw error;
    }
  }
}

export namespace DeleteAccountUsecase {
  export interface Input {
    numberAccount: number;
  }

  export type Output = {
    id: string;
    message: string;
  };
}

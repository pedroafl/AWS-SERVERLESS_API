import { Account } from "@domain/entities/account";

export namespace AccountRepository {
  export type SaveInput = Account;
}

export interface AccountRepository {
  save(account: Account): Promise<Account>;
  findAccountId(numberAccount: number): Promise<Account>;
  update(account: Account): Promise<Account>;
}

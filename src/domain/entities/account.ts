import { Type } from "./type-enum";
import { Status } from "@domain/entities/status-enum";

export class Account {
  id: string;
  numberAccount: number;
  agency: number;
  type: Type;
  status: Status;
  balance: number;
  createdAt: string;
  updatedAt?: string;

  constructor(init: Partial<Account>) {
    this.id = init.id;
    this.numberAccount = init.numberAccount;
    this.agency = init.agency;
    this.type = init.type;
    this.balance = init.balance;
    this.createdAt = init.createdAt;
    this.updatedAt = init.updatedAt;
  }
}

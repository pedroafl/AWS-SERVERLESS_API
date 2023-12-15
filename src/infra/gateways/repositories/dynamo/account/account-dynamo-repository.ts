import { Type } from "@domain/entities/type-enum";
import { Account } from "@domain/entities/account";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as DynamoDB from "aws-sdk/clients/dynamodb";
import { NotFoundException } from "@infra/exceptions/not-found-exception";
import { AccountRepository } from "@domain/gateways/repositories/account-repository";
import { getClient } from "../client";
import { Status } from "@domain/entities/status-enum";

const TABLE_NAME = "account";

type NoReadonlyKeys<T> = {
  [P in keyof T]: "readonly" extends keyof T[P] ? never : P;
}[keyof T];
type PartialNoReadonly<T> = Partial<Pick<T, NoReadonlyKeys<T>>>;

class AccountEntity {
  id: string;
  numberAccount: number;
  agency: number;
  type: Type;
  status: Status;
  balance: number;
  createdAt: string;
  updatedAt?: string;

  constructor(init: PartialNoReadonly<Account>) {
    this.id = init.id;
    this.numberAccount = init.numberAccount;
    this.agency = init.agency;
    this.type = init.type;
    this.status = init.status;
    this.balance = init.balance;
    this.createdAt = init.createdAt;
    this.updatedAt = init.updatedAt;
  }

  key(): DynamoDB.Key {
    return {
      PK: { S: `ACCOUNT#${this.id}` },
    };
  }

  toItem(): Record<string, unknown> {
    const record: Record<string, unknown> = {
      id: this.id,
      numberAccount: this.numberAccount,
      agency: this.agency,
      type: this.type,
      status: this.status,
      balance: this.balance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return marshall(record, {
      convertClassInstanceToMap: true,
      removeUndefinedValues: true,
    });
  }

  static fromItem(item?: DynamoDB.AttributeMap): Account {
    if (!item) throw new NotFoundException("Nenhum registro encontrado.");
    return new Account(unmarshall(item as any) as AccountEntity);
  }
}

export class AccountDynamodbRepository implements AccountRepository {
  constructor() {}

  async save(account: Account): Promise<Account> {
    const entity = new AccountEntity(account);
    const Item = entity.toItem();

    const client = getClient();
    await client
      .putItem({
        TableName: TABLE_NAME,
        Item,
        ConditionExpression: "attribute_not_exists(PK)",
      })
      .promise();
    return AccountEntity.fromItem(Item);
  }

  async update(input: Account): Promise<Account> {
    const client = getClient();
    const now = new Date().toISOString();
    const entity = new AccountEntity({
      id: input.id,
      agency: input.agency,
      balance: input.balance,
      numberAccount: input.numberAccount,
      type: input.type,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: now,
    });

    try {
      const params: DynamoDB.UpdateItemInput = {
        TableName: TABLE_NAME,
        Key: entity.key(),
        ConditionExpression: "attribute_exists(PK)",
        UpdateExpression:
          "SET #agency = :agency, #balance = :balance, #numberAccount = :numberAccount, #type = :type, #status = :status, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#agency": "agency",
          "#balance": "balance",
          "#numberAccount": "numberAccount",
          "#type": "type",
          "#status": "status",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":agency": { N: input.agency.toString() },
          ":balance": { N: entity.balance.toString() },
          ":numberAccount": { N: entity.numberAccount.toString() },
          ":type": { S: input.type },
          ":status": { S: input.status },
          ":updatedAt": { S: new Date().toISOString() },
        },
      };

      await client.updateItem(params).promise();
      return new Account(entity);
    } catch (error) {
      throw error;
    }
  }

  async findAccountId(numberAccount: number): Promise<Account> {
    const client = getClient();
    try {
      const resp = await client
        .query({
          TableName: TABLE_NAME,
          KeyConditionExpression: "id = :id",
          ExpressionAttributeValues: {
            ":id": { S: `ACCOUNT#${numberAccount}` },
          },
        })
        .promise();
      const firstItem = resp?.Items?.shift();
      return AccountEntity.fromItem(firstItem);
    } catch (error) {
      throw error;
    }
  }
}

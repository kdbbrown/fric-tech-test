export interface Account {
  accountNumber: string;
  id: string;
  "userId": string,
  type: string;
  currency: string;
  balance: number;
}

export interface AccountsResponse extends Array<Account> {}

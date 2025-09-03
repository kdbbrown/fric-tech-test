export interface TransferRequest {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  currency: string;
  note?: string;
}

export interface TransferResponse {
  transferId: string;
  status: string;
  estimatedCompletion: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  currency: string;
  description: string;
  status: string;
}

export interface TransactionsResponse {
  items: Transaction[];
  page: number;
  pageSize: number;
  total: number;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

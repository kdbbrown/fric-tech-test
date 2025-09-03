import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Account,
  AccountsResponse,
  Transaction,
  TransactionsResponse,
  TransactionFilters,
  TransferRequest,
  TransferResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000';


  getAccounts(): Observable<AccountsResponse> {
    return this.http.get<AccountsResponse>(`${this.apiUrl}/accounts`);
  }

  getTransactions(accountId: string, filters?: TransactionFilters): Observable<TransactionsResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<TransactionsResponse>(
      `${this.apiUrl}/accounts/${accountId}/transactions`,
      { params }
    );
  }

  initiateTransfer(transferData: TransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.apiUrl}/transfer`, transferData);
  }
}

import { CommonModule } from '@angular/common';
import {Component, inject, OnInit, signal} from '@angular/core';
import { ButtonComponent } from '../../../ui/button/button.component';
import { TableDropdownComponent } from '../../../common/table-dropdown/table-dropdown.component';
import { BadgeComponent } from '../../../ui/badge/badge.component';
import {ApiService} from "../../../../../core/services/api.service";
import {AuthServiceService} from "../../../../../core/services/auth/auth-service.service";
import {TransactionsResponse} from "../../../../../core/models";
import {DatePickerComponent} from "../../../form/date-picker/date-picker.component";
import {InputFieldComponent} from "../../../form/input/input-field.component";
import {LoaderComponent} from "../../../ui/loader/loader.component";

interface Transaction {
  image: string;
  action: string;
  date: string;
  amount: string;
  category: string;
  status: "Success" | "Pending" | "Failed";
}

@Component({
  selector: 'app-basic-table-three',
  imports: [
    CommonModule,
    ButtonComponent,
    TableDropdownComponent,
    BadgeComponent,
    DatePickerComponent,
    InputFieldComponent,
    LoaderComponent,
  ],
  templateUrl: './basic-table-three.component.html',
  styles: ``
})
export class BasicTableThreeComponent implements  OnInit{
  apiService = inject(ApiService)
  authService = inject(AuthServiceService)
  accountId = this.authService.userSignal()?.id as string

  fromDate = '';
  toDate = ''
  searchQuery = ''

  transactions = signal<TransactionsResponse | null>(null)
  loadingTransactions = false
  error : string | null = null

  // Type definition for the transaction data
  ngOnInit() {
    this.loadTransactions()
  }

  loadTransactions (){
    this.apiService.getTransactions(this.accountId).subscribe({
      next: (response) => {
        this.transactions.set(response);
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);
      },error: (err) => {
        console.info(err)
        this.error = err.error
      }
    })
  }

  filterTransactions() {
    this.loadingTransactions = true;
    this.error = null;

    this.apiService.getTransactions(this.accountId, {
      from: this.fromDate,
      to: this.toDate,
      query: this.searchQuery,
      page: this.currentPage,
      pageSize: this.itemsPerPage
    }).subscribe({
      next: (response) => {
        this.transactions.set(response);
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);
        this.loadingTransactions = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error || 'Failed to load transactions.';
        this.loadingTransactions = false;
      }
    });
  }



  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 8



  handleViewMore(item: Transaction) {
    // logic here
    console.log('View More:', item);
  }

  handleDelete(item: Transaction) {
    // logic here
    console.log('Delete:', item);
  }

  getBadgeColor(status: string): 'success' | 'warning' | 'error' | 'info' {
    if (status === 'completed') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'failed') return 'error';
    if (status === 'posted') return 'info';
    return 'error';
  }

  goToPage(number: number) {
    if (number < 1 || number > this.totalPages) return;

    this.currentPage = number;
    this.filterTransactions();
  }

  onFromDateChange(event: { selectedDates: Date[], dateStr: string, instance: any }) {
    this.fromDate = event.dateStr;
    console.log('Selected date:', this.fromDate);
  }
  onToDateChange(event: { selectedDates: Date[], dateStr: string, instance: any }) {
    this.toDate = event.dateStr;
    console.log('Selected date:', this.fromDate);
  }
}

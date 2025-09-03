import {CommonModule} from '@angular/common';
import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {PageBreadcrumbComponent} from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {ComponentCardComponent} from "../../shared/components/common/component-card/component-card.component";
import {LabelComponent} from "../../shared/components/form/label/label.component";
import {SelectComponent} from "../../shared/components/form/select/select.component";
import {InputFieldComponent} from "../../shared/components/form/input/input-field.component";
import {ButtonComponent} from "../../shared/components/ui/button/button.component";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../core/services/api.service";
import {AuthServiceService} from "../../core/services/auth/auth-service.service";
import {AccountsResponse, TransferRequest} from "../../core/models";
import {LoaderComponent} from "../../shared/components/ui/loader/loader.component";

@Component({
  selector: 'app-blank',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    ComponentCardComponent,
    LabelComponent,
    SelectComponent,
    InputFieldComponent,
    ButtonComponent,
    LoaderComponent,
  ],
  templateUrl: './blank.component.html',
  styles: ``
})
export class BlankComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private authService = inject(AuthServiceService);

  loading = false;
  response: any = null;
  error: string | null = null;

  userAccounts= signal<AccountsResponse>([]);
  mappedAccounts = computed(() => {
    const accounts = this.userAccounts()
    return accounts.map((acc => ({
      ...acc,
      value: String(acc.balance),
      label: acc.balance + ' ' + acc.currency
    })))
  })

  fromAccountId = ''
  toAccountNumber = ''
  amount = ''
  currency = ''
  note = ''

  ngOnInit() {
    this.loadAccounts()
  }

  submit() {
    console.info(this.fromAccountId,this.toAccountNumber ,this.amount )
    if (!this.fromAccountId || !this.toAccountNumber || !this.amount ) {
    this.error = 'Please fill in all required fields.';
    return;
  }

    this.loading = true;
    this.error = null;
    this.response = null;
    const payload: TransferRequest = {
      fromAccountId: (this.fromAccountId as unknown as {id:string}).id,
      toAccountNumber: this.toAccountNumber,
      amount: Number(this.amount),
      currency: this.currency,
      note: this.note
    };
    this.apiService.initiateTransfer(payload).subscribe({
      next: (res) => {
        this.response = res;
        this.loading = false;
        this.clearForm();
      },
      error: (err) => {
        this.error = err?.error.error || '❌ Transfer failed';
        this.loading = false;
      }
    });
  }

  clearForm() {
    this.fromAccountId = '';
    this.toAccountNumber = '';
    this.amount = '';
    this.currency = 'XAF';
    this.note = '';
  }


  loadAccounts() {
    this.apiService.getAccounts().subscribe({
      next: (res) => {
        this.userAccounts.set(res)
      }, error: (err) => {
        console.error(err)
      }
    })
  }

  handleSelectChange($event: any) {
    this.currency = $event.currency
  }
}

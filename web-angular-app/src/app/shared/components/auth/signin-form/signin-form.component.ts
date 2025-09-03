import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {LabelComponent} from '../../form/label/label.component';
import {CheckboxComponent} from '../../form/input/checkbox.component';
import {ButtonComponent} from '../../ui/button/button.component';
import {InputFieldComponent} from '../../form/input/input-field.component';
import {Router, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthServiceService} from "../../../../core/services/auth/auth-service.service";

@Component({
  selector: 'app-signin-form',
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {
  authService = inject(AuthServiceService)
  router = inject(Router)

  showPassword = false;
  isChecked = false;

  username = '';
  password = '';

  loading = false;
  error: string | null = null;


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    const payload = {
      username: this.username,password: this.password
    }
    this.loading = true;
    this.error = null;

    this.authService.login(payload).subscribe({
      next: data => {
        this.loading = false;
        this.router.navigate(['app/dashboard'])
      },error : err => {
        this.loading = false;
        this.error = err?.error.error || 'Login failed';
      }
    })
  }
}

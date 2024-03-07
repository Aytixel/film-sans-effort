import { NgModule } from '@angular/core';
import { AuthButtonComponent } from './auth-button.component';
import { AuthService } from '../../service/auth/auth.service';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AuthButtonComponent,
    AuthModalComponent
  ],
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  providers: [
    AuthService,
    FormBuilder,
  ],
  exports: [
    AuthButtonComponent,
    AuthModalComponent,
  ]
})
export class AuthButtonModule { }

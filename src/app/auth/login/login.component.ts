import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value && !control.value.includes('?')) {
    return { mustContainQuestionMark: true };
  }
  return null;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  loginForm = new FormGroup({
    // form controls will be defined here
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  get emailIsInvalid() {
    const emailControl = this.loginForm.get('email');
    return emailControl?.touched && !emailControl?.valid;
  }

  get passwordIsInvalid() {
    const passwordControl = this.loginForm.get('password');
    return passwordControl?.touched && !passwordControl?.valid;
  }

  onSubmit() {
    const enteredEmail = this.loginForm.controls.email;
    const enteredPassword = this.loginForm.controls.password;
    console.log(enteredEmail, enteredPassword);
  }
}

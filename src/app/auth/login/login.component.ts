import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value && !control.value.includes('?')) {
    return { mustContainQuestionMark: true };
  }
  return null;
}

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }
  return of({ notUnique: true });
}

//* Alternative way to set initial email value
// in FormGroup declaration, uncomment below and set initialEmail in email FormControl

// let initialEmail = '';
// const savedForm = window.localStorage.getItem('savedLoginForm');
// if (savedForm) {
//   const parsedForm = JSON.parse(savedForm);
//   initialEmail = parsedForm.email;
// }

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  loginForm = new FormGroup({
    // form controls will be defined here
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsUnique],
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

  ngOnInit(): void {
    const savedForm = window.localStorage.getItem('savedLoginForm');
    if (savedForm) {
      const savedEmail = JSON.parse(savedForm);
      this.loginForm.patchValue({ email: savedEmail });
    }

    const subscription = this.loginForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          const savedLoginForm = {
            email: value.email,
            password: value.password,
          };
          window.localStorage.setItem(
            'savedLoginForm',
            JSON.stringify(savedLoginForm.email)
          );
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSubmit() {
    const enteredEmail = this.loginForm.controls.email;
    const enteredPassword = this.loginForm.controls.password;
    console.log(enteredEmail, enteredPassword);
  }
}

import { Component, inject, ElementRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

function equalValues(pswrd: string, confirmPswrd: string) {
  return (control: AbstractControl) => {
    const password = control.get(pswrd)?.value;
    const confirmPassword = control.get(confirmPswrd)?.value;

    if (password === confirmPassword) {
      return null;
    }
    return { valuesNotEqual: true };
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [ReactiveFormsModule],
})
export class SignupComponent {
  private elementRef = inject(ElementRef);
  signupForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      { validators: [equalValues('password', 'confirmPassword')] }
    ),
    fullName: new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        validators: [Validators.required],
      }),
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        validators: [Validators.required],
      }),
      postalCode: new FormControl('', {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
    }),

    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', {
      validators: [Validators.required],
    }),
    acquisition: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    terms: new FormControl(false, {
      validators: [Validators.requiredTrue],
    }),
  });

  onSubmit() {
    if (this.signupForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    console.log(this.signupForm);
  }

  onReset() {
    this.signupForm.reset();
    this.elementRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

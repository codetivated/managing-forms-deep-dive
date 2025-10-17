import { Component, inject, ElementRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onSubmit() {
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

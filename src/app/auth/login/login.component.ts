import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  ViewChild,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],
})
export class LoginComponent {
  // using viewChild signal from angular/core
  private form = viewChild<NgForm>('loginForm');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const savedLoginForm = window.localStorage.getItem('savedLoginForm');
      if (savedLoginForm) {
        const parsedSavedLoginForm = JSON.parse(savedLoginForm);
        const savedEmail = parsedSavedLoginForm.email;
        setTimeout(() => {
          this.form()?.controls['email'].setValue(savedEmail);
        }, 1);
      }

      const subscription = this.form()
        ?.valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) => {
            window.localStorage.setItem(
              'savedLoginForm',
              JSON.stringify({ email: value.email })
            );
          },
        });
      this.destroyRef.onDestroy(() => {
        subscription?.unsubscribe();
      });
    });
  }

  onSubmit(formData: NgForm) {
    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;
    if (formData.form.invalid) {
      console.log('Form is invalid');
      return;
    }
    console.log(enteredEmail, enteredPassword);

    formData.reset();
  }
}

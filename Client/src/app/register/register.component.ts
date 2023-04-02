import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  maxDate: Date = new Date();
  registerForm: FormGroup;
  validationErrors: string[];

  @Output() cancelRegisterEvent = new EventEmitter();
  constructor(
    private router: Router,
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 19);
  }

  ngOnInit(): void {
    this.inititalizeForm();
  }

  inititalizeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    //this obs allows to refresh the validit when a control changes
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }
  register() {
    const dob = this.getDateOnly(
      this.registerForm.controls['dateOfBirth'].value
    );
    const value = { ...this.registerForm.value, dateOfBirth: dob };
    this.accountService.register(value).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/members');
      },
      error: (err) => {
        this.validationErrors = err;
        this.toastr.error(err.error);
      },
    });
  }

  cancel() {
    this.cancelRegisterEvent.emit(false);
  }

  private getDateOnly(t: string | undefined) {
    if (!t) return undefined;
    let date = new Date(t);
    return new Date(
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }
}

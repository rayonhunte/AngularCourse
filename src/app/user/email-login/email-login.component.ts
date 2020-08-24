import { Component, OnInit, Type } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent implements OnInit {

  form: FormGroup;
  type: 'login' | 'signup' | 'reset' = 'signup';
  loading = false;
  serverMessage: string;

  constructor(private afAuth: AngularFireAuth, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', '']
    });
  }
  changeType(val: any): void {
    this.type = val;
  }

  get isLogin(): any {
    return this.type === 'login';
  }
  get isSignup(): any {
    return this.type === 'signup';
  }
  get isPasswordReset(): any {
    return this.type === 'reset';
  }

  get email(): any {
    return this.form.get('email');
  }
  get password(): any {
    return this.form.get('password')
  }
  get passwordConfirm(): any {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch(): boolean {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit() {
    this.loading = true;
    const email = this.email.value;
    const password = this.password.value;
    try {
      if(this.isLogin) {
        await  this.afAuth.signInWithEmailAndPassword(email, password);
      }
      if(this.isSignup) {
        await  this.afAuth.createUserWithEmailAndPassword(email, password)
      }
      if(this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = 'check your email';
      }

    } catch (err) {
      this.serverMessage = err
    }
    this.loading = false;
  }

}

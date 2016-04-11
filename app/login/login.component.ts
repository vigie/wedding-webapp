import {Component} from 'angular2/core';
import {GuestService} from '../guests/guests.service';
import {Guest} from '../guests/guest';
import {Control, FORM_DIRECTIVES, ControlGroup, Validators, FormBuilder} from 'angular2/common';
import {EmailValidator} from './email.validator';
import {Router, CanActivate} from 'angular2/router';
import {appInjector} from '../app-injector';

@Component({
  selector: 'mt-login',
  template: `
  <h2>{{welcomeMessage}}</h2>
  <form [ngFormModel]="form">
    <input type="string" #email required ngControl="emailControl">
    <button (click)="login($event, email.value)" [disabled]="!form.valid">log in</button>
  </form>
  `,
  styleUrls: ['app/login/login.css'],
  directives: [FORM_DIRECTIVES]
})
@CanActivate((next, prev) => {
    let injector = appInjector(false);
    let guestService = injector.get(GuestService);
    let router = injector.get(Router);
    if(guestService.loggedInGuest) {
        router.navigate(['Events']);
        return false;
    }
    return true;
})
export class LoginComponent {
    
    private _welcomeMessage = 'Hello stranger! Let us know who you are by entering your email below:'
    get welcomeMessage(): string {
        let user = this._guestService.loggedInGuest;
        return user ? user.welcomeMessage : this._welcomeMessage;
    }
    
    form: ControlGroup;
    
    emailControl: Control;
    
    login($event: Event, email: string) {
        this._guestService.getGuestByEmail(email)
            .then( guest => {
                this._guestService.loggedInGuest = guest;
                event.preventDefault();
                event.stopPropagation();
                this._router.navigate(['Events', {}]);
            })
            .catch(() => {
                this._guestService.loggedInGuest = null;
                this._welcomeMessage = `Sorry, we seem to have a different email address for you. Tell us your name so we can update our records.`
            });
    }
    
    constructor(private _guestService: GuestService, private _builder: FormBuilder, private _router: Router) {

    
        this.emailControl = new Control('', Validators.compose([Validators.required, EmailValidator.emailFormat]) );
                    this.form = this._builder.group({
                emailControl: this.emailControl
            });
    }
}
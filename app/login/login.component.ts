import {Component} from 'angular2/core';
import {GuestService} from '../guests/guests.service';
import {Guest} from '../guests/guest';
import {Control, FORM_DIRECTIVES, ControlGroup, Validators, FormBuilder} from 'angular2/common';
import {EmailValidator} from './email.validator';
import {Router, CanActivate} from 'angular2/router';
import {appInjector} from '../app-injector';
import {EmailService} from '../email.service';

@Component({
  templateUrl: 'app/login/login.html',
  styleUrls: ['app/login/login.css'],
  directives: [FORM_DIRECTIVES]
})
@CanActivate((next, prev) => {
    let injector = appInjector(false);
    let guestService = injector.get(GuestService);
    let router = injector.get(Router);
    return guestService.getLoggedInGuest()
        .then(() => {
            router.navigate(['Events']);
            return false;
        })
        .catch(() => true);
})
export class LoginComponent {
    
    private _initialGreeting = 'Hello stranger! Let us know who you are by entering your email below:';
    private _welcomeMessage: string;
    get welcomeMessage(): string {
        let user = this._guestService.loggedInGuest;
        return user ? user.welcomeMsg : this._welcomeMessage;
    }
    
    email: string;
    name: string;
    
    form: ControlGroup;
    
    emailControl: Control;
    nameControl: Control;
        
    LOGIN = 'login';
    SEND_EMAIL = 'send_email';
    EMAIL_SENT = 'email_sent';
    
    pageState;
    
    formValid(): boolean {
        if (this.pageState === this.LOGIN) {
            return this.emailControl.valid;
        } else if (this.pageState === this.SEND_EMAIL) {
            return this.emailControl.valid && this.nameControl.valid;
        }
        return true;
    }

    
    login($event: Event) {
        this._guestService.getGuestByEmail(this.email)
            .subscribe( guest => {
                if (!guest) {
                    this._guestService.loggedInGuest = null;
                    this._welcomeMessage = `Sorry, we seem to have a different email address for you. Tell us your name so we can update our records.`
                    this.pageState = this.SEND_EMAIL;
                    return;
                }
                this._guestService.loggedInGuest = guest;
                this.email = '';
                this._router.navigate(['Events', {}]);
                event.preventDefault();
                event.stopPropagation();
            },
            error => {

            });
    }
    
    sendEmail() {
        this._emailService.sendEmail(this.email, this.name)
            .subscribe(
                () => {
                    this._welcomeMessage = `Thanks ${this.name}, we received your message and will update our records with the correct email ASAP.`;
                    this.pageState = this.EMAIL_SENT;                    
                }
            );
            // .finally(() => {
            //     this._welcomeMessage = `Thanks ${this.name}, we received your message and will update our records with the correct email ASAP.`;
            //     this.pageState = this.EMAIL_SENT;
            // });
    }
    
    backToLogin() {
        this.email = '';
        this.name = '';
        this.pageState = this.LOGIN;
        this._welcomeMessage = this._initialGreeting;
    }
    
    constructor(private _guestService: GuestService, private _builder: FormBuilder, private _router: Router, private _emailService: EmailService) {
        this.pageState = this.LOGIN;
        this._welcomeMessage = this._initialGreeting;
        this.emailControl = new Control('', Validators.compose([Validators.required, EmailValidator.emailFormat]) );
        this.nameControl = new Control('', Validators.compose([Validators.required]) );
        this.form = this._builder.group({
            emailControl: this.emailControl,
            nameControl: this.nameControl
        });
    }
}
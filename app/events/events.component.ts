import {Component} from 'angular2/core';
import {Guest} from '../guests/guest';
import {GuestService} from '../guests/guests.service';
import {CanActivate, ComponentInstruction} from 'angular2/router';
import {Injector} from 'angular2/core';
import {appInjector} from '../app-injector';
import {Router} from 'angular2/router';

@Component({
  templateUrl: 'app/events/events.html'
})
@CanActivate((next, prev) => {
    let injector = appInjector(false);
    let guestService = injector.get(GuestService);
    let router = injector.get(Router);
    if(!guestService.loggedInGuest) {
        router.navigate(['Login']);
        return false;
    }
    return true;
})
export class EventsComponent {
    
    welcomeMessage: string;
    guest: Guest
    
    constructor(public _guestService: GuestService) {
        this.guest = _guestService.loggedInGuest;
        this.welcomeMessage = _guestService.loggedInGuest.welcomeMessage;
    }
}
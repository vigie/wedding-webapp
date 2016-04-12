import {Component} from 'angular2/core';
import {Guest} from '../guests/guest';
import {GuestService} from '../guests/guests.service';
import {CanActivate, ComponentInstruction} from 'angular2/router';
import {Injector} from 'angular2/core';
import {appInjector} from '../app-injector';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  templateUrl: 'app/events/events.html',
  directives: [ROUTER_DIRECTIVES]
})
@CanActivate((next, prev) => {
    let injector = appInjector(false);
    let guestService: GuestService = injector.get(GuestService);
    let router = injector.get(Router);
    return guestService.getLoggedInGuest()
        .then(() => true)
        .catch(() => {
            router.navigate(['Login']);
            return false;
        });
})
export class EventsComponent {
    
    welcomeMessage: string;
    guest: Guest
    
    rsvpGuernsey: string;
    rsvpSF: string;
    rsvpSC: string;
    
    rsvp() {
        this.guest.events.guernsey.attending = this.rsvpGuernsey;
        this.guest.events.sanFrancisco.attending = this.rsvpSF;
        this.guest.events.santaCruz.attending = this.rsvpSC;
        // TODO persist!
    }
    
    constructor(public _guestService: GuestService) {
        _guestService.getLoggedInGuest()
            .then(guest => {
                this.guest = guest;
                this.welcomeMessage = guest.welcomeMessage
                this.rsvpGuernsey = guest.events.guernsey.attending;
                this.rsvpSF = guest.events.sanFrancisco.attending;
                this.rsvpSC = guest.events.santaCruz.attending;
            });
    }
}
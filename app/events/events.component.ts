import {Component, OnInit} from 'angular2/core';
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
export class EventsComponent implements OnInit {
    
    guest: Guest
    
    rsvp() {
        this._guestService.updateGuests([this.guest]).subscribe(
            updatedGuests => console.log(updatedGuests),
            error => console.log(error)
        )
    }
    
    ngOnInit() {
        this._guestService.getLoggedInGuest()
            .then(guest => {
                this.guest = guest;
            });
    }
    
    constructor(public _guestService: GuestService) {}
}